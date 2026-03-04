#!/bin/bash

# Portfolio Chatbot Setup Script (Linux/macOS)
# Usage: bash setup-chatbot.sh /path/to/resume.pdf

set -e

API_URL="${VITE_API_URL:-http://localhost:8000}"

echo ""
echo "========================================"
echo "  Portfolio Chatbot Setup"
echo "========================================"
echo ""

# Check if resume is provided
if [ -z "$1" ]; then
    if [ -f "./data/resume.pdf" ]; then
        RESUME_PATH="./data/resume.pdf"
        echo "✅ Found resume at ./data/resume.pdf"
    else
        echo "❌ Error: Please provide path to resume PDF"
        echo "Usage: bash setup-chatbot.sh /path/to/resume.pdf"
        exit 1
    fi
else
    RESUME_PATH="$1"
fi

# Validate resume exists
if [ ! -f "$RESUME_PATH" ]; then
    echo "❌ Error: Resume PDF not found at $RESUME_PATH"
    exit 1
fi

# Create data directory
DATA_DIR="./data"
mkdir -p "$DATA_DIR"

# Copy resume
echo "📄 Copying resume to $DATA_DIR..."
cp "$RESUME_PATH" "$DATA_DIR/resume.pdf"
echo "✅ Resume copied successfully"

# Check Docker
echo ""
echo "⏳ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi
echo "✅ Docker is available"

# Check if backend is responsive
echo "⏳ Checking backend service..."
BACKEND_READY=false
for i in {1..12}; do
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        BACKEND_READY=true
        break
    fi
    echo "  Attempt $i/12... waiting 5 seconds"
    sleep 5
done

if [ "$BACKEND_READY" = true ]; then
    echo "✅ Backend service is ready"
else
    echo "⚠️  Backend not responding. Starting Docker Compose..."
    docker-compose -f docker/docker-compose.yml up -d
    echo "⏳ Waiting 30 seconds for services to start..."
    sleep 30
fi

# Initialize RAG
echo ""
echo "🚀 Initializing RAG pipeline..."

RESPONSE=$(curl -s -X POST "$API_URL/api/chat/setup" \
    -H "Content-Type: application/json" \
    -d "{\"pdf_path\": \"./data/resume.pdf\"}" \
    -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ RAG pipeline initialized successfully!"
    
    echo ""
    echo "========================================"
    echo "  🎉 Setup Complete!"
    echo "========================================"
    echo ""
    echo "Your resume chatbot is ready!"
    echo ""
    echo "Access your application:"
    echo "  🌐 Frontend:  http://localhost:5173"
    echo "  🔧 Backend:   $API_URL"
    echo "  📚 API Docs:  $API_URL/docs"
    echo ""
    echo "========================================"
else
    echo "❌ Error initializing RAG pipeline (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi
