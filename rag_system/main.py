import os
import argparse
import yaml
from rag_system.loaders.document_loader import DocumentLoader
from rag_system.splitters.pdf_splitter import PDFSplitter
from rag_system.vectorstores.vector_store_manager import VectorStoreManager
from rag_system.pipelines.indexing_pipeline import IndexingPipeline
# from langchain_ollama import ChatOllama
# from langchain.messages import SystemMessage, HumanMessage
from rag_system.pipelines.rag_pipeline import RAGPipeline
from rag_system.retrieval.retriever_manager import RetrieverManager
from rag_system.generation.llm_generator import LLMGenerator
from rag_system.utils.file_tracker import FileTracker
from rag_system.utils.logger import Logger

CONFIGURATION_FILE_PATH = "./configurations/rag_system/config.yaml"

logger = Logger.get_logger(__name__)

# --------------- Main function to run the indexing pipeline ----------------
def main(query_retriever: str):
    Logger.configure_logging()  # Configure logging at the start of the application
    try:
        # ---------------- Load configuration from YAML file ----------------
        with open(CONFIGURATION_FILE_PATH, "r") as config_file:
            config = yaml.safe_load(config_file)

        directory_path = config["directory_path"]
        chroma_db_dir = config["chroma_db_dir"]
        embeddings_model = config["embeddings_model"]
        chunk_size = config["chunk_size"]
        chunk_overlap = config["chunk_overlap"]
        llm_model = config["llm_model"]
        top_k = config["top_k"]

        # ---------------- Print configuration details ----------------
        logger.info(f"Directory path: {directory_path}")
        logger.info(f"Chroma DB directory: {chroma_db_dir}")
        logger.info(f"Embeddings model: {embeddings_model}")
        logger.info(f"Chunk size: {chunk_size}, Chunk overlap: {chunk_overlap}")
        logger.info(f"LLM model: {llm_model}, Top k: {top_k}")
        # Always initialized — needed for RAG pipeline regardless of indexing
        vector_store_manager = VectorStoreManager(db_persistent_directory=chroma_db_dir, embeddings_model=embeddings_model) # embeddings_model="nomic-embed-text" ) 
        file_tracker = FileTracker(pdf_documents_folder=directory_path)  # Initialize the FileTracker to track changes in the pdf_documents_folder
        
        # Tracking changes in the pdf_documents_folder using the FileTracker utility class to determine if the indexing pipeline needs to be re-run
        if file_tracker.check_for_changes():  # Check for changes in the pdf_documents_folder using the FileTracker utility class
            logger.info(f"Changes detected in the {directory_path} folder. Running the indexing pipeline.")
            loader = DocumentLoader(directory_path=directory_path)
            pdf_splitter = PDFSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
            indexing_pipeline = IndexingPipeline(loader=loader, pdf_splitter=pdf_splitter, vector_store_manager=vector_store_manager)
            indexing_pipeline.run_indexing_pipeline()
            try:
                file_tracker.update_tracker()  # Update the tracked files after running the indexing pipeline
                logger.info(f"Tracked files updated successfully after indexing.")
            except Exception as e:
                logger.error(f"Error updating tracked files after indexing: {e}")
        else:
            logger.info(f"No changes detected in the {directory_path} folder. Skipping the indexing pipeline.")
        

        # ---------------- Test retrieval ----------------

        # Approach 1: Use the retriever interface to retrieve relevant documents for a sample query 
        # Step 1: Define a sample query 
        # query_retriever = "Does the candidate have python experience?"

        # # Step 2: Define the retriever 
        # retriever = vector_store_manager.vector_store_db.as_retriever(search_type="similarity", search_kwargs={"k": 2})  #  Retrieve top 2 relevant chunks for the query
        # # Step 3: Use the retriever to retrieve relevant documents for the query
        # relevent_documents = retriever.invoke(query_retriever)  

        # # Step 4: Log the retrieved documents for verification
        # print(f"\n Retrieved documents for query: {query_retriever}")
        # for i, doc in enumerate(relevent_documents, start=1):
        #     print(f"Document {i}:\n{doc.page_content}\n")  # Log the first 200 characters of each retrieved document for verification
        

        # Approach 2: Use the internal method of the vector store to retrieve relevant documents for a sample query (for testing purposes, in production you would typically use the public interface of the retriever)
        # Step 1 and Step 4 is same as Approach 1, no Step 2, and difference in Step 3
        # Step 3: Use the internal method to retrieve relevant documents for the query (for testing purposes, in production you would typically use the public interface of the retriever)
        # relevent_documents = vector_store_manager.vector_store_db.similarity_search(query_retriever, k=2)  
        # print(f"Retrieved {len(relevent_documents)} relevant documents for query: '{query_retriever}'")
        # for i, doc in enumerate(relevent_documents, start=1):
        #     print(f"Document {i}:\n{doc.page_content[:200]}...\n")

        # ---------------- LLM response generation (optional, for testing purposes) ----------------
        # system_message = """You are a helpful assistant answering questions about a professional's resume and experience. 
        # Answer based on the provided context. If the context doesn't contain the answer, say so clearly."""

        # combined_input = f"""Based on the following documents, answer the question: {query_retriever}

        # Documents:
        # {"\n\n".join([doc.page_content for doc in relevent_documents])}

        # Please provide a concise answer based on the information from the retrieved documents. If the information is not available in the documents, say I don't have enough information to answer the question.
        # """

        # # Step 1: Initialize the LLM (e.g., ChatOllama)
        # llm_model = ChatOllama(model="llama3.1:latest")  # Initialize the LLM with the desired model (e.g., qwen2-7b-chat:latest)
        
        # messages = [
        #             SystemMessage(content=system_message), 
        #             HumanMessage(content=combined_input)
        #             ]
        # response = llm_model.invoke(messages)  # Generate a response from the LLM using the prompt that includes the retrieved documents as context
        # print(f"\nLLM Response:\n{response}")  # Log the generated response from the LLM for verification
        # print(f"------------------------------------------------------------------------------------")
        # print(f"\nLLM Response:\n{response.content}")

        retriever = RetrieverManager(vector_store_manager=vector_store_manager)
        generator = LLMGenerator(model_name=llm_model)
        rag_pipeline = RAGPipeline(retriever=retriever, generator=generator)
        answer = rag_pipeline.run(query=query_retriever, top_k=top_k)
        return answer

    except Exception as e:
        logger.error(f"An error occurred in the main function: {e}")
        raise
    
    
if __name__ == "__main__":
    # Run the main function to execute the indexing pipeline and test retrieval and LLM response generation
    parser = argparse.ArgumentParser(description="Run the RAG system indexing pipeline and test retrieval and LLM response generation.")
    parser.add_argument(
        "-q",
        "--query_retriever",
        type=str,
        required=True,
        help="Sample query string (e.g., 'Does the candidate have python experience?') to test retrieval and LLM response generation."
    )
    args = parser.parse_args()

    main(query_retriever=args.query_retriever)

# query questions to test the RAG?
# 1. How Many years of experience does the candidate have?
# 2. Does the candidate have python experience?
# 3. What are the candidate's top skills?
# 4. what is the candidate's most recent job title?
# 5. what is the candidate's most recent job title, company name, and location?
# 6. What are the candidate's past job titles and companies?