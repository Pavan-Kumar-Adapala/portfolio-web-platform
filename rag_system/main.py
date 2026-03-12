import logging
from rag_system.loaders.document_loader import DocumentLoader
from rag_system.splitters.pdf_splitter import PDFSplitter
from rag_system.vectorstores.vector_store_manager import VectorStoreManager
from rag_system.pipelines.indexing_pipeline import IndexingPipeline

# --------------- Set up logging configuration ----------------
def configure_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        filemode="a",  # Append to log file instead of overwriting
        filename="./rag_system/rag_system.log"  # Log file name, if not existed create one
        )

# --------------- Main function to run the indexing pipeline ----------------
def main():
    configure_logging()  # Set up logging configuration
    logger = logging.getLogger(__name__)
    try:
        # ---------------- Configurations ----------------
        directory_path = "./pdf_documents_folder"
        chroma_db_dir = "./db/chroma_db"
        logger.info(f"Directory path: {directory_path}")
        logger.info(f"Chroma DB directory: {chroma_db_dir}")

        # ---------------- Initialize components (in simple terms, instance objects) ----------------
        loader = DocumentLoader(directory_path=directory_path)
        pdf_splitter = PDFSplitter(chunk_size=500, chunk_overlap=50)
        vector_store_manager = VectorStoreManager(db_persistent_directory=chroma_db_dir, embeddings_model="nomic-embed-text") # embeddings_model="qwen3-embedding:4b")

        
        # ---------------- Run the indexing pipeline ----------------
        indexing_pipeline = IndexingPipeline(loader=loader, pdf_splitter=pdf_splitter, vector_store_manager=vector_store_manager)
        indexing_pipeline.run_indexing_pipeline()
        
        logger.info("Indexing pipeline completed successfully.")
    
    except Exception as e:
        logger.error(f"An error occurred in the main function: {e}")
        raise
    
    
if __name__ == "__main__":
    main()