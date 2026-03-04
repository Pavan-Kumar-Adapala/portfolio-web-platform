# 📁 Complete Folder Structure

## Updated Project Directory

```
portfolio-web-platform/
│
├── 📦 backend/                           🆕 NEW - FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      (FastAPI app)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py               (Pydantic models)
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── chat.py                  (Chat endpoints)
│   │   └── rag/                         (RAG Pipeline)
│   │       ├── __init__.py
│   │       ├── pdf_processor.py         (PDF extraction)
│   │       ├── embeddings.py            (Vector DB - Chroma)
│   │       ├── llm.py                   (Ollama interface)
│   │       └── rag_pipeline.py          (Main RAG orchestration)
│   ├── main.py                          (Entry point)
│   ├── Dockerfile                       (Python 3.11 + FastAPI)
│   ├── requirements.txt                 (Python dependencies)
│   ├── .dockerignore
│   └── .env.example
│
├── 📦 docker/                            🆕 NEW - Docker Configs
│   ├── docker-compose.yml               (Development setup)
│   ├── docker-compose.prod.yml          (Production setup)
│   ├── .env.dev                         (Dev environment)
│   └── .env.prod                        (Prod environment)
│
├── 📁 src/                              (Frontend Source)
│   ├── components/
│   │   ├── Chatbot.tsx                  🆕 NEW - Chat component
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── ui/
│   │       └── tooltip.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx                          🔄 UPDATED - Added chatbot
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── 📁 public/                           (Static assets)
│   ├── images/
│   └── skills/
│
├── 📁 data/                             (Resume storage)
│   ├── resume.pdf                       (Your resume here)
│   └── .gitkeep
│
├── 📁 .github/
│   ├── workflows/
│   │   ├── ci_pipeline.yml              🔄 UPDATED - Backend build added
│   │   ├── github_pages_deployment.yml
│   │   └── s3_bucket_triger.yml
│   └── ...
│
├── 📁 readme_imgs/                      (Documentation images)
│   └── argocd/
│
├── 🗂️ Root Configuration Files
│   ├── .env.local                       🆕 NEW - Frontend env vars
│   ├── .dockerignore
│   ├── .git/
│   ├── .gitignore
│   ├── components.json                  (Shadcn UI config)
│   ├── Dockerfile                       (Frontend - unchanged)
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── 📄 Setup & Documentation Scripts   🆕 NEW
│   ├── init_chatbot.py                 (Python setup - cross-platform)
│   ├── setup-chatbot.ps1               (PowerShell setup - Windows)
│   ├── setup-chatbot.sh                (Bash setup - Linux/macOS)
│   ├── CHATBOT_README.md               (Main guide)
│   ├── IMPLEMENTATION_SUMMARY.md       (This implementation)
│   └── FOLDER_STRUCTURE.md             (This file)
│
└── 🔌 Docker Services (When Running)
    ├── ollama:11434                    (LLM Runtime)
    ├── backend:8000                    (FastAPI)
    └── frontend:5173                   (Vite Dev Server)
```

## 🎯 Key Additions Explained

### Backend Folder (`backend/`)

Complete FastAPI application with:

- **RESTful API** for chat operations
- **RAG Pipeline** for semantic search
- **Ollama integration** for LLM
- **Chroma** vector database for embeddings
- **Health checks** and status endpoints

### Docker Folder (`docker/`)

Docker Compose configurations:

- **Development**: Hot reload, volume mounts, all logging
- **Production**: Optimized, resource limits, production settings
- **Environment files**: Separate dev and prod configurations

### Frontend Updates

- **Chatbot.tsx**: React component with full UI
- **App.tsx**: Integrated chatbot with floating button
- **.env.local**: Frontend environment variables

### Scripts

- **Python**: Works on any OS with Python 3.11+
- **PowerShell**: Windows-specific with better error handling
- **Bash**: Linux/macOS support

## 📊 Component Relationships

