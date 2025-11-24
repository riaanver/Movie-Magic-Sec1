import apiClient from "@/lib/api-client";
import type { ChatResponse, SendMessagePayload } from "@/types";

export const sendChatMessage = async ({
  userId,
  message,
  conversationId
}: SendMessagePayload): Promise<ChatResponse> => {
  const { data } = await apiClient.post<ChatResponse>("/chat", {
    user_id: userId,
    message,
    conversation_id: conversationId ?? null
  });

  return data;
};
