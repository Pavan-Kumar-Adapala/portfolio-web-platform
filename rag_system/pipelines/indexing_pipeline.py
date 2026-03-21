from langchain_core.documents import Document  # Added for type checking
from rag_system.loaders.document_loader import DocumentLoader
from rag_system.splitters.pdf_splitter import PDFSplitter
from rag_system.vectorstores.vector_store_manager import VectorStoreManager
from rag_system.utils.logger import Logger

# --------------- Set up logging configuration ----------------
logger = Logger.get_logger(__name__)


# --------------- IndexingPipeline class definition ----------------
class IndexingPipeline:
    """
    Orchestrates the entire indexing process for a RAG system, including loading documents, splitting them into chunks, and adding those chunks to a vector store for later retrieval.
    """
    def __init__(self, loader: DocumentLoader, pdf_splitter: PDFSplitter, vector_store_manager: VectorStoreManager) -> None:
        self.loader = loader # instance variable to store the DocumentLoader instance for loading documents
        self.pdf_splitter = pdf_splitter
        self.vector_store_manager = vector_store_manager
        logger.info("IndexingPipeline initialized with provided document loader, PDF splitter, and vector store manager.")

    def run_indexing_pipeline(self) -> None:
        """
        Executes the indexing pipeline by loading documents, splitting them into chunks, and adding those chunks to the vector store.

        Returns:
            None
        """
        try:
            # Step 1 — Load documents using the provided document loader
            logger.info(f"Step 1: Load documents using the provided document loader started.")
            documents = self.loader.load_pdf_documents()
            
            # Step 2 — Split loaded documents into chunks using the provided PDF splitter
            logger.info(f"Step 2: Split loaded documents into chunks started.")
            chunks = self.pdf_splitter.split_documents(documents)
            
            # Step 3 — Add the resulting chunks to the vector store using the provided vector store manager
            logger.info("Step 3: Adding chunks to vector store started.")
            self.vector_store_manager.add_chunks_to_vector_store_db(chunks)
        
        except Exception as e:
            logger.error(f"An error occurred during the indexing pipeline: {e}")
            raise