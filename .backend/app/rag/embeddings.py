"""
Embeddings and vector store management with Chroma
"""
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from typing import List
import os


class EmbeddingManager:
    """Manages embeddings and vector database operations"""
    
    def __init__(self, model_name: str = "nomic-embed-text", persist_dir: str = "./chroma_db", ollama_url: str = "http://ollama:11434"):
        """
        Initialize embedding manager
        
        Args:
            model_name: Name of the Ollama embedding model
            persist_dir: Directory to persist Chroma database
            ollama_url: URL of Ollama service
        """
        self.model_name = model_name
        self.persist_dir = persist_dir
        self.ollama_url = ollama_url
        self.embeddings = OllamaEmbeddings(model=model_name, base_url=ollama_url)
        self.vectorstore = None
        
    def create_embeddings(self, chunks: List[str]) -> Chroma:
        """
        Create embeddings from text chunks and store in Chroma
        
        Args:
            chunks: List of text chunks
            
        Returns:
            Chroma vectorstore instance
        """
        self.vectorstore = Chroma.from_texts(
            chunks,
            self.embeddings,
            persist_directory=self.persist_dir
        )
        return self.vectorstore
    
    def load_vectorstore(self) -> Chroma:
        """
        Load existing vectorstore from disk
        
        Returns:
            Chroma vectorstore instance
        """
        if os.path.exists(self.persist_dir):
            self.vectorstore = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=self.embeddings
            )
            return self.vectorstore
        return None
    
    def query(self, question: str, k: int = 3) -> List[str]:
        """
        Query vectorstore for similar documents
        
        Args:
            question: User question
            k: Number of top results to return
            
        Returns:
            List of similar document chunks
        """
        if not self.vectorstore:
            self.load_vectorstore()
        
        if self.vectorstore:
            results = self.vectorstore.similarity_search(question, k=k)
            return [doc.page_content for doc in results]
        return []
