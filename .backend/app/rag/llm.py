"""
LLM interaction module using Ollama
"""
import requests
from typing import Optional


class OllamaLLM:
    """Interface for Ollama LLM"""
    
    def __init__(self, model: str = "llama2", base_url: str = "http://ollama:11434"):
        """
        Initialize Ollama LLM
        
        Args:
            model: Model name to use
            base_url: Ollama server URL
        """
        self.model = model
        self.base_url = base_url
    
    def generate(self, prompt: str, context: str = "") -> str:
        """
        Generate response from LLM
        
        Args:
            prompt: User question
            context: Retrieved context from RAG
            
        Returns:
            Generated response
        """
        system_prompt = """You are a helpful assistant answering questions about a professional's resume and experience. 
        Answer based on the provided context. If the context doesn't contain the answer, say so clearly."""
        
        full_prompt = f"""{system_prompt}

Context from resume:
{context}

Question: {prompt}

Answer:"""
        
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": full_prompt,
                    "stream": False,
                    "temperature": 0.7
                },
                timeout=120
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "Error generating response").strip()
        except requests.exceptions.RequestException as e:
            return f"Error connecting to LLM: {str(e)}"
    
    def is_available(self) -> bool:
        """Check if Ollama server is available"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False
