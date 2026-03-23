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

  - Install Docker

  ```
  install_docker.sh

        #!/bin/bash
        sudo apt update
        sudo apt install ca-certificates curl gnupg lsb-release -y

        # Add GPG Key
        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg

        # Add Repository to Apt sources
        echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

        sudo apt update

        sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

  ```

  ```
  chmod +x install_docker.sh
  ./install_docker.sh

  # Add your user to docker group
  sudo usermod -aG docker $USER

  # Verify
  docker --version
  docker compose version
  ```

- Clone the repo

  ```
  git clone  <https:....>
  ```

  ```
  cd  <project_folder>

  # Edit .env
  # Replace with your actual EC2 public IP:
  RAG_API_SERVER_URL=http://YOUR_EC2_IP:8000
  CORS_ORIGINS=http://YOUR_EC2_IP
  ```

- Run the docker compose

```
cd ~/portfolio-web-platform/docker
docker compose up -d --build
```

- Check all container are running or not

  ```
  docker compose ps
  ```

- Check the logs

  ```
  # All models ready
  docker compose logs -f ollama-init

  # Check RAG pipeline initialized and ready
  docker compose logs -f backend
  ```

- Security groups

```
Add these rules:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| SSH | TCP | 22 | My IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| Custom TCP | TCP | 8000 | 0.0.0.0/0 |
```

I want to open browser and test in my laptop

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
