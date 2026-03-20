import logging
from rag_system.retrieval.retriever_manager import RetrieverManager
from rag_system.generation.llm_generator import LLMGenerator

logger = logging.getLogger(__name__)


class RAGPipeline:
    """
    Full RAG pipeline:
    Query → Retrieval → LLM Generation
    """

    def __init__(self, retriever: RetrieverManager, generator: LLMGenerator):
        self.retriever = retriever
        self.generator = generator
        logger.info("RAGPipeline initialized with provided retriever and generator.")

    def run(self, query: str, top_k: int = 2) -> str:

        logger.info(f"Running RAG pipeline for query: {query}")
        logger.info(f"Step 1: Retrieve relevant documents for the query using the retriever manager started.")
        relevent_documents = self.retriever.retrieve_relevant_documents(query, top_k=top_k)

        logger.info(f"Step 2: Generate response using the LLM generator started.")
        answer = self.generator.generate_response(query, relevent_documents)
        logger.info(f"----------------------------- Final Answer -------------------------------------")
        logger.info(f"{answer}") 
        
        return answer        