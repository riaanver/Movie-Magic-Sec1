import React from 'react';
import MovieCard from './MovieCard';
import MovieDetail from './MovieDetail';
import TypingIndicator from './TypingIndicator';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';

  // Typing indicator
  if (message.isTyping) {
    return <TypingIndicator />;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div className={`max-w-[85%] ${isUser ? 'animate-slideInRight' : 'animate-slideInLeft'}`}>
        {/* Text Message */}
        {message.text && (
          <div
            className={`px-4 py-3 ${
              isUser
                ? 'bg-accent text-background rounded-2xl rounded-br-none'
                : 'glass-effect text-text-main rounded-2xl rounded-bl-none'
            } ${isUser ? 'shadow-lg shadow-accent/20' : ''}`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {message.text.split('**').map((part, idx) => 
                idx % 2 === 0 ? part : <strong key={idx}>{part}</strong>
              )}
            </p>
            
            {/* Quick Actions */}
            {message.quickActions && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1.5 text-xs rounded-full bg-primary/60 hover:bg-accent hover:text-background border border-white/20 hover:border-accent text-text-main transition-all duration-300 hover:scale-105"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Options */}
            {message.options && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {message.options.map((option, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-2 rounded-lg bg-primary/60 hover:bg-accent/20 border border-white/20 hover:border-accent text-text-main transition-all duration-300 flex items-center gap-2 text-sm hover:scale-105"
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Movie Cards */}
        {message.movies && message.movies.length > 0 && (
          <div className="space-y-3 mt-3">
            {message.movies.map((movie, idx) => (
              <MovieCard key={movie.id || idx} movie={movie} />
            ))}
          </div>
        )}

        {/* Movie Detail */}
        {message.movieDetail && (
          <div className="mt-3">
            <MovieDetail movie={message.movieDetail} />
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs text-text-secondary mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp && new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;
