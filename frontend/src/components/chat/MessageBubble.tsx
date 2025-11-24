import clsx from "clsx";
import type { ChatMessage } from "@/types";
import { Sparkles } from "lucide-react";
import ChatMovieCard from "./ChatMovieCard";

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  // Try to parse structured content if it's a JSON string
  let structuredContent: { message?: string; movies?: any[] } | null = null;
  if (!isUser && message.content && typeof message.content === 'string' && message.content.trim().startsWith("{")) {
    try {
      structuredContent = JSON.parse(message.content);
    } catch {
      // Not JSON, treat as plain text
    }
  }

  const displayMessage = structuredContent?.message || message.content || "";
  const movies = message.movies || structuredContent?.movies || [];
  const isThinking = displayMessage === "Thinking…" || displayMessage.toLowerCase().includes("thinking");

  return (
    <div
      className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
      aria-live={isUser ? undefined : "polite"}
    >
      <div
        className={clsx(
          "rounded-2xl border shadow-sm transition",
          isUser
            ? "max-w-xl rounded-br-lg border-[color:var(--border-soft)] bg-[color:var(--surface-3)] px-5 py-4 text-sm leading-relaxed text-[color:var(--text-primary)]"
            : "max-w-3xl w-full rounded-bl-lg border-[color:var(--border-soft)] bg-[color:var(--surface-2)]"
        )}
      >
        {!isUser ? (
          <>
            <div className="px-5 pt-4">
              <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                <Sparkles className={clsx("h-3 w-3", isThinking && "animate-pulse")} />
                Gemini
              </div>
              {isThinking ? (
                <div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
                  <span className="animate-pulse">Thinking</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--accent)]" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--accent)]" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--accent)]" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              ) : (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[color:var(--text-primary)]">
                  {displayMessage}
                </p>
              )}
            </div>

            {/* Render movie cards if present */}
            {movies.length > 0 && (
              <div className="px-5 pb-2">
                {movies.map((movie, index) => (
                  <ChatMovieCard key={`${movie.id}-${index}`} movie={movie} />
                ))}
              </div>
            )}

            <div className="px-5 pb-4">
              <span className="block text-right text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="whitespace-pre-line text-[color:var(--text-primary)]">{displayMessage}</p>
            <span className="mt-3 block text-right text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
