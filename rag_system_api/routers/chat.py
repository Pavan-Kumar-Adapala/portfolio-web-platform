"""
Chat router - Handles chat-related endpoints
"""
import os
from fastapi import APIRouter, HTTPException
from rag_system_api.schemas import ChatRequest, ChatResponse, SetupRequest, StatusResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def chat(request: ChatRequest):
    

