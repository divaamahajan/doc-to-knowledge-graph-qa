// src/components/chatbot/Message.jsx
export default function Message({ sender, text, timestamp, isError }) {
  const isUser = sender === "user";

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md
            ${isUser 
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md" 
              : isError
                ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-md"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
            }
            break-words whitespace-pre-wrap
          `}
        >
          <div className="text-sm leading-relaxed">{text}</div>
        </div>
        
        {/* Timestamp */}
        <div 
          className={`
            text-xs text-gray-400 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
            ${isUser ? "text-right" : "text-left"}
          `}
        >
          {timestamp && formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}
