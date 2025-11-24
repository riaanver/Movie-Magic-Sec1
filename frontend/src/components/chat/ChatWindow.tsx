import MessageList from "@/components/chat/MessageList";
import ChatComposer from "@/components/chat/ChatComposer";
import type { ChatMessage } from "@/types";
import { Sparkles } from "lucide-react";

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
}

const ChatWindow = ({ messages, onSend, isSending }: ChatWindowProps) => {
  // Check if this is the initial welcome message (only 1 assistant message)
  const isWelcomeScreen = messages.length === 1 && messages[0].role === "assistant";
  const welcomeMessage = isWelcomeScreen ? messages[0].content : null;

  // Extract greeting (first part before the exclamation)
  const greeting = welcomeMessage?.split("!")[0] || "";

  return (
    <div className="flex h-full flex-col bg-[color:var(--bg-base)]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isWelcomeScreen ? (
          /* Centered Welcome Screen - Claude Style */
          <div className="flex h-full items-center justify-center px-8">
            <div className="max-w-2xl text-center">
              {/* Gemini Icon */}
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent)]/70 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              {/* Greeting */}
              <h1 className="mb-4 text-4xl font-semibold text-[color:var(--text-primary)]">
                {greeting}
              </h1>
            </div>
          </div>
        ) : (
          /* Regular Message List */
          <MessageList messages={messages} />
        )}
      </div>

      {/* Fixed Composer at Bottom */}
      <div className="border-t border-[color:var(--border-soft)] bg-[color:var(--bg-base)] px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <ChatComposer onSend={onSend} disabled={isSending} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
