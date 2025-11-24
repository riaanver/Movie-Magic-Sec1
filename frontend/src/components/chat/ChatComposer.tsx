"use client";

import { FormEvent, useState } from "react";
import { Mic, Paperclip, Send } from "lucide-react";

interface ChatComposerProps {
  onSend: (message: string) => Promise<void> | void;
  disabled?: boolean;
}

const ChatComposer = ({ onSend, disabled }: ChatComposerProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    await onSend(input.trim());
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] px-4 py-3"
    >
      <button
        type="button"
        className="rounded-xl border border-[color:var(--border-soft)] p-3 text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
      >
        <Paperclip className="h-4 w-4" />
      </button>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Ask for a mood, actor, or vibe..."
        className="flex-1 resize-none bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:outline-none"
        rows={2}
        disabled={disabled}
      />
      <button
        type="button"
        className="rounded-xl border border-[color:var(--border-soft)] p-3 text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
      >
        <Mic className="h-4 w-4" />
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--text-primary)] px-4 py-2 text-sm font-semibold text-[color:var(--bg-base)] transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
      >
        Send
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
};

export default ChatComposer;
