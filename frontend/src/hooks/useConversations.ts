"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  deleteConversation,
  getConversationMessages,
  listUserConversations
} from "@/lib/api/conversations";
import type { ConversationMessage, ConversationSummary } from "@/types";

const conversationListKey = (userId: string) => ["conversations", userId];
const conversationMessagesKey = (conversationId?: number) => [
  "conversations",
  conversationId,
  "messages"
];

export const useConversationList = (userId: string) =>
  useQuery({
    queryKey: conversationListKey(userId),
    queryFn: () => listUserConversations(userId),
    enabled: Boolean(userId)
  });

export const useConversationMessages = (conversationId?: number) =>
  useQuery({
    queryKey: conversationMessagesKey(conversationId),
    queryFn: () => getConversationMessages(conversationId!),
    enabled: Boolean(conversationId)
  });

export const useCreateConversation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createConversation(userId),
    onSuccess: (conversation) => {
      queryClient.setQueryData<ConversationSummary[]>(conversationListKey(userId), (prev) =>
        prev ? [conversation, ...prev] : [conversation]
      );
      queryClient.removeQueries({ queryKey: conversationMessagesKey(conversation.id) });
      queryClient.invalidateQueries({ queryKey: conversationListKey(userId) });
    }
  });
};

export const useDeleteConversation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) => deleteConversation(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.setQueryData<ConversationSummary[]>(conversationListKey(userId), (prev) =>
        prev ? prev.filter((conversation) => conversation.id !== conversationId) : prev
      );
      queryClient.removeQueries({ queryKey: conversationMessagesKey(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationListKey(userId) });
    }
  });
};
