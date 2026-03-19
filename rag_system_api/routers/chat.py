"""
Chat router - Handles chat-related endpoints
"""
import os
from fastapi import APIRouter, HTTPException
from rag_system_api.schemas import ChatRequest, ChatResponse
from rag_system.main import main

# router = APIRouter(prefix="/chat", tags=["chat"])
router = APIRouter(prefix="/chat", tags=["chat"])  # Updated prefix to "/chat" for better clarity


@router.post("/question", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint to handle chat messages from the frontend. It receives a user query, processes it through the RAG pipeline, and returns the generated response.

    Args:
        request (ChatRequest): The chat request containing the user's query.

    Returns:
        ChatResponse: The generated response from the RAG system.
    """
    try:

        answer = main(request.question)  # Call the main function from rag_system to get the actual answer based on the query
        
        return ChatResponse(
            question=request.question,
            answer=answer,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))