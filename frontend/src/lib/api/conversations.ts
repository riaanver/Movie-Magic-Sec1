import apiClient from "@/lib/api-client";
import type { ConversationMessage, ConversationSummary } from "@/types";

export const listUserConversations = async (userId: string): Promise<ConversationSummary[]> => {
  const { data } = await apiClient.get<ConversationSummary[]>(`/conversations/user/${userId}`);
  return data;
};

export const getConversation = async (conversationId: number): Promise<ConversationSummary> => {
  const { data } = await apiClient.get<ConversationSummary>(`/conversations/${conversationId}`);
  return data;
};

export const createConversation = async (userId: string): Promise<ConversationSummary> => {
  const { data } = await apiClient.post<ConversationSummary>("/conversations", null, {
    params: { user_id: userId }
  });
  return data;
};

export const deleteConversation = async (conversationId: number): Promise<void> => {
  await apiClient.delete(`/conversations/${conversationId}`);
};

export const getConversationMessages = async (
  conversationId: number
): Promise<ConversationMessage[]> => {
  const { data } = await apiClient.get<ConversationMessage[]>(
    `/conversations/${conversationId}/messages`
  );
  return data;
};
