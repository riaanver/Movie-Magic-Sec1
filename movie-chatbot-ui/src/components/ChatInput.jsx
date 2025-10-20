import React, { useState } from 'react';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`glass-effect-strong rounded-full px-5 py-3 flex items-center gap-3 transition-all duration-300 ${
            isFocused ? 'glow-accent border-accent/50' : 'border-white/10'
          } border`}
        >
          {/* Magic indicator */}
          <button 
            type="button"
            className="flex-shrink-0 p-2 rounded-full hover:bg-accent/20 transition-colors duration-300 group"
            title="AI Suggestions"
          >
            <Sparkles className="w-4 h-4 text-accent group-hover:animate-pulse" />
          </button>

          {/* Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about movies, actors, or genres..."
            className="flex-1 bg-transparent outline-none text-text-main placeholder-text-secondary text-sm"
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="flex-shrink-0 p-2 rounded-full hover:bg-accent/20 transition-colors duration-300 group hidden sm:block"
              title="Attach image"
            >
              <Paperclip className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors duration-300" />
            </button>

            <button 
              type="button"
              className="flex-shrink-0 p-2 rounded-full hover:bg-accent/20 transition-colors duration-300 group hidden sm:block"
              title="Voice input"
            >
              <Mic className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors duration-300" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim()}
              className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-300 ${
                message.trim()
                  ? 'bg-accent text-background hover:scale-110 hover:shadow-lg hover:shadow-accent/50'
                  : 'bg-primary/60 text-text-secondary cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint Text */}
        <p className="text-xs text-text-secondary text-center mt-2">
          Powered by TMDB API & AI • Press Enter to send
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
