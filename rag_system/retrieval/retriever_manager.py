from langchain_core.documents import Document
from rag_system.utils.logger import Logger

# --------------- Set up logging configuration ----------------
logger = Logger.get_logger(__name__)


# --------------- RetrieverManager class definition ----------------
class RetrieverManager:
    """
    Manages the retrieval process in a RAG system, including retrieving relevant chunks from the vector store based on a user query and preparing those chunks for use as context in LLM generation.
    """
    def __init__(self, vector_store_manager) -> list[Document]:
        self.vector_store_manager = vector_store_manager  # instance variable to store the VectorStoreManager instance for retrieving relevant chunks from the vector store
        logger.info("RetrieverManager initialized with provided vector store manager.")

    def retrieve_relevant_documents(self, query: str, top_k: int = 2) -> list:
        """
        Retrieves relevant documents from the vector store based on a user query.

        Args:
            query (str): The user query for which relevant documents need to be retrieved.
            top_k (int): The number of top relevant documents to retrieve. Defaults to 2.

        Returns:
            list: A list of Document objects representing the retrieved chunks.
        """
        relevent_documents = self.vector_store_manager.vector_store_db.similarity_search(query, k=top_k)
        logger.info(f"Retrieved {len(relevent_documents)} relevant documents for query: {query}")
        return relevent_documents