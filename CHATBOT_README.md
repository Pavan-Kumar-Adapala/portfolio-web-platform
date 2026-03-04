# Portfolio Chatbot - Complete Setup Guide

A RAG (Retrieval-Augmented Generation) based chatbot integrated into your portfolio website. The chatbot answers questions about your resume using local LLM inference with Ollama and a vector database.

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│   React Frontend (Vite)              │
│   - Chatbot UI Component             │
│   - Message History                  │
└──────────────────┬───────────────────┘
                   │ HTTP API
        ┌──────────▼──────────┐
        │  FastAPI Backend    │
        │  - Chat Endpoints   │
        │  - RAG Pipeline     │
        └──────────┬──────────┘
       ┌────────┬──┴───────┬──────────┐
       │        │          │          │
    ┌──▼──┐ ┌──▼──┐  ┌───▼──┐   ┌───▼─────┐
    │ PDF │ │Chunk│  │Embed │   │Ollama   │
    │Load │ │Text │  │ Chroma   │LLM      │
    └─────┘ └─────┘  └───────┘   └─────────┘
```

## 📋 Prerequisites

### Docker Approach (Recommended for Windows)

- Docker Desktop installed
- 8GB+ RAM allocated to Docker
- 10GB free disk space

### Local Development Approach

- Python 3.11+
- Node.js 20+
- Ollama installed (https://ollama.ai)
- 4GB+ RAM

## 🚀 Quick Start (Docker)

### Step 1: Prepare Your Resume

```powershell
mkdir data
cp "C:\path\to\your\resume.pdf" data\resume.pdf
```

### Step 2: Start Services

```powershell
cd C:\Users\User\portfolio-web-platform
docker-compose -f docker/docker-compose.yml up -d
```

Wait 2-5 minutes for Ollama to download models.

### Step 3: Initialize Chatbot

```powershell
# Using Python (cross-platform)
python init_chatbot.py data\resume.pdf

# OR using PowerShell
.\setup-chatbot.ps1 -ResumePath "data\resume.pdf"
```

### Step 4: Access Application

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

Click the 💬 chat button and start asking questions!

## 📁 Project Structure

```
portfolio-web-platform/
├── src/                              # Frontend source
│   ├── components/
│   │   ├── Chatbot.tsx              # 🆕 Chat component
│   │   └── ...other components
│   ├── App.tsx                      # 🔄 Updated with chatbot
│   └── ...
│
├── backend/                          # 🆕 FastAPI backend
│   ├── app/
│   │   ├── main.py                  # FastAPI app
│   │   ├── models/
│   │   │   └── schemas.py           # Request/response models
│   │   ├── routers/
│   │   │   └── chat.py              # Chat API endpoints
│   │   └── rag/                     # RAG pipeline
│   │       ├── pdf_processor.py     # PDF extraction
│   │       ├── embeddings.py        # Vector DB
│   │       ├── llm.py               # LLM interface
│   │       └── rag_pipeline.py      # Orchestration
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── docker/                           # 🆕 Docker composition
│   ├── docker-compose.yml           # Development
│   ├── docker-compose.prod.yml      # Production
│   ├── .env.dev
│   └── .env.prod
│
├── data/                             # Resume storage
│   └── resume.pdf
│
├── init_chatbot.py                  # 🆕 Setup script (Python)
├── setup-chatbot.ps1                # 🆕 Setup script (PowerShell)
├── setup-chatbot.sh                 # 🆕 Setup script (Bash)
├── .env.local                       # Frontend env vars
└── .github/workflows/
    └── ci_pipeline.yml              # 🔄 Updated pipeline
```

## 🐳 Docker Services

### Ollama Container (LLM Runtime)

- **Port**: 11434
- **Image**: `ollama/ollama:latest`
- **Models**: `nomic-embed-text` (embeddings), `mistral` (LLM)
- **Volume**: `ollama_data` (model cache)

### Backend Container (FastAPI)

- **Port**: 8000
- **Image**: Built from `backend/Dockerfile`
- **Health Check**: `/health` endpoint
- **Volume**: `./backend` & `./data` mounted for development

### Frontend Container (Vite)

- **Port**: 5173
- **Image**: Built from root `Dockerfile`
- **Hot Reload**: Enabled for development
- **Volume**: `.` mounted for source code

## 📡 API Endpoints

### Health Check

```bash
curl http://localhost:8000/health
```

### Check Chatbot Status

```bash
curl http://localhost:8000/api/chat/status
```

Response:

```json
{
  "status": "ready",
  "rag_initialized": true,
  "llm_available": true
}
```

### Send Chat Message

```bash
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"question": "What technologies do you work with?"}'
```

Response:

```json
{
  "question": "What technologies do you work with?",
  "answer": "Based on your resume, you have expertise in: ...",
  "status": "success"
}
```

### Initialize RAG Pipeline

```bash
curl -X POST http://localhost:8000/api/chat/setup \
  -H "Content-Type: application/json" \
  -d '{"pdf_path": "./data/resume.pdf"}'
```

## ⚙️ Environment Variables

### Frontend (`.env.local`)

```
VITE_API_URL=http://localhost:8000
```

### Backend (via docker-compose)

```
PYTHONUNBUFFERED=1
OLLAMA_URL=http://ollama:11434
CORS_ORIGINS=*
```

## 🧪 Testing

### Windows PowerShell Commands

```powershell
# Check Ollama
curl http://localhost:11434/api/tags

