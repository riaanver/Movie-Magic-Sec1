"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { sendChatMessage } from "@/lib/api/chat";
import { getConversationMessages } from "@/lib/api/conversations";
import type { ChatMessage, ChatResponse, ConversationMessage } from "@/types";

const createMessage = (role: ChatMessage["role"], content: string, movies?: any[]): ChatMessage => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  role,
  content,
  movies,
  createdAt: new Date().toISOString()
});

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
};

const getUsername = (userEmail: string): string => {
  // Extract name before @ and capitalize first letter
  const name = userEmail.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const welcomeMessage = (userEmail?: string) => {
  const timeOfDay = getTimeOfDay();
  const userName = userEmail ? getUsername(userEmail) : "";
  const greeting = userName ? `${timeOfDay}, ${userName}` : `Good ${timeOfDay.toLowerCase()}`;

  return createMessage(
    "assistant",
    `${greeting}!`
  );
};

const normalizeConversationMessage = (message: ConversationMessage): ChatMessage => ({
  id: message.id.toString(),
  role: message.role as ChatMessage["role"],
  content: message.content,
  createdAt: message.created_at
});

interface UseChatOptions {
  onConversationResolved?: (conversationId: number) => void;
}

export const useChat = (userId: string, conversationId?: number, options?: UseChatOptions) => {
  const userEmail = userId !== "guest-user" ? userId : undefined;
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage(userEmail)]);
  const [historyError, setHistoryError] = useState<string>();
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      if (!conversationId) {
        setMessages([welcomeMessage(userEmail)]);
        return;
      }

      setIsHistoryLoading(true);
      setHistoryError(undefined);

      try {
        const history = await getConversationMessages(conversationId);
        if (cancelled) return;
        setMessages(history.length ? history.map(normalizeConversationMessage) : [welcomeMessage(userEmail)]);
      } catch (error) {
        if (cancelled) return;
        setHistoryError(error instanceof Error ? error.message : "Failed to load history");
      } finally {
        if (!cancelled) {
          setIsHistoryLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [conversationId, userEmail]);

  const mutation = useMutation<
    ChatResponse,
    Error,
    { message: string; conversationId?: number },
    { pendingId: string }
  >({
    mutationFn: ({ message, conversationId: activeConversationId }) =>
      sendChatMessage({
        userId,
        message,
        conversationId: activeConversationId
      }),
    onMutate: ({ message }) => {
      const pendingMessage = createMessage("assistant", "Thinking…");
      setMessages((prev) => [...prev, createMessage("user", message), pendingMessage]);
      return { pendingId: pendingMessage.id };
    },
    onSuccess: (data, _variables, context) => {
      options?.onConversationResolved?.(data.conversation_id);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === context?.pendingId
            ? {
                ...message,
                content: data.message,
                movies: data.movies,
                createdAt: new Date().toISOString()
              }
            : message
        )
      );
    },
    onError: (error, _variables, context) => {
      setMessages((prev) => prev.filter((message) => message.id !== context?.pendingId));
      setMessages((prev) => [...prev, createMessage("assistant", `⚠️ ${error.message}`)]);
      toast.error(error.message);
    }
  });

  const sendMessage = useCallback(
    (message: string) => mutation.mutateAsync({ message, conversationId }).then(() => undefined),
    [conversationId, mutation]
  );

  const resetConversation = useCallback(() => setMessages([welcomeMessage(userEmail)]), [userEmail]);

  return useMemo(
    () => ({
      messages,
      isSending: mutation.isPending,
      sendMessage,
      error: mutation.error?.message || historyError,
      resetConversation,
      isHistoryLoading
    }),
    [messages, mutation.isPending, mutation.error?.message, historyError, isHistoryLoading, sendMessage, resetConversation]
  );
};
