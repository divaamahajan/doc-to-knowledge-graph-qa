// src/components/chatbot/MessageList.jsx
import Message from "./Message";

export default function MessageList({ messages }) {
  return (
    <>
      {messages.map((msg) => (
        <Message 
          key={msg.id || msg.text + msg.timestamp} 
          sender={msg.sender} 
          text={msg.text}
          timestamp={msg.timestamp}
          isError={msg.isError}
        />
      ))}
    </>
  );
}
