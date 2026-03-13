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

    def run(self, query: str):

        logger.info(f"Running RAG pipeline for query: {query}")

        relevent_documents = self.retriever.retrieve_relevant_documents(query)
        answer = self.generator.generate_response(query=query, relevent_documents=relevent_documents)

        logger.info(f"----------------------------- Final Answer -------------------------------------")
        logger.info(f"{answer}")
        print(answer)
        