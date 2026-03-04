"""
Data models and schemas for API
"""
from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Chat request schema"""
    question: str


class ChatResponse(BaseModel):
    """Chat response schema"""
    question: str
    answer: str
    status: str = "success"


class SetupRequest(BaseModel):
    """Setup request for initializing RAG with PDF"""
    pdf_path: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    rag_initialized: bool
    llm_available: bool
