// src/components/chatbot/QAChatWindow.jsx
import { useState, useRef, useEffect } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const API_BASE = process.env.REACT_APP_API_BASE;
export const KNOWLEDGE_GRAPH_BASE = `${API_BASE}/knowledge-graph`;
export const AI_CHAT_URL = `${KNOWLEDGE_GRAPH_BASE}/qa`;

export default function QAChatWindow({ user, token }) {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: "bot", 
      text: `🧠 Hello${user ? ` ${user}` : ''}! I'm your Knowledge Graph assistant. Ask me anything about your uploaded documents!`,
      timestamp: new Date()
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  
    useEffect(() => {
      fetchFiles();
    }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${KNOWLEDGE_GRAPH_BASE}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleFileSelection = (filename) => {
    if (selectedFiles.includes(filename)) {
      setSelectedFiles(prev => prev.filter(f => f !== filename));
    } else {
      setSelectedFiles(prev => [...prev, filename]);
    }
  };

  const selectAllFiles = () => {
    setSelectedFiles(files.map(f => f.filename));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

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
      // Build query parameters for the QA endpoint
      const params = new URLSearchParams();
      params.append('question', text);
      
      // Add selected files if any are selected
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(filename => {
          params.append('filenames', filename);
        });
      }

      const response = await fetch(`${AI_CHAT_URL}?${params.toString()}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.answer || data.reply || "I received your message but couldn't generate a response.",
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

        {/* Main Content - Split Layout */}
        <div className="flex h-full">
          
          {/* Left Side - Chat Window */}
          <div className="flex-1 flex flex-col">
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

          {/* Right Side - File List */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            
            {/* File List Header */}
            <div className="px-4 py-4 bg-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">📁 Select Files</h3>
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                  {selectedFiles.length}/{files.length}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">
                {loading 
                  ? "Loading your files..."
                  : files.length === 0 
                  ? "No files uploaded yet." 
                  : "Choose files to search through."}
              </p>

              {files.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllFiles}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Select All
                  </button>
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={clearSelection}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <p className="text-xs text-gray-600">Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500 text-center">No files available</p>
                  <p className="text-xs text-gray-400 text-center mt-1">Upload files first</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <label 
                      key={file.filename} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedFiles.includes(file.filename)
                          ? "bg-blue-50 border-blue-300 shadow-sm"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.filename)}
                        onChange={() => toggleFileSelection(file.filename)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700 truncate" title={file.filename}>
                            {file.filename}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Summary */}
            {selectedFiles.length > 0 && (
              <div className="p-4 bg-purple-50 border-t border-purple-200">
                <div className="text-xs text-purple-700">
                  <strong>{selectedFiles.length}</strong> file{selectedFiles.length !== 1 ? 's' : ''} selected
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  {selectedFiles.length === 0 
                    ? "All files will be searched" 
                    : "Only selected files will be searched"}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
