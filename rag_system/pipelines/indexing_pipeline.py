import logging
from langchain_core.documents import Document  # Added for type checking
from rag_system.loaders.document_loader import DocumentLoader
from rag_system.splitters.pdf_splitter import PDFSplitter
from rag_system.vectorstores.vector_store_manager import VectorStoreManager

# --------------- Set up logging configuration ----------------
logger = logging.getLogger(__name__)


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
            documents = self.loader.load_pdf_documents()
            logger.info(f"Loaded {len(documents)} documents using the document loader.")
            
            # Step 2 — Split loaded documents into chunks using the provided PDF splitter
            chunks = self.pdf_splitter.split_documents(documents)
            logger.info(f"Split loaded documents into {len(chunks)} chunks using the PDF splitter.")
            
            # Step 3 — Add the resulting chunks to the vector store using the provided vector store manager
            self.vector_store_manager.add_chunks_to_vector_store(chunks)
            logger.info("Added chunks to vector store using the vector store manager.")
        
        except Exception as e:
            logger.error(f"An error occurred during the indexing pipeline: {e}")
            raise