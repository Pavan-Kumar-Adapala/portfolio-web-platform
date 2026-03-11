import os, logging
from langchain_community.document_loaders import PyPDFDirectryLoader

# --------------- Set up logging configuration ----------------
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S'
                    )
logger = logging.getLogger(__name__)


# --------------- DocumentLoader class definition ----------------
class DocumentLoader:
    """
    _summary_
    """
    def __init__(self, directory_path: str) -> None:
        """
        Initializes a DocumentLoader instance with a given directory path.

        Args:
            directory_path (str): The path to the directory containing the pdf_documents to be loaded.

        Returns:
            None
        """
        self.directory_path = directory_path # instance variable to store the directory path for loading pdf_documents

    # ---------------- Method to load pdf_documents from the specified directory ----------------
    def load_pdf_documents(self) -> list:

        """
        Loads pdf_documents from the specified directory path.

        Returns:
            list[Document]: A list of Document objects containing the loaded pdf_documents.
        """
        # Check if the directory path is valid and is available
        if not self.directory_path:
            logger.error("Directory path cannot be empty.")
            raise ValueError("Directory path cannot be empty.")
        if not isinstance(self.directory_path, str):
            logger.error("Directory path must be a string.")
            raise TypeError("Directory path must be a string.")
        if not os.path.exists(self.directory_path):
            logger.error(f"Directory {self.directory_path} does not exist.")
            raise FileNotFoundError(f"Directory {self.directory_path} does not exist.")
        
        loader = PyPDFDirectryLoader(self.directory_path)
        pdf_documents = loader.load()

        logger.info(f"Loaded {len(pdf_documents)} pdf_documents from {self.directory_path}")
        if not pdf_documents:
            logger.warning(f"No pdf_documents found in directory {self.directory_path}.")
        
        return pdf_documents
