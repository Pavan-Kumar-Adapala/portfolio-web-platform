import hashlib # Added for generating unique document IDs to prevent duplicates in the vector store
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document  # Added for type checking
from rag_system.utils.logger import Logger

# --------------- Set up logging configuration ----------------
logger = Logger.get_logger(__name__)


# --------------- VectorStoreManager class definition ----------------
class VectorStoreManager:
    """
    Manages storage and indexing of chunks from pdf_splitter.py so they can be searched later.
    This is often done using a VectorStore and Embeddings model (e.g., qwen3-embedding:4b, nomic-embed-text:v1.5).
    """

    def __init__(self, db_persistent_directory: str = "../db/chroma_db", embeddings_model: str = "qwen3-embedding:4b", ollama_host: str = "http://localhost:11434") -> None:
        """
        Initialize VectorStoreManager

        Args:
            db_persistent_directory (str): Path to directory where Chroma DB should be persisted
            embeddings_model (str): Model name to use for embeddings
        """
        try:
            self.embeddings_model = OllamaEmbeddings(model=embeddings_model, base_url=ollama_host)
            logger.info(f"Initialized OllamaEmbeddings with model: {embeddings_model}")
            self.vector_store_db = Chroma(
                                        collection_name="resume_pdf_chunks",
                                        embedding_function=self.embeddings_model,
                                        persist_directory=db_persistent_directory,
                                        collection_metadata={"hnsw:space": "cosine"} # Optional metadata for HNSW index configuration, e.g., using cosine similarity for vector comparisons
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
        
    def add_chunks_to_vector_store_db(self, chunks: list) -> None:
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
            ids = [self._generate_chunk_id(chunk) for chunk in chunks] # Generate unique IDs for each chunk, which helps prevent duplicates in the vector store when re-indexing the same documents multiple times (e.g., during development or if the indexing pipeline is run multiple times)
            self.vector_store_db.add_documents(documents=chunks, ids=ids)
            logger.info(f"Added {len(chunks)} chunks to vector store with generated IDs.")
            logger.info("Step 3: Adding chunks to vector store completed.")
        except Exception as e:
            logger.error(f"Failed to add chunks to vector store: {e}")
            raise 