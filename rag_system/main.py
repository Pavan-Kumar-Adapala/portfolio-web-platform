import logging
from rag_system.loaders.document_loader import DocumentLoader
from rag_system.splitters.pdf_splitter import PDFSplitter
from rag_system.vectorstores.vector_store_manager import VectorStoreManager
from rag_system.pipelines.indexing_pipeline import IndexingPipeline
from langchain_ollama import ChatOllama
from langchain.messages import SystemMessage, HumanMessage
from rag_system.rag_pipeline import RAGPipeline
from rag_system.retrieval.retriever_manager import RetrieverManager
from rag_system.generation.llm_generator import LLMGenerator

# --------------- Set up logging configuration ----------------
def configure_logging():
    logging.basicConfig(
        level=logging.INFO,       
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        filemode="a",  # Append to the log file instead of overwriting it each time the program runs
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
        pdf_splitter = PDFSplitter(chunk_size=740, chunk_overlap=0)
        vector_store_manager = VectorStoreManager(db_persistent_directory=chroma_db_dir, embeddings_model="qwen3-embedding:4b") # embeddings_model="nomic-embed-text" ) 

        
        # ---------------- Run the indexing pipeline ----------------
        indexing_pipeline = IndexingPipeline(loader=loader, pdf_splitter=pdf_splitter, vector_store_manager=vector_store_manager)
        logger.info("Indexing pipeline started.")
        indexing_pipeline.run_indexing_pipeline()
        
        logger.info("Indexing pipeline completed successfully.")

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

        query_retriever = "what is the candidate's most recent job title, company name, and location?"
        retriever = RetrieverManager(vector_store_manager=vector_store_manager)
        generator = LLMGenerator(model_name="llama3.1:latest")
        rag_pipeline = RAGPipeline(retriever=retriever, generator=generator)
        rag_pipeline.run(query=query_retriever)

    except Exception as e:
        logger.error(f"An error occurred in the main function: {e}")
        raise
    
    
if __name__ == "__main__":
    main()

# query questions to test the RAG?
# 1. How Many years of experience does the candidate have?
# 2. Does the candidate have python experience?
# 3. What are the candidate's top skills?
# 4. what is the candidate's most recent job title?
# 5. what is the candidate's most recent job title, company name, and location?