import React, { useState } from 'react';
import KnowledgeGraphVisualizer from '../KnowledgeGraphVisualizer';

const Message = ({ message, onToggleGraph }) => {
  const [showGraph, setShowGraph] = useState(false);

  const toggleGraph = () => {
    setShowGraph(!showGraph);
    if (onToggleGraph) {
      onToggleGraph(message.id, !showGraph);
    }
  };

  const hasGraphData = message.traversalPath && message.traversalPath.nodes;

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl px-4 py-3 rounded-lg ${
        message.sender === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-start space-x-3">
          {message.sender === 'bot' && (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium">
                {message.sender === 'user' ? 'You' : 'AI Assistant'}
              </span>
              <span className="text-xs opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <div className="text-sm leading-relaxed">
              {message.text}
            </div>

            {/* Sources and Graph Toggle for Bot Messages */}
            {message.sender === 'bot' && message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-600">Sources:</span>
                  <div className="mt-1 space-y-1">
                    {message.sources.map((source, idx) => (
                                           <div key={idx} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                       📄 {source.filename} (Section: {source.section})
                     </div>
                    ))}
                  </div>
                </div>
                
                {hasGraphData && (
                  <button
                    onClick={toggleGraph}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  >
                    {showGraph ? '🔽 Hide Graph' : ' Why? Show Graph'}
                  </button>
                )}
              </div>
            )}

            {/* Error styling */}
            {message.isError && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                ⚠️ Error occurred
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
