"""
RAG Pipeline - Orchestrates the entire RAG workflow
"""
from .pdf_processor import extract_text_from_pdf, chunk_text
from .embeddings import EmbeddingManager
from .llm import OllamaLLM
from typing import List, Optional
import os


class RAGPipeline:
    """Complete RAG pipeline for resume-based Q&A"""
    
    def __init__(self, persist_dir: str = "./chroma_db", ollama_url: str = "http://ollama:11434"):
        """
        Initialize RAG pipeline
        
        Args:
            persist_dir: Directory for storing embeddings
            ollama_url: URL of Ollama service
        """
        self.embedding_manager = EmbeddingManager(persist_dir=persist_dir, ollama_url=ollama_url)
        self.llm = OllamaLLM(base_url=ollama_url)
        self.initialized = False
    
    def setup(self, pdf_path: str) -> bool:
        """
        One-time setup: Extract, chunk, and embed resume
        
        Args:
            pdf_path: Path to resume PDF
            
        Returns:
            True if setup successful
        """
        try:
            # Extract text
            print("📖 Extracting text from PDF...")
            text = extract_text_from_pdf(pdf_path)
            
            # Split into chunks
            print("✂️ Splitting into chunks...")
            chunks = chunk_text(text, chunk_size=500, chunk_overlap=50)
            
            # Create embeddings
            print("🧠 Creating embeddings...")
            self.embedding_manager.create_embeddings(chunks)
            
            self.initialized = True
            print("✅ RAG pipeline setup completed successfully!")
            return True
        except Exception as e:
            print(f"❌ Error during setup: {str(e)}")
            return False
    
    def load(self) -> bool:
        """
        Load existing vectorstore
        
        Returns:
            True if loaded successfully
        """
        try:
            vectorstore = self.embedding_manager.load_vectorstore()
            self.initialized = vectorstore is not None
            return self.initialized
        except Exception as e:
            print(f"❌ Error loading vectorstore: {str(e)}")
            return False
    
    def query(self, question: str) -> str:
        """
        Query the RAG pipeline for an answer
        
        Args:
            question: User question
            
        Returns:
            Generated answer based on resume context
        """
        if not self.initialized:
            return "Error: RAG pipeline not initialized. Please setup with a resume PDF first."
        
        # Check if LLM is available
        if not self.llm.is_available():
            return "Error: LLM service (Ollama) is not available. Please ensure Ollama is running."
        
        try:
            # Retrieve similar chunks
            similar_chunks = self.embedding_manager.query(question, k=3)
            context = "\n".join(similar_chunks)
            
            # Generate response
            response = self.llm.generate(question, context)
            return response
        except Exception as e:
            return f"Error processing question: {str(e)}"
    
    def is_ready(self) -> bool:
        """Check if pipeline is ready to answer questions"""
        return self.initialized and self.llm.is_available()
