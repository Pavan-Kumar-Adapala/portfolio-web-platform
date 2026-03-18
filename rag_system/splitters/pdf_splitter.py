import logging
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document  # Added for type checking

# --------------- Set up logging configuration ----------------
logger = logging.getLogger(__name__)

# --------------- PDFSplitter class definition ----------------
class PDFSplitter:
    """
    Splits text from a list of LangChain Document objects (e.g., from PDF loaders) into smaller chunks
    using RecursiveCharacterTextSplitter for efficient processing in RAG systems.
    """
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 0) -> None:
        """
        Initializes a PDFSplitter instance with a given chunk size and overlap.
        
        Args:
            chunk_size (int): The size of each chunk. Defaults to 500.
            chunk_overlap (int): The overlap between chunks. Defaults to 0.
        """
        self.chunk_size = chunk_size  # instance variable to store the chunk size for splitting text
        self.chunk_overlap = chunk_overlap  # instance variable to store the chunk overlap for splitting text
        self.splitter = RecursiveCharacterTextSplitter(
                                                        chunk_size=self.chunk_size, 
                                                        chunk_overlap=self.chunk_overlap,
                                                        add_start_index=True
                                                        )  # instance variable to store the RecursiveCharacterTextSplitter instance for splitting text
        logger.info(f"PDFSplitter initialized with chunk_size={self.chunk_size} and chunk_overlap={self.chunk_overlap}.")

    def split_documents(self, documents: list[Document]) -> list[Document]:
        """
        Splits text from a list of documents into chunks using RecursiveCharacterTextSplitter.
        
        Args:
            documents (list[Document]): A list of Document objects containing the text to be split.
            
        Returns:
            list[Document]: A list of text chunks as Document objects.
        """
        if not documents or not all(isinstance(doc, Document) for doc in documents):
            raise ValueError("Documents must be a non-empty list of LangChain Document objects.")
        
        all_chunks = self.splitter.split_documents(documents)  # Use the split_documents method to split the text from the list of Document objects into chunks
        logger.info(f"Split {len(documents)} documents into {len(all_chunks)} chunks.")
        for i, chunk in enumerate(all_chunks):
            chunk.metadata["source"] = chunk.metadata.get("source", "unknown")  # Preserve source metadata in each chunk
            chunk.metadata["page"] = chunk.metadata.get("page", "unknown")  # Preserve page metadata in each chunk
            chunk.metadata["chunk_id"] = i  # Add a unique chunk ID to the metadata of each chunk for tracking and debugging purposes
        logger.info(f"Step 2: Split loaded documents into chunks completed.")

        return all_chunks
        
        # chunks = []
        # for document in documents:
        #     text = document.page_content
        #     chunks.extend(self.splitter.split_text(text))
            
        # return chunks