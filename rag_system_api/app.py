"""
Main FastAPI application for RAG System API
"""
import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from rag_system_api.routers.chat import router as chat_router
from rag_system_api.dependencies import RAGSystemDependencies
from rag_system.utils.logger import Logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Step 1: configure logging first
    Logger.configure_logging()
    logger = Logger.get_logger(__name__)

    # Step 2: initialize RAG singleton at startup
    # - checks for PDF changes
    # - runs indexing pipeline only if needed
    # - initializes RAG pipeline ready to serve requests
    logger.info(f'{"="*100}')
    logger.info(f'{" Initializing RAG system dependencies at startup ":-^80}')
    RAGSystemDependencies()
    logger.info(f'{" RAG system dependencies initialized successfully ":-^80}')
    yield


app = FastAPI(
    title="RAG System API",
    description="API for RAG-based question answering system",
    version="1.0.0",
    lifespan=lifespan
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

@app.post("/admin/reindex")
async def reindex(background_tasks: BackgroundTasks):
    def _reindex():
        RAGSystemDependencies.reset()  # clear singleton
        RAGSystemDependencies()        # re-initialize with fresh check
    background_tasks.add_task(_reindex)
    return {"status": "reindex started"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)