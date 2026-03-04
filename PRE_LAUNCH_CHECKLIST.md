# 🚀 Pre-Launch Checklist

Use this checklist to verify everything is ready before running the chatbot.

## ✅ Prerequisites

- [ ] Docker Desktop installed and running
- [ ] At least 8GB RAM available
- [ ] At least 10GB free disk space
- [ ] Resume PDF file ready
- [ ] Windows 10/11 (or macOS/Linux)

## ✅ File Structure Verification

Run this to verify all files are in place:

```powershell
# Check backend folder
if (Test-Path "backend/app/main.py") { "✅ Backend main.py exists" } else { "❌ Missing backend/app/main.py" }

# Check docker folder
if (Test-Path "docker/docker-compose.yml") { "✅ Docker compose exists" } else { "❌ Missing docker/docker-compose.yml" }

# Check chat component
if (Test-Path "src/components/Chatbot.tsx") { "✅ Chatbot component exists" } else { "❌ Missing src/components/Chatbot.tsx" }

# Check scripts
if (Test-Path "init_chatbot.py") { "✅ Init script exists" } else { "❌ Missing init_chatbot.py" }
if (Test-Path "setup-chatbot.ps1") { "✅ Setup script exists" } else { "❌ Missing setup-chatbot.ps1" }

# Check data folder
if (Test-Path "data/resume.pdf") { "✅ Resume exists" } else { "⚠️  Resume not found - copy it to data/ folder" }
```

## ✅ Configuration Verification

- [ ] `.env.local` exists in root
- [ ] `VITE_API_URL=http://localhost:8000` is set
- [ ] `backend/.env.example` exists
- [ ] `docker/.env.dev` exists

## ✅ Code Integration Verification

### App.tsx Should Have:

- [ ] `import Chatbot, { ChatbotFloatingButton } from './components/Chatbot'`
- [ ] `useState` hook for chatbot state
- [ ] Floating button: `<ChatbotFloatingButton onClick={() => setIsChatbotOpen(true)} />`
- [ ] Chatbot component: `<Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />`

### Chatbot.tsx Should Have:

- [ ] Import `useState`, `useRef`, `useEffect` from React
- [ ] `export function Chatbot`
- [ ] `export function ChatbotFloatingButton`
- [ ] API calls to `VITE_API_URL/api/chat/message`
- [ ] Tailwind CSS classes

## ✅ Backend Verification

### Core Files:

- [ ] `backend/app/main.py` exists and is complete
- [ ] `backend/app/rag/rag_pipeline.py` exists
- [ ] `backend/app/routers/chat.py` exists
- [ ] `backend/requirements.txt` has all dependencies
- [ ] `backend/Dockerfile` is properly formatted

### Dependencies Line Check:

```powershell
Select-String "fastapi|uvicorn|langchain|chromadb|pypdf" backend/requirements.txt
# Should find all packages
```

## ✅ Docker Verification

### Compose File Content:

- [ ] Has `ollama` service
- [ ] Has `backend` service
- [ ] Has `frontend` service
- [ ] Networks are configured
- [ ] Volumes are configured
- [ ] Health checks present

### Test Command:

```powershell
# Validate compose file
docker-compose -f docker/docker-compose.yml config | Write-Host

# Should output valid YAML without errors
```

## ✅ CI/CD Pipeline Verification

In `.github/workflows/ci_pipeline.yml`:

- [ ] New job: `build_backend_docker_image`
- [ ] New job: `scan_backend_docker_image`
- [ ] Updated job: `build_and_push_docker_images`
- [ ] Updated job: `update_docker_image_tags_in_gitops_repo`
- [ ] Both frontend and backend images are pushed

## ✅ Pre-Launch Steps

### 1. Prepare Resume

```powershell
mkdir data
cp "C:\path\to\resume.pdf" data\resume.pdf
```

### 2. Verify Docker Running

```powershell
docker ps

# Should return container list (even if empty)
# If error: Start Docker Desktop
```

### 3. Clean Up (Optional)

```powershell
# Remove old containers if any issue
docker-compose -f docker/docker-compose.yml down -v
docker system prune -a
```

### 4. Verify Compose File

