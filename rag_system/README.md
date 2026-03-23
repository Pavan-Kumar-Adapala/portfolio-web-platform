# RAG Implementation

## Requirements / Dependencies:

- Requires Python 3.10+ to use LangChain (I am using Python 3.13.5)
- Download and install Ollama (https://ollama.com/download)
  - (Add environmental variable inside your local system for testing)
    - 1️⃣ Open Start
    - 2️⃣ Search Environment Variables
    - 3️⃣ Open Edit system environment variables
    - 4️⃣ Click Environment Variables
    - 5️⃣ Under User variables → Path → Edit
    - 6️⃣ Add: C:\Users\User\AppData\Local\Programs\Ollama
  - if you are using git bash terminal, then
    - touch ~/.bashrc
    - check file created or not using **ls -a ~**
    - nano ~/.bashrc
    - enter -> **export PATH=$PATH:/c/Users/User/AppData/Local/Programs/Ollama**
    - Reload **source ~/.bashrc**
  - ollama pull <name-of-model>
  - To chat directly with a model from the command line, use ollama run <name-of-model>
- pip install langchain langchain-text-splitters langchain-community langchain-ollama langchain-chroma langchain-core python_dotenv pypdf pillow
- Embeddings Model: ollama pull qwen3-embedding:4b
- LLM Model: ollama pull llama3.1:latest

## RAG System Testing (Local env)

Use below command to test the rag system in local environment:

```
python -m rag_system.main -q "How Many years of experience does the candidate have?"
```

Check logs inside **logs folder**

---

## RAG System Testing in Cloud

- In AWS, Launch EC2 (Ubuntu)

- SSH into EC2
  - git --version
  - python3 --version

- Install pip

  ```
  sudo apt install -y python3-pip

  pip3 --version
  ```

- Install ollama

  ```
  curl -fsSL https://ollama.com/install.sh | sh

  ollama --version

  ollama pull llama3.1:latest

  ollama pull qwen3-embedding:4b
  ```

  systemctl status ollama

  ollama list

- Install Node.js + npm

  ```
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

  sudo apt install -y nodejs

  node -v

  npm -v
  ```

- Install Python dependencies

```bash
  # Install venv support
  sudo apt install -y python3-venv python3-full

  # Create virtual environment inside the project
  cd ~/portfolio-web-platform
  python3 -m venv venv

  # Activate it
  source venv/bin/activate

  pip3 install -r rag_system/requirements.txt

  pip3 install -r rag_system_api/requirements.txt
```

- Run Backend

  ```
  uvicorn rag_system_api.app:app --host 0.0.0.0 --port 8000 &
  ```

- Install Apache

  ```
  sudo apt install apache2

  sudo systemctl status apache2
  ```

- Install Node dependencies and build frontend

  ```
  # Build the production bundle
  npm run build

  # Copy to nginx
  sudo cp -r dist/* /var/www/html/

  # Restart nginx
  sudo systemctl restart  apache2
  ```

# Reference links:

## LangChain

LangChain is an open-source orchestration framework designed to simplify the development of applications powered by large language models (LLMs). It acts as a bridge, connecting LLMs like GPT-4 or Claude with external data sources, APIs, and computation tools to create "context-aware" and "agentic" systems.

LangChain Documentation Link: https://docs.langchain.com/oss/python/langchain/install

LangChain RAG Documentation Link : https://docs.langchain.com/oss/python/langchain/rag

LangChain Integration Options: https://docs.langchain.com/oss/python/integrations/providers/overview

LangChain Message Types: https://docs.langchain.com/oss/python/langchain/messages#message-types

The LangChain ecosystem includes:

**LangGraph:** A framework for building complex, stateful, and circular multi-agent workflows.

**LangSmith:** A platform for tracing, debugging, and evaluating LLM applications to make them production-ready.

**LangServe:** A tool to deploy LangChain applications as production-ready REST APIs.

### Types of Splitting the document

1. Manual Splitting

2. Automatic Splitting
   1. from langchain.text_splitter import CharacterTextSplitter
   2. from langchain_text_splitters import RecursiveCharacterTextSplitter (https://docs.langchain.com/oss/python/integrations/splitters)
   3. Document text splitter
   - MarkdownTextSplitter
   - PythonCodeTextSplitter
   - (For Javascript splitting) RecursiveCharacterTextSplitter and Language
   4. Semantic Chunking
      from langchain_experimental.text_splitter import SemanticChunker
   5. Agentic Chunking
      2 levels - Proposition-Based Chunking, Group Chunk

## Ollama

Ollama Installation: https://docs.ollama.com/linux

LangChain and Ollama Integration Documentation Link: https://docs.langchain.com/oss/python/integrations/providers/ollama