```
User Browser (Frontend)
    ↓
React App (Vite)
    └─→ Chatbot.tsx (Chat UI)
        ↓
    HTTP POST to 8000/api/chat/message
        ↓
FastAPI Backend
    ├─→ chat.py (Router)
    ├─→ rag_pipeline.py (Orchestrator)
    │   ├─→ embeddings.py (Vector Search)
    │   │   └─→ Chroma DB
    │   └─→ llm.py (Generate Response)
    │       └─→ Ollama Service (11434)
    │           └─→ LLM Model (mistral/llama)
    └─→ Response JSON back to UI
```

## 🗂️ File Sizes & Purposes

| File                       | Purpose       | Size   |
| -------------------------- | ------------- | ------ |
| backend/requirements.txt   | Python deps   | ~1KB   |
| backend/Dockerfile         | Backend image | ~300B  |
| docker/docker-compose.yml  | Dev services  | ~1.5KB |
| src/components/Chatbot.tsx | Chat UI       | ~8KB   |
| src/App.tsx                | Main app      | ~2KB   |
| init_chatbot.py            | Setup tool    | ~5KB   |
| CHATBOT_README.md          | Documentation | ~15KB  |

## 🚀 Deployment Flow

```
Local Development → Github Push → GitHub Actions
                                  ├─ ESLint
                                  ├─ Build Frontend
                                  ├─ Scan Frontend Image (Trivy)
                                  ├─ Build Backend
                                  ├─ Scan Backend Image (Trivy)
                                  ├─ Push to Docker Hub
                                  │  ├─ adapaladocker/personal_portfolio_3d
                                  │  └─ adapaladocker/portfolio_backend
                                  └─ Update GitOps Repo (K8s)
```

## 🔄 Data Flow During Chat

```
User Input (Question)
    ↓
Frontend sends to API
    ↓
Backend receives request
    ↓
RAG Pipeline:
    1. Create embedding for question (Ollama)
    2. Search Chroma DB for similar chunks
    3. Get top 3 chunks as context
    4. Send to Ollama: [question + context]
    ↓
Ollama generates response
    ↓
Backend returns JSON response
    ↓
Frontend displays in chat
    ↓
User sees answer
```

## 🏗️ One-Time vs Recurring Files

### One-Time Setup (When adding resume)

- `data/resume.pdf`
- `chroma_db/` (created after first init)

### Recurring (Used every chat)

- API calls to `/api/chat/message`
- Chroma vector search
- Ollama LLM inference

### Configuration (Changes per environment)

- `.env.local` (frontend - dev)
- `docker/.env.dev` (docker - dev)
- `docker/.env.prod` (docker - prod)
- `backend/.env.example` (template)

## 🎯 Where to Find Things

| Need                | Location                                            |
| ------------------- | --------------------------------------------------- |
| **To run**:         | `docker-compose -f docker/docker-compose.yml up -d` |
| **Setup**:          | `python init_chatbot.py data/resume.pdf`            |
| **Chat UI**:        | http://localhost:5173                               |
| **API Docs**:       | http://localhost:8000/docs                          |
| **Backend code**:   | `backend/app/`                                      |
| **Chat component**: | `src/components/Chatbot.tsx`                        |
| **Docker config**:  | `docker/`                                           |
| **Documentation**:  | `CHATBOT_README.md`                                 |
| **Logs**:           | `docker logs <container>`                           |

## ✨ Updated vs New Files

### 🔄 Modified

- `src/App.tsx` - Added chatbot UI and state
- `.github/workflows/ci_pipeline.yml` - Added backend build jobs

### 🆕 Created

- All files in `backend/` folder
- All files in `docker/` folder
- `src/components/Chatbot.tsx`
- `.env.local`
- `init_chatbot.py`, `setup-chatbot.ps1`, `setup-chatbot.sh`
- `CHATBOT_README.md`, `IMPLEMENTATION_SUMMARY.md`

### ⚪ Unchanged

- All other frontend components
- Root `Dockerfile` (for frontend)
- `package.json`, `vite.config.ts`, etc.
- Nginx configuration
- GitHub workflows (except CI pipeline)

---

**Total Changes**:

- ✅ 30+ new files/folders
- ✅ 2 files modified
- ✅ Zero breaking changes
- ✅ Production-ready implementation

Ready to deploy! 🚀