# Check Backend
curl http://localhost:8000/health

# Check Chatbot Status
curl http://localhost:8000/api/chat/status

# View Backend Logs
docker logs portfolio-backend -f

# View Ollama Logs
docker logs portfolio-ollama -f
```

## 🛑 Stop Services

```powershell
# Stop all services
docker-compose -f docker/docker-compose.yml down

# Stop and remove volumes (WARNING: deletes embeddings)
docker-compose -f docker/docker-compose.yml down -v

# View running containers
docker-compose -f docker/docker-compose.yml ps
```

## 🔧 Local Development (Without Docker)

### Prerequisites

- Ollama running: `ollama serve`
- Python 3.11+
- Node.js 20+

### Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```powershell
npm install
npm run dev
```

### Initialize

```powershell
python init_chatbot.py data\resume.pdf
```

## 📊 CI/CD Pipeline Updates

The GitHub Actions pipeline now:

1. ✅ Lints frontend code (ESLint)
2. ✅ Builds frontend Docker image
3. ✅ Scans frontend image for vulnerabilities (Trivy)
4. ✅ Builds backend Docker image
5. ✅ Scans backend image for vulnerabilities (Trivy)
6. ✅ Pushes both images to Docker Hub
7. ✅ Updates GitOps repository with new image tags

**Repository Structure**:

- Frontend image: `adapaladocker/personal_portfolio_3d:<tag>`
- Backend image: `adapaladocker/portfolio_backend:<tag>`

## 🚨 Troubleshooting

### Chatbot Shows "Initializing" Message

- **Cause**: Ollama is downloading models (~500MB), first time takes 2-5 minutes
- **Solution**: Wait and check: `docker logs portfolio-ollama`

### Backend Returns 503 Error

- **Cause**: RAG pipeline not initialized or Ollama not available
- **Solution**: Run: `python init_chatbot.py data\resume.pdf`

### Frontend Can't Reach Backend

- **Cause**: Wrong API URL or CORS issue
- **Solution**:
  - Check `.env.local` has `VITE_API_URL=http://localhost:8000`
  - Check browser console for errors
  - Verify backend running: `curl http://localhost:8000/health`

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

### Docker Build Fails

```powershell
# Clean everything
docker system prune -a
docker volume prune

# Rebuild
docker-compose -f docker/docker-compose.yml build --no-cache
docker-compose -f docker/docker-compose.yml up -d
```

## 🎨 Customization

### Change LLM Model

Edit `backend/app/rag/llm.py`:

```python
self.llm = OllamaLLM(model="neural-chat")  # or llama2, phi, etc.
```

### Change Embedding Model

Edit `backend/app/rag/embeddings.py`:

```python
self.embeddings = OllamaEmbeddings(model="nomic-embed-text-v1.5")
```

### Change Chat UI Colors

Edit `src/components/Chatbot.tsx`:

```typescript
className = "bg-gradient-to-r from-blue-600 to-purple-600";
// Change to your colors
className = "bg-gradient-to-r from-green-600 to-teal-600";
```

### Adjust Context Size

Edit `backend/app/rag/rag_pipeline.py`:

```python
chunks = chunk_text(text, chunk_size=800, chunk_overlap=100)  # from 500/50
```

## 📈 Performance

| Metric               | Value                      |
| -------------------- | -------------------------- |
| First Response       | 2-5 seconds                |
| Subsequent Responses | 1-3 seconds                |
| Memory Usage         | 2-4GB                      |
| Disk Space           | ~1GB (models + embeddings) |
| Startup Time         | 30-60 seconds              |

## 🔒 Security Notes

### For Production:

1. Set specific `CORS_ORIGINS` instead of `*`
2. Add API authentication (JWT/API keys)
3. Enable HTTPS/TLS
4. Implement rate limiting
5. Use environment-specific configurations
6. Never commit `.env` files
7. Add input validation

Example production config:

```
CORS_ORIGINS=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

## 📚 Additional Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **LangChain**: https://python.langchain.com/
- **Ollama**: https://ollama.ai/
- **Chroma**: https://www.trychroma.com/
- **Docker**: https://docs.docker.com/
- **GitHub Actions**: https://docs.github.com/actions

## 🧠 How RAG Works

```
1. One-time Setup:
   ├─ Extract text from resume PDF
   ├─ Split into chunks (500 tokens, 50 overlap)
   ├─ Generate embeddings (Ollama: nomic-embed-text)
   └─ Store in Chroma Vector Database

2. Per-Question Flow:
   ├─ User asks: "What technologies do you use?"
   ├─ Convert question to embedding
   ├─ Search Chroma for 3 most similar chunks
   ├─ Send to Ollama LLM: [chunks + question]
   ├─ LLM generates answer
   └─ Return answer to user
```

## 📝 Notes

- Chatbot only knows what's in your resume
- First Ollama run downloads ~500MB models (one-time)
- Embeddings are cached in Chroma DB
- Questions are processed locally, no external API calls
- Total response time is typically 1-3 seconds

## 🎯 Next Steps

1. ✅ Copy resume to `data/` folder
2. ✅ Run `docker-compose -f docker/docker-compose.yml up -d`
3. ✅ Execute setup script
4. ✅ Open http://localhost:5173
5. ✅ Click chat button and start asking!

---

**Happy chatting!** 🚀
