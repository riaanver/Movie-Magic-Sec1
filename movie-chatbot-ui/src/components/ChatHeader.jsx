import React from 'react';
import { Sparkles, Film } from 'lucide-react';

const ChatHeader = () => {
  return (
    <div className="glass-effect-strong rounded-t-3xl px-6 py-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center glow-accent">
              <Film className="w-5 h-5 text-background" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
              Movie Magic AI
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </h1>
            <p className="text-xs text-text-secondary">Powered by TMDB & AI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
