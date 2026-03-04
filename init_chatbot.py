#!/usr/bin/env python3
"""
Initialize chatbot with resume PDF
Usage: python init_chatbot.py path/to/resume.pdf
"""

import os
import sys
import time
import requests
from pathlib import Path


def wait_for_service(url: str, timeout: int = 60, interval: int = 2) -> bool:
    """Wait for a service to be available"""
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                return True
        except requests.exceptions.RequestException:
            pass
        time.sleep(interval)
    return False


def main():
    if len(sys.argv) < 2:
        print("❌ Error: Please provide path to resume PDF")
        print("Usage: python init_chatbot.py /path/to/resume.pdf")
        sys.exit(1)
    
    resume_path = Path(sys.argv[1]).resolve()
    data_dir = Path("./data").resolve()
    
    # Validate resume exists
    if not resume_path.exists():
        print(f"❌ Error: Resume PDF not found at {resume_path}")
        sys.exit(1)
    
    # Create data directory
    data_dir.mkdir(exist_ok=True)
    
    # Copy resume (or skip if already in correct location)
    dest_path = data_dir / "resume.pdf"
    
    # Check if source and dest are the same file
    if resume_path.resolve() == dest_path.resolve():
        print(f"✅ Resume already at {dest_path}")
    else:
        print(f"📄 Copying resume to {dest_path}...")
        with open(resume_path, 'rb') as src, open(dest_path, 'wb') as dst:
            dst.write(src.read())
        print("✅ Resume copied successfully")
    
    # Determine environment
    api_url = os.getenv("VITE_API_URL", "http://localhost:8000")
    
    # Wait for backend to be ready
    print("⏳ Waiting for backend service to be ready...")
    if not wait_for_service(f"{api_url}/health"):
        print("❌ Error: Backend service not responding after 60 seconds")
        print(f"Make sure the backend is running at {api_url}")
        sys.exit(1)
    
    print("✅ Backend service is ready!")
    
    # Wait for Ollama to be ready
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    print("⏳ Waiting for Ollama service...")
    if not wait_for_service(f"{ollama_url}/api/tags"):
        print("⚠️  Warning: Ollama service not responding")
        print("Make sure Ollama is running and models are downloaded")
    else:
        print("✅ Ollama service is ready!")
    
    # Initialize RAG pipeline
    print("\n🚀 Initializing RAG pipeline...")
    try:
        response = requests.post(
            f"{api_url}/api/chat/setup",
            json={"pdf_path": str(dest_path)},
            timeout=120
        )
        
        if response.status_code == 200:
            print("✅ RAG pipeline initialized successfully!")
            print("\n" + "="*50)
            print("🎉 Chatbot is ready!")
            print("="*50)
            print(f"Frontend: {os.getenv('VITE_API_URL_FRONTEND', 'http://localhost:5173')}")
            print(f"Backend:  {api_url}")
            print(f"Docs:     {api_url}/docs")
            print("="*50)
        else:
            error_msg = response.json().get("detail", "Unknown error")
            print(f"❌ Error: {error_msg}")
            print(f"Response: {response.text}")
            sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"❌ Error connecting to backend: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
