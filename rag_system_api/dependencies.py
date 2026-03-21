import yaml
from rag_system.loaders.document_loader import DocumentLoader
from rag_system.splitters.pdf_splitter import PDFSplitter
from rag_system.vectorstores.vector_store_manager import VectorStoreManager
from rag_system.pipelines.indexing_pipeline import IndexingPipeline
from rag_system.pipelines.rag_pipeline import RAGPipeline
from rag_system.retrieval.retriever_manager import RetrieverManager
from rag_system.generation.llm_generator import LLMGenerator
from rag_system.utils.file_tracker import FileTracker
from rag_system.utils.logger import Logger

logger = Logger.get_logger(__name__)

CONFIGURATION_FILE_PATH = "./configurations/rag_system/config.yaml"


class RAGSystemDependencies:
    """
    Singleton class managing shared RAG system dependencies.
    Initialized once at startup, reindexes only when PDF changes detected.
    """
    _instance = None

    def __new__(cls) -> "RAGSystemDependencies":
        """
        Ensures only one instance of RAGSystemDependencies exists (singleton pattern).
        Initializes dependencies only once at startup.
        """
        if cls._instance is None:
            instance = super(RAGSystemDependencies, cls).__new__(cls)
            try:
                instance._initialize_dependencies()
            except Exception:
                # Ensure _instance is not set if initialization fails
                cls._instance = None
                raise
            cls._instance = instance
        return cls._instance

    @classmethod
    def reset(cls):
        """Reset singleton — call before reindex to force re-initialization."""
        logger.info("RAGSystemDependencies singleton reset.")
        cls._instance = None

    def _initialize_dependencies(self):
        config = self._load_configuration(CONFIGURATION_FILE_PATH)

        # Store all config values as instance variables
        self.directory_path   = config["directory_path"]
        self.chroma_db_dir    = config["chroma_db_dir"]
        self.embeddings_model = config["embeddings_model"]
        self.chunk_size       = config["chunk_size"]
        self.chunk_overlap    = config["chunk_overlap"]
        self.llm_model        = config["llm_model"]
        self.top_k            = config["top_k"]

        logger.info(f"Directory path: {self.directory_path}")
        logger.info(f"Chroma DB directory: {self.chroma_db_dir}")
        logger.info(f"Embeddings model: {self.embeddings_model}")
        logger.info(f"Chunk size: {self.chunk_size}, Chunk overlap: {self.chunk_overlap}")
        logger.info(f"LLM model: {self.llm_model}, Top k: {self.top_k}")

        # Always initialized — connects to existing ChromaDB
        self.vector_store_manager = VectorStoreManager(
            db_persistent_directory=self.chroma_db_dir,
            embeddings_model=self.embeddings_model
        )

        # Conditional indexing
        self.file_tracker = FileTracker(pdf_documents_folder=self.directory_path)

        if self.file_tracker.check_for_changes():
            logger.info(f"Changes detected in {self.directory_path}. Running indexing pipeline.")
            self._run_indexing()
        else:
            logger.info(f"No changes detected in {self.directory_path}. Skipping indexing pipeline.")

        # Always initialized for query serving
        self.retriever_manager = RetrieverManager(
            vector_store_manager=self.vector_store_manager
        )
        self.llm_generator = LLMGenerator(model_name=self.llm_model)
        self.rag_pipeline  = RAGPipeline(
            retriever=self.retriever_manager,
            generator=self.llm_generator
        )
        logger.info("RAG pipeline initialized and ready.")

    def _run_indexing(self):
        """Runs indexing pipeline and updates tracker. Separated for reuse in reindex."""
        try:
            # Local variables — not stored on instance
            loader            = DocumentLoader(directory_path=self.directory_path)
            pdf_splitter      = PDFSplitter(
                                    chunk_size=self.chunk_size,
                                    chunk_overlap=self.chunk_overlap
                                )
            indexing_pipeline = IndexingPipeline(
                                    loader=loader,
                                    pdf_splitter=pdf_splitter,
                                    vector_store_manager=self.vector_store_manager
                                )
            indexing_pipeline.run_indexing_pipeline()
            self.file_tracker.update_tracker()
            logger.info("Indexing pipeline completed. Tracker updated.")
        except Exception as e:
            logger.error(f"Error during indexing pipeline: {e}")
            raise

    @staticmethod
    def _load_configuration(config_file_path: str) -> dict:
        try:
            with open(config_file_path, "r") as file:
                config = yaml.safe_load(file)
            logger.info(f"Configuration loaded from {config_file_path}")
            return config
        except FileNotFoundError:
            logger.error(f"Configuration file not found: {config_file_path}")
            raise
        except yaml.YAMLError as e:
            logger.error(f"Error parsing YAML configuration: {e}")
            raise

    # Separate getters instead of tuple return
    def get_rag_pipeline(self) -> RAGPipeline:
        return self.rag_pipeline

    def get_top_k(self) -> int:
        return self.top_k