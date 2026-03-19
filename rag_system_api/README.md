# RAG System API

FastAPI backend for the RAG (Retrieval-Augmented Generation) system that provides question-answering capabilities over PDF documents.

## Features

- **Document Indexing**: Load and index PDF documents into a vector store
- **Question Answering**: Answer questions based on the indexed documents using LLM
- **REST API**: Clean REST endpoints for integration with frontend applications
- **Health Checks**: Built-in health monitoring and status endpoints

## API Endpoints

### Health

- `GET /health` - Basic health check

### Chat Operations

- `POST /api/chat/message` - Send a question and get an answer

## Installation

1. Install Python dependencies:

```bash
pip install -r rag_system_api/requirements.txt
pip install -r rag_system/requirements.txt
```

2. Ensure Ollama is running with required models:

```bash
ollama pull llama3.1:latest
ollama pull qwen3-embedding:4b
```

## Usage

### Start the API Server

```bash
uvicorn rag_system_api.app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

### Example Usage

1. **Ask a Question**:

```
Invoke-WebRequest -Uri "http://localhost:8000/chat/question" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question": "what is the candidate most recent job title"}'
```

## Configuration

The API uses the following default configurations (can be overridden with environment variables):

- **PDF Directory**: `./pdf_documents_folder`
- **Vector Store**: `./db/chroma_db`
- **Embedding Model**: `qwen3-embedding:4b`
- **LLM Model**: `llama3.1:latest`
- **CORS Origins**: `http://localhost:5173,http://localhost:3000`

## Integration with Frontend

This API is designed to work with the portfolio frontend. Set the `VITE_API_URL` environment variable in your frontend to point to this API:

```bash
export VITE_API_URL=http://localhost:8000
```

## Dependencies

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **LangChain**: RAG pipeline components
- **ChromaDB**: Vector store
- **Ollama**: Local LLM and embeddings
