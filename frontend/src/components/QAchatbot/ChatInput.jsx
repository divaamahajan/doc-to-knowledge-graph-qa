// src/components/chatbot/ChatInput.jsx
import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend, disabled = false, isLoading = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!input.trim() || disabled || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const canSend = input.trim() && !disabled && !isLoading;

  return (
    <div className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          rows={1}
          className={`
            w-full
            border-2
            rounded-2xl
            px-4 py-3
            pr-12
            resize-none
            focus:outline-none
            transition-all
            duration-200
            placeholder-gray-400
            text-gray-900
            min-h-[48px]
            max-h-[120px]
            ${disabled 
              ? "border-gray-200 bg-gray-50 cursor-not-allowed" 
              : "border-gray-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            }
          `}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Chat is offline..." : "Type your message... (Enter to send, Shift+Enter for new line)"}
          disabled={disabled}
        />
        
        {/* Character count for long messages */}
        {input.length > 500 && (
          <div className="absolute bottom-1 right-12 text-xs text-gray-400">
            {input.length}/2000
          </div>
        )}
      </div>

      <button
        onClick={handleSend}
        className={`
          px-6 py-3
          font-semibold
          rounded-2xl
          transition-all
          duration-200
          shadow-lg
          min-w-[80px]
          flex items-center justify-center
          ${canSend
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl transform hover:scale-105"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
        disabled={!canSend}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span>Send</span>
        )}
      </button>
    </div>
  );
}
