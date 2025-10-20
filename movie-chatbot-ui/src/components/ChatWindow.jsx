import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, onSendMessage }) => {
  return (
    <div className="w-full max-w-4xl mx-auto h-[90vh] max-h-[800px] flex flex-col glass-effect-strong rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
