"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { useChat } from "@/hooks/useChat";
import {
  useConversationList,
  useCreateConversation,
  useDeleteConversation
} from "@/hooks/useConversations";
import { useAuth } from "@/providers/auth-provider";

const ChatPage = () => {
  const { user, isLoading } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<number>();

  // Use user email as user ID, or fallback for unauthenticated users
  const userId = user?.email || "guest-user";

  const chat = useChat(userId, activeConversationId, {
    onConversationResolved: setActiveConversationId
  });
  const conversationsQuery = useConversationList(userId);
  const createConversationMutation = useCreateConversation(userId);
  const deleteConversationMutation = useDeleteConversation(userId);

  const isSidebarBusy =
    conversationsQuery.isLoading || createConversationMutation.isPending || deleteConversationMutation.isPending;

  const handleNewConversation = async () => {
    try {
      const conversation = await createConversationMutation.mutateAsync();
      setActiveConversationId(conversation.id);
      chat.resetConversation();
    } catch (error) {
      console.error("Failed to create conversation", error);
    }
  };

  const handleSelectConversation = (conversationId?: number) => {
    setActiveConversationId(conversationId);
    if (!conversationId) {
      chat.resetConversation();
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    try {
      await deleteConversationMutation.mutateAsync(conversationId);
      if (activeConversationId === conversationId) {
        setActiveConversationId(undefined);
        chat.resetConversation();
      }
    } catch (error) {
      console.error("Failed to delete conversation", error);
    }
  };

  const conversations = useMemo(() => {
    if (!conversationsQuery.data) return [];
    return [...conversationsQuery.data].sort(
      (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
  }, [conversationsQuery.data]);

  const isChatBusy = chat.isSending || chat.isHistoryLoading;

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[color:var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[color:var(--text-primary)]">
          Login to Save Your Conversations
        </h2>
        <p className="mb-6 text-sm text-[color:var(--text-secondary)]">
          Sign in to access personalized recommendations and save your chat history.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="rounded-full bg-[color:var(--surface-2)] px-6 py-2 text-sm font-medium text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface-3)]"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full border border-[color:var(--border-strong)] px-6 py-2 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            Register
          </Link>
        </div>
        <p className="mt-6 text-xs text-[color:var(--text-secondary)]">
          You can still browse movies without an account.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar on Left */}
      <ChatSidebar
        conversationId={activeConversationId}
        conversations={conversations}
        isSending={isChatBusy}
        isLoadingConversations={isSidebarBusy || chat.isHistoryLoading}
        error={chat.error}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Chat Window - takes remaining space */}
      <div className="flex-1 pl-64">
        <ChatWindow messages={chat.messages} onSend={chat.sendMessage} isSending={isChatBusy} />
      </div>
    </div>
  );
};

export default ChatPage;
