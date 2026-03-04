# Portfolio Chatbot - Setup Script (Windows PowerShell)
# Usage: .\setup-chatbot.ps1 -ResumePath "C:\path\to\resume.pdf"

param(
    [Parameter(Mandatory = $false)]
    [string]$ResumePath,
    
    [Parameter(Mandatory = $false)]
    [string]$ApiUrl = "http://localhost:8000"
)

function Write-Step {
    param([string]$Message)
    Write-Host "➡️  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Check if resume path is provided
if (
    -not $ResumePath
) {
    # Check if data/resume.pdf exists
    if (Test-Path ".\data\resume.pdf") {
        $ResumePath = ".\data\resume.pdf"
        Write-Success "Found resume at ./data/resume.pdf"
    }
    else {
        Write-Error "Please provide path to resume PDF"
        Write-Host "Usage: .\setup-chatbot.ps1 -ResumePath 'C:\path\to\resume.pdf' [-ApiUrl 'http://localhost:8000']"
        exit 1
    }
}

# Validate resume exists
if (
    -not (Test-Path $ResumePath)
) {
    Write-Error "Resume PDF not found at $ResumePath"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Portfolio Chatbot Setup" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

Write-Step "Copying resume to data directory..."
$DataDir = ".\data"
if (
    -not (Test-Path $DataDir)
) {
    New-Item -ItemType Directory -Path $DataDir | Out-Null
}
Copy-Item -Path $ResumePath -Destination ".\data\resume.pdf" -Force
Write-Success "Resume copied to .\data\resume.pdf"

# Check if Docker is running
Write-Step "Checking Docker..."
try {
    $dockerStatus = docker ps 2>&1
    Write-Success "Docker is running"
}
catch {
    Write-Error "Docker is not running"
    Write-Host "Please start Docker Desktop and try again"
    exit 1
}

# Check if backend is responding
Write-Step "Checking backend service..."
$backendHealthy = $false
for (
    $i = 0; $i -lt 12; $i++
) {
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl/health" -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendHealthy = $true
            break
        }
    }
    catch {
        Start-Sleep -Seconds 5
    }
}

if (
    $backendHealthy
) {
    Write-Success "Backend service is ready"
}
else {
    Write-Error "Backend service is not responding at $ApiUrl"
    Write-Host "Starting services with docker-compose..."
    docker-compose -f docker/docker-compose.yml up -d
    Write-Host "Waiting for services to start (this may take 2-3 minutes)..."
    Start-Sleep -Seconds 30
}

# Initialize RAG pipeline
Write-Step "Initializing RAG pipeline..."
try {
    $restoreVerbosePreference = $VerbosePreference
    $VerbosePreference = "SilentlyContinue"
    
    $body = @{
        pdf_path = ".\data\resume.pdf"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$ApiUrl/api/chat/setup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    $VerbosePreference = $restoreVerbosePreference
    
    if ($response.StatusCode -eq 200) {
        Write-Success "RAG pipeline initialized successfully!"
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  🎉 Setup Complete!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your resume chatbot is ready!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access your application:"
        Write-Host "  🌐 Frontend:  http://localhost:5173"
        Write-Host "  🔧 Backend:   $ApiUrl"
        Write-Host "  📚 API Docs:  $ApiUrl/docs"
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
    }
    else {
        Write-Error "Failed to initialize RAG pipeline"
        Write-Host $response.Content
        exit 1
    }
}
catch {
    Write-Error "Error initializing RAG pipeline: $($_.Exception.Message)"
    exit 1
}