```powershell
docker-compose -f docker/docker-compose.yml config
```

## ✅ Launch Commands (In Order)

### Command 1: Start Services

```powershell
cd C:\Users\User\portfolio-web-platform
docker-compose -f docker/docker-compose.yml up -d
```

**Wait**: Check `docker ps` - should see 3 containers
**Wait**: Check logs - Ollama might download models (2-5 minutes)

### Command 2: Verify Ollama

```powershell
# Check Ollama is running and ready
docker logs portfolio-ollama | Select-String "Listening"

# Should see: "Listening on 127.0.0.1:11434"
```

### Command 3: Verify Backend

```powershell
# Check backend is running
curl http://localhost:8000/health

# Should return: {"status":"healthy","service":"portfolio-chatbot"}
```

### Command 4: Initialize Chatbot

```powershell
# Run setup
python init_chatbot.py data\resume.pdf

# Should complete with success message
```

## ✅ Post-Launch Verification

After initialization, verify everything works:

### Check Chatbot Status

```powershell
curl http://localhost:8000/api/chat/status

# Should return:
# {
#   "status": "ready",
#   "rag_initialized": true,
#   "llm_available": true
# }
```

### Test Chat Endpoint

```powershell
$body = @{
    question = "What is in your resume?"
} | ConvertTo-Json

curl -X POST http://localhost:8000/api/chat/message `
  -H "Content-Type: application/json" `
  -Body $body

# Should return a JSON response with answer
```

### Test Frontend

1. Open browser: http://localhost:5173
2. Look for 💬 chat button in bottom-right
3. Click to open chatbot
4. Send a test message
5. Should see response

## ✅ Browser Access

- [ ] **Frontend**: http://localhost:5173 (should load with chat button)
- [ ] **API Docs**: http://localhost:8000/docs (should show Swagger UI)
- [ ] **Health**: http://localhost:8000/health (should return JSON)

## ✅ Logs Verification

If anything doesn't work, check logs:

```powershell
# All logs
docker-compose -f docker/docker-compose.yml logs -f

# Specific logs
docker logs portfolio-backend -f      # Backend
docker logs portfolio-ollama -f       # Ollama (LLM)
docker logs portfolio-frontend -f     # Frontend
```

## ✅ Common Pre-Launch Issues

| Issue               | Check                                                    |
| ------------------- | -------------------------------------------------------- |
| Docker not starting | Start Docker Desktop                                     |
| Port in use         | `netstat -ano \| findstr :8000` and kill process         |
| Resume not found    | Ensure `data/resume.pdf` exists                          |
| Compose file error  | Run `docker-compose -f docker/docker-compose.yml config` |
| Build fails         | Delete containers: `docker-compose down -v`              |

## ✅ Quick Sanity Check

```powershell
# Run all checks at once
$checks = @(
    ("Backend folder", (Test-Path "backend/app/main.py")),
    ("Docker folder", (Test-Path "docker/docker-compose.yml")),
    ("Chat component", (Test-Path "src/components/Chatbot.tsx")),
    ("Resume", (Test-Path "data/resume.pdf")),
    (".env.local", (Test-Path ".env.local")),
    ("Init script", (Test-Path "init_chatbot.py"))
)

foreach ($check in $checks) {
    $status = if ($check[1]) { "✅" } else { "❌" }
    Write-Host "$status $($check[0])"
}
```

## ✅ Success Criteria

You're ready to go when:

- [x] All files are in place
- [x] Docker is running
- [x] Resume is in `data/` folder
- [x] All 3 containers start with `docker-compose up -d`
- [x] `curl http://localhost:8000/health` returns success
- [x] http://localhost:5173 loads with chat button visible
- [x] Chat endpoint responds with a message

---

## 🎯 Next Actions

1. **Run this checklist** - Verify all items are checked
2. **Start services** - `docker-compose -f docker/docker-compose.yml up -d`
3. **Wait for Ollama** - Check logs: `docker logs portfolio-ollama`
4. **Initialize chatbot** - `python init_chatbot.py data\resume.pdf`
5. **Test in browser** - Open http://localhost:5173
6. **Ask a question** - Click chat button and test

---

**Everything looks good? Let's launch! 🚀**
