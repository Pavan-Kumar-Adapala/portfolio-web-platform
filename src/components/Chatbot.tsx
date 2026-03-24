import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Chatbot({ isOpen = true, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      text: "Hello! 👋 I'm resume chatbot. Ask me anything about Pavan's Professional experience, skills, or projects!",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatbotStatus, setChatbotStatus] = useState<"ready" | "loading" | "error">("loading");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get API URL from environment
  // const RAG_API_SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const RAG_API_SERVER_URL = (window as any).__ENV__?.RAG_API_SERVER_URL ?? "http://localhost:8000"


  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to check chatbot status
  const checkChatbotStatus = useCallback(async () => {
  try {
    const response = await fetch(`${RAG_API_SERVER_URL}/health`);
    const data = await response.json();

    if (response.ok && data.status === "ready") {  // ✅ removed rag_initialized and llm_available checks
      setChatbotStatus("ready");
      setError(null);
    } else {
      setChatbotStatus("loading");
      setError("Chatbot is initializing... Please wait.");
    }
  } catch (err) {
    setChatbotStatus("error");
    setError("Unable to connect to chatbot service. Is the backend running?");
  }
}, [RAG_API_SERVER_URL]);

 // Check chatbot status on mount and every 5 seconds until it's ready
  useEffect(() => {
  if (chatbotStatus === "ready") return; // stop entirely once ready

  checkChatbotStatus();
  const interval = setInterval(checkChatbotStatus, 5000);
  return () => clearInterval(interval);
}, [chatbotStatus, checkChatbotStatus]);

  // Function to send user message and get bot response
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission

    // Don't send empty messages or if chatbot is not ready
    if (!inputValue.trim() || isLoading || chatbotStatus !== "ready") {
      return;
    }

    const userQuestion = inputValue;

    // Add user message to chat. It is a variable that holds the user message object.
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      text: userQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]); // Add user message to chat
    setInputValue(""); // Clear input field
    setIsLoading(true); // Set loading state
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${RAG_API_SERVER_URL}/chat/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
        signal: AbortSignal.timeout(360000), // 6 minutes timeout for LLM response
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add bot message
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "bot",
        text: data.answer || "Sorry, I didn't find relevant information to your question.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);

      // Add error message to chat
      const errorBotMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "bot",
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-full max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 z-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Chatbot</h3>
          <p className="text-sm text-blue-100">
            {chatbotStatus === "ready" ? "🟢 Online" : "🟡 Initializing..."}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg rounded-bl-none px-4 py-2 text-sm">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Status Message */}
      {chatbotStatus !== "ready" && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          ⏳ Initializing chatbot... Make sure Ollama and backend are running.
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        className="border-t border-gray-200 p-4 bg-white rounded-b-lg"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              chatbotStatus === "ready"
                ? "Ask me anything about the resume..."
                : "Waiting for chatbot to be ready..."
            }
            disabled={isLoading || chatbotStatus !== "ready"}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim() || chatbotStatus !== "ready"}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-sm"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Floating Button Component
export function ChatbotFloatingButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center z-30 border-0"
      title="Open Chatbot"
    >
      <span className="text-2xl">💬</span>
    </button>
  );
}

export default Chatbot;
