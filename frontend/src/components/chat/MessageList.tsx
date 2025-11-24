"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/types";
import MessageBubble from "@/components/chat/MessageBubble";

const MessageList = ({ messages }: { messages: ChatMessage[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 space-y-4 overflow-y-auto pr-2">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <MessageBubble message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
