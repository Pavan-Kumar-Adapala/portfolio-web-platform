import logging
import hashlib # Added for generating unique document IDs to prevent duplicates in the vector store
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document  # Added for type checking

# --------------- Set up logging configuration ----------------
logger = logging.getLogger(__name__)


# --------------- VectorStoreManager class definition ----------------
class VectorStoreManager:
    """
    Manages storage and indexing of chunks from pdf_splitter.py so they can be searched later.
    This is often done using a VectorStore and Embeddings model (e.g., qwen3-embedding:4b, nomic-embed-text:v1.5).
    """

    def __init__(self, db_persistent_directory: str = "../db/chroma_db", embeddings_model: str = "qwen3-embedding:4b") -> None:
        """
        Initialize VectorStoreManager

        Args:
            db_persistent_directory (str): Path to directory where Chroma DB should be persisted
            embeddings_model (str): Model name to use for embeddings
        """
        try:
            self.embeddings_model = OllamaEmbeddings(model=embeddings_model)
            logger.info(f"Initialized OllamaEmbeddings with model: {embeddings_model}")
            self.vector_store = Chroma(
                                        collection_name="resume_pdf_chunks",
                                        embedding_function=self.embeddings_model,
                                        persist_directory=db_persistent_directory,
                                    )
            logger.info(f"Initialized Chroma vector store with collection name: 'resume_pdf_chunks' and persist directory: {db_persistent_directory}")
        except Exception as e:
            logger.error(f"Failed to initialize VectorStoreManager: {e}")
            raise
    
    # Added method to generate a unique ID for each chunk based on its content using SHA-256 hashing (method type is private since it's an internal utility function)
    def _generate_chunk_id(self, chunk: Document) -> str: 
        """
        Create deterministic ID from chunk content.
        Prevents duplicates when re-indexing.
        """
        content = chunk.page_content
        return hashlib.sha256(content.encode()).hexdigest()
        
    def add_chunks_to_vector_store(self, chunks: list) -> None:
        """
        Adds a list of chunks to the vector store.

        Args:
            chunks (list): list of chunks to add to the vector store (expected to be LangChain Document objects)

        Returns:
            None
        """
        if not chunks or not all(isinstance(chunk, Document) for chunk in chunks):
            logger.error("Invalid chunks provided: must be a non-empty list of Document objects")
            raise ValueError("Chunks must be a list of LangChain Document objects")
        
        try:
            ids = [self._generate_chunk_id(chunk) for chunk in chunks]
            self.vector_store.add_documents(documents=chunks, ids=ids)
            logger.info(f"Added {len(chunks)} chunks to vector store with generated IDs.")
        except Exception as e:
            logger.error(f"Failed to add chunks to vector store: {e}")
            raise 