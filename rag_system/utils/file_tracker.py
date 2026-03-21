import yaml
import os
import hashlib
import json
from rag_system.utils.logger import Logger

# --------------- Set up logging configuration ----------------
logger = Logger.get_logger(__name__)


CONFIGURATION_FILE_PATH = "./configurations/rag_system/config.yaml"

# my intenstion is check any new file added to the pdf_documents_folder or any file updated or deleted, if yes then run the indexing pipeline, if no then skip the indexing pipeline, to avoid re-indexing every time the program runs (in production, you would typically have a separate process for indexing and a separate process for running the RAG pipeline, and you would not want to re-index every time you run the RAG pipeline)
class FileTracker:
    """
    Utility class to track files in the pdf_documents_folder and detect changes (new files, updated files, deleted files) to determine if the indexing pipeline needs to be re-run.
    """

    def __init__(self, pdf_documents_folder):
        # Load configuration from YAML file
        with open(CONFIGURATION_FILE_PATH, "r") as config_file:
            config = yaml.safe_load(config_file)
        self.tracker_file = config.get("tracker_file", "db/indexed_files.json")
        self.pdf_documents_folder = pdf_documents_folder
        self.tracked_files = self.load_tracked_files()

    def _hash_file(self, filepath: str) -> str:
        """
        Calculate the MD5 hash of a file.
        """
        if not os.path.isfile(filepath):
            logger.error(f"File {filepath} does not exist.")
            return ""
        
        hasher = hashlib.md5()
        try:
            with open(filepath, "rb") as f:
                while chunk := f.read(8192):
                    hasher.update(chunk)
            logger.info(f"File hashed successfully: {filepath}")
        except Exception as e:
            logger.error(f"Error hashing file {filepath}: {e}")
            return ""
        return hasher.hexdigest()

    def load_tracked_files(self) -> dict:
        """
        Load the tracked files and their hashes from the tracker file. 
        If the tracker file does not exist or is invalid, return an empty dictionary.
        """
        if os.path.exists(self.tracker_file):
            try:
                with open(self.tracker_file, "r") as f:
                    data = json.load(f)
                logger.info(f"Tracked files loaded from {self.tracker_file}")
                return data
            except json.JSONDecodeError as e:
                logger.error(f"Error loading tracked files from {self.tracker_file}: {e}")
                return {}
        else:
            return {}
        
    def save_tracked_files(self) -> None:
        """
        Persist tracked files to the tracker JSON file.
        """
        os.makedirs(os.path.dirname(self.tracker_file), exist_ok=True)
        try:
            with open(self.tracker_file, "w") as f:
                json.dump(self.tracked_files, f, indent=4)
            logger.info(f"Tracked files saved to {self.tracker_file}")
        except Exception as e:
            logger.error(f"Error saving tracked files to {self.tracker_file}: {e}")

    def update_tracker(self) -> None:
        """Call this after successful indexing to record current file hashes."""
        pdf_files = [f for f in os.listdir(self.pdf_documents_folder) if f.endswith(".pdf")]
        for file in pdf_files:
            filepath = os.path.join(self.pdf_documents_folder, file)
            self.tracked_files[file] = self._hash_file(filepath)
        self.save_tracked_files()
        logger.info("Tracker updated after successful indexing.")
        
    def check_for_changes(self) -> bool:
        """Check for new, updated, or deleted PDF files in the pdf_documents_folder and update the tracked files accordingly."""

        if not os.path.exists(self.pdf_documents_folder):
            logger.warning(f"PDF documents folder not found: {self.pdf_documents_folder}")
            return False

        pdf_files = [f for f in os.listdir(self.pdf_documents_folder) if f.endswith(".pdf")]

        if not pdf_files:
            logger.warning(f"No PDF files found in the directory: {self.pdf_documents_folder}")
            return False
        
        # Check for new or modified files
        for file in pdf_files:
            file_path = os.path.join(self.pdf_documents_folder, file)
            file_hash = self._hash_file(file_path)

            # Check for new PDF files
            if file not in self.tracked_files:
                logger.info(f"New file detected: {file}")
                return True
            # Check for modified PDF files using file hash comparison   
            elif self.tracked_files[file] != file_hash:
                logger.info(f"Modified PDF detected: {file}")
                return True
            else:
                logger.info(f"No changes detected for file: {file}")
            
                
        # Check for deleted files
        for tracked_file in list(self.tracked_files.keys()):
            if tracked_file not in pdf_files:
                logger.info(f"Deleted file detected: {tracked_file}")
                del self.tracked_files[tracked_file]
                self.save_tracked_files()   # persist the deletion
                return True
        
        logger.info("No changes detected in the PDF documents folder.")
        
        return False
