"""
API schemas for request/response models
"""
from pydantic import BaseModel

class ChatRequest(BaseModel):
    """Request model for chat messages"""
    question: str


class ChatResponse(BaseModel):
    """Response model for chat messages"""
    question: str
    answer: str
    status: str = "success"
