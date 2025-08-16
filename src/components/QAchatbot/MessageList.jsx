import React from 'react';
import Message from './Message';
import KnowledgeGraphVisualizer from '../KnowledgeGraphVisualizer';

const MessageList = ({ messages, onToggleGraph }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id}>
          <Message message={message} onToggleGraph={onToggleGraph} />
          
          {/* Show Graph Visualization if toggled */}
          {message.showGraph && message.traversalPath && (
            <div className="ml-12 mb-4">
              <KnowledgeGraphVisualizer graphData={message.traversalPath} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
