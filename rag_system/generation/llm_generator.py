import logging
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

# --------------- Set up logging configuration ----------------
logger = logging.getLogger(__name__)

# --------------- LLMGenerator class definition ----------------
class LLMGenerator:
    """
    Generates responses from a language model (LLM) based on a system message and combined input (which includes the user query and retrieved documents as context) in a RAG system.
    """
    def __init__(self, model_name: str = "llama3.1:latest") -> None:
        self.llm_model = ChatOllama(model=model_name)  # Initialize the LLM model
        logger.info("LLMGenerator initialized with provided LLM model.")

    def generate_response(self, query: str, relevent_documents: list) -> str:
        """
        Generates a response from the LLM based on the provided system message and combined input (which includes the user query and retrieved documents as context).

        Args:
            query (str): The user's query.
            relevent_documents (list): A list of relevant documents retrieved from the vector store to be used as context for generating the response.
        
        Returns:
            str: The generated response from the LLM.
        """

        system_message = """You are a helpful assistant answering questions about a professional's resume and experience. 
        Answer based on the provided context. If the context doesn't contain the answer, say so clearly."""

        combined_input = f"""Based on the following documents, answer the question: {query}

        Documents:
        {"\n\n".join([doc.page_content for doc in relevent_documents])}

        Please provide a concise answer based on the information from the retrieved documents. If the information is not available in the documents, say I don't have enough information to answer the question.
        """

        messages = [
                    SystemMessage(content=system_message), 
                    HumanMessage(content=combined_input)
                    ]
        
        response = self.llm_model.invoke(messages)  # Generate a response from the LLM using the prompt that includes the retrieved documents as context
        logger.info(f"\nLLM Response:\n{response}")  # Log the generated response from the LLM for verification
        # logger.info(f"------------------------------------------------------------------------------------")
        # logger.info(f"\nLLM Response:\n{response.content}")

        return response.content