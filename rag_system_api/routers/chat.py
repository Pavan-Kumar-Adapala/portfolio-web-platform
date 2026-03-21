"""
Chat router - Handles chat-related endpoints
"""
import os
from fastapi import APIRouter, HTTPException
from rag_system_api.schemas import ChatRequest, ChatResponse
# from rag_system.main import main
from rag_system_api.dependencies import RAGSystemDependencies
from rag_system.utils.logger import Logger


# --------------- Set up logging configuration ----------------
logger = Logger.get_logger(__name__)

# router = APIRouter(prefix="/chat", tags=["chat"])
router = APIRouter(prefix="/chat", tags=["chat"])  # Updated prefix to "/chat" for better clarity


@router.post("/question", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Endpoint to handle chat messages/questions"""
    try:
        if not request.question or not isinstance(request.question, str):
            logger.error("Question must be a non-empty string.")
            raise HTTPException(status_code=400, detail="Question must be a non-empty string.")

        deps   = RAGSystemDependencies()
        logger.info(f"RAG dependencies initialized successfully. Running RAG pipeline for the incoming question.")
        answer = deps.get_rag_pipeline().run(query=request.question, top_k=deps.get_top_k()) # before it main(retriever=request.question) but now we are directly calling the RAG pipeline with the question and top_k parameters
        logger.info(f"RAG pipeline completed successfully. Returning response to the chatbot.")
        return ChatResponse(question=request.question, answer=answer, status="success")

    except Exception as e:
        logger.error(f"Error occurred while processing the question: {request.question}. Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")