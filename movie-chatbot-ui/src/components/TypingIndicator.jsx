import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-3 w-fit animate-slideInLeft">
      <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl rounded-bl-none glass-effect">
        <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
