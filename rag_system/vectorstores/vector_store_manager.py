import logging
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document  # Added for type checking

# --------------- Set up logging configuration ----------------
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S'
                    )
logger = logging.getLogger(__name__)


# --------------- VectorStoreManager class definition ----------------
class VectorStoreManager:
    """
    Manages storage and indexing of chunks from pdf_splitter.py so they can be searched later.
    This is often done using a VectorStore and Embeddings model (e.g., qwen3-embedding:4b, nomic-embed-text:v1.5).
    """

    def __init__(self, db_persistent_directory: str = "./chroma_db", embeddings_model: str = "qwen3-embedding:4b") -> None:
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
            document_ids = self.vector_store.add_documents(chunks) 
            logger.info(f"Added {len(chunks)} chunks to vector store with document IDs: {document_ids}")
        except Exception as e:
            logger.error(f"Failed to add chunks to vector store: {e}")
            raise 