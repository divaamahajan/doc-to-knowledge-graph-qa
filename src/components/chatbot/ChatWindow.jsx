// src/components/chatbot/ChatWindow.jsx
import { useState, useRef, useEffect } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const API_BASE = process.env.REACT_APP_API_BASE;
export const AI_CHAT_URL = `${API_BASE}/chat`;

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: "bot", 
      text: "👋 Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(AI_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply || "I received your message but couldn't generate a response.",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setRetryCount(0);
    } catch (error) {
      console.error("Chat error:", error);
      
      let errorMessage = "I'm having trouble connecting right now. ";
      
      if (!isOnline) {
        errorMessage = "🔌 You appear to be offline. Please check your internet connection.";
      } else if (error.message.includes('500')) {
        errorMessage = "🔧 I'm experiencing technical difficulties. Please try again in a moment.";
      } else if (error.message.includes('404')) {
        errorMessage = "⚠️ Chat service is temporarily unavailable.";
      } else {
        errorMessage += retryCount > 2 
          ? "Please refresh the page if the problem persists."
          : "Please try again.";
      }

      const errorBotMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: errorMessage,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages((prev) => [...prev, errorBotMessage]);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      sender: "bot", 
      text: "👋 Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }]);
    setRetryCount(0);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h1 className="text-xl font-bold">AI Assistant</h1>
                <p className="text-blue-100 text-sm">
                  {isOnline ? "Online" : "Offline"} • Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-blue-100 hover:text-white hover:bg-blue-600 p-2 rounded-lg transition-all duration-200 text-sm font-medium"
              title="Clear chat"
            >
              🗑️ Clear
            </button>
          </div>
        </header>

        {/* Enhanced Message area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white space-y-4">
          <MessageList messages={messages} />
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm italic">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Enhanced Input area */}
        <footer className="p-6 bg-white border-t border-gray-100 shadow-inner">
          {!isOnline && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm flex items-center space-x-2">
              <span>⚠️</span>
              <span>You're currently offline. Messages will be sent when connection is restored.</span>
            </div>
          )}
          <ChatInput onSend={sendMessage} disabled={!isOnline} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
}
