import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import { mockMessages } from './mockData';

function App() {
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (text) => {
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);

    // Simulate bot typing and response
    setTimeout(() => {
      const typingMessage = {
        id: messages.length + 2,
        sender: 'bot',
        isTyping: true,
      };
      setMessages((prev) => [...prev, typingMessage]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => !msg.isTyping));
        
        const botResponse = {
          id: messages.length + 3,
          sender: 'bot',
          text: "I'd love to help you with that! In a fully functional version, I would search the TMDB database and provide personalized recommendations based on your request. 🎬✨",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1500);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
