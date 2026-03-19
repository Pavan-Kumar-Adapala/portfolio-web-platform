"""
Main FastAPI application for RAG System API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rag_system_api.routers.chat import router as chat_router
import os
import uvicorn

app = FastAPI(
    title="RAG System API",
    description="API for RAG-based question answering system",
    version="1.0.0"
)

# Get CORS origins from environment
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ready",
        "service": "rag-system-api"
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "RAG System API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)