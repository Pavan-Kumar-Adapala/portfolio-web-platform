"""
Chat router - Handles chat-related endpoints
"""
from fastapi import APIRouter, HTTPException
from ..models.schemas import ChatRequest, ChatResponse, SetupRequest
from ..rag.rag_pipeline import RAGPipeline
import os

router = APIRouter(prefix="/api/chat", tags=["chat"])

# Global RAG pipeline instance
rag_pipeline = None


def get_rag_pipeline():
    """Get or create RAG pipeline instance"""
    global rag_pipeline
    if rag_pipeline is None:
        ollama_url = os.getenv("OLLAMA_URL", "http://ollama:11434")
        rag_pipeline = RAGPipeline(ollama_url=ollama_url)
        # Try to load existing vectorstore
        rag_pipeline.load()
    return rag_pipeline


@router.post("/message", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message and get a response from the chatbot
    
    Args:
        request: Chat request containing the question
        
    Returns:
        Chat response with generated answer
    """
    try:
        pipeline = get_rag_pipeline()
        
        if not pipeline.is_ready():
            raise HTTPException(
                status_code=503,
                detail="Chatbot service not ready. RAG pipeline not initialized or LLM unavailable."
            )
        
        answer = pipeline.query(request.question)
        
        return ChatResponse(
            question=request.question,
            answer=answer
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/setup")
async def setup_rag(request: SetupRequest):
    """
    Initialize RAG pipeline with a resume PDF
    
    Args:
        request: Setup request with PDF path
        
    Returns:
        Setup status
    """
    try:
        if not os.path.exists(request.pdf_path):
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        pipeline = get_rag_pipeline()
        success = pipeline.setup(request.pdf_path)
        
        if success:
            return {"status": "success", "message": "RAG pipeline initialized successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to initialize RAG pipeline")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_status():
    """
    Get chatbot status
    
    Returns:
        Current status of RAG pipeline and LLM
    """
    pipeline = get_rag_pipeline()
    return {
        "status": "ready" if pipeline.is_ready() else "not_ready",
        "rag_initialized": pipeline.initialized,
        "llm_available": pipeline.llm.is_available()
    }
