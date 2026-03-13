# RAG Implementation

Requirements / Dependencies:

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

python -m rag_system.main

## LangChain

LangChain Documentation Link: https://docs.langchain.com/oss/python/langchain/install

LangChain RAG Documentation Link : https://docs.langchain.com/oss/python/langchain/rag

LangChain Integration Options: https://docs.langchain.com/oss/python/integrations/providers/overview

LangChain Message Types: https://docs.langchain.com/oss/python/langchain/messages#message-types

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

LangChain and Ollama Integration Documentation Link: https://docs.langchain.com/oss/python/integrations/providers/ollama
