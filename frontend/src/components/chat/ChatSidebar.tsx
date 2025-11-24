"use client";

import { useState } from "react";
import clsx from "clsx";
import { Loader2, Plus, Trash2, ListVideo, ChevronDown, ChevronLeft, ChevronRight, User } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { ConversationSummary } from "@/types";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

interface ChatSidebarProps {
  conversationId?: number;
  conversations: ConversationSummary[];
  isSending: boolean;
  isLoadingConversations: boolean;
  error?: string;
  onSelectConversation: (conversationId?: number) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: number) => void;
}

const ChatSidebar = ({
  conversationId,
  conversations,
  isSending,
  isLoadingConversations,
  error,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation
}: ChatSidebarProps) => {
  const { user, logout } = useAuth();
  const { data: watchlistItems } = useWatchlist();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isWatchlistExpanded, setIsWatchlistExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initials = user?.email.substring(0, 2).toUpperCase() || "U";
  const watchlistCount = watchlistItems?.length || 0;

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    router.push("/");
  };

  // Collapsed sidebar - just toggle button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] p-2 shadow-lg transition hover:bg-[color:var(--surface-2)]"
      >
        <ChevronRight className="h-5 w-5 text-[color:var(--text-secondary)]" />
      </button>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[color:var(--border-strong)] bg-[color:var(--surface-1)] shadow-lg">
      {/* Header with New Chat + Collapse */}
      <div className="flex items-center justify-between border-b border-[color:var(--border-soft)] p-3">
        <button
          onClick={onCreateConversation}
          disabled={isLoadingConversations}
          className="flex flex-1 items-center gap-2 rounded-lg bg-[color:var(--text-primary)] px-3 py-2 text-sm font-semibold text-[color:var(--bg-base)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="ml-2 rounded-lg p-2 transition hover:bg-[color:var(--surface-2)]"
        >
          <ChevronLeft className="h-5 w-5 text-[color:var(--text-secondary)]" />
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingConversations && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[color:var(--text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />
            Loading...
          </div>
        )}

        {!isLoadingConversations && conversations.length === 0 && (
          <p className="rounded-lg px-3 py-6 text-center text-xs text-[color:var(--text-muted)]">
            No conversations yet
          </p>
        )}

        {!isLoadingConversations &&
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectConversation(conversation.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectConversation(conversation.id);
                }
              }}
              className={clsx(
                "group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition",
                conversationId === conversation.id
                  ? "bg-[color:var(--surface-3)] text-[color:var(--text-primary)]"
                  : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-2)]"
              )}
            >
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">Chat #{conversation.id}</p>
                <p className="truncate text-xs text-[color:var(--text-muted)]">
                  {formatRelativeTime(conversation.last_message_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                disabled={isLoadingConversations}
                className="rounded p-1 opacity-0 transition hover:bg-[color:var(--surface-3)] hover:text-red-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Delete conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

        {error && (
          <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </p>
        )}
      </div>

      {/* Watchlist Section */}
      {user && watchlistCount > 0 && (
        <div className="border-t border-[color:var(--border-soft)] p-2">
          <button
            type="button"
            onClick={() => setIsWatchlistExpanded(!isWatchlistExpanded)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition hover:bg-[color:var(--surface-2)]"
          >
            <div className="flex items-center gap-2">
              <ListVideo className="h-4 w-4 text-[color:var(--accent)]" />
              <span className="text-sm font-medium text-[color:var(--text-primary)]">Watchlist</span>
              <span className="rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--text-primary)]">
                {watchlistCount}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-[color:var(--text-secondary)] transition-transform ${
                isWatchlistExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isWatchlistExpanded && (
            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
              {watchlistItems && watchlistItems.length > 0 ? (
                watchlistItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-[color:var(--surface-2)]"
                  >
                    {item.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.movie_title}
                        className="h-12 w-8 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs font-medium text-[color:var(--text-primary)]">
                        {item.movie_title}
                      </p>
                      <p className="text-[10px] text-[color:var(--text-secondary)]">
                        {item.watched ? "Watched" : "To watch"}
                        {item.rating && ` · ${item.rating}★`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-[color:var(--text-muted)]">No movies yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Profile at Bottom */}
      {user && (
        <div className="relative border-t border-[color:var(--border-soft)] p-2">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-[color:var(--surface-2)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate text-sm font-medium text-[color:var(--text-primary)]">
                {user.email.split("@")[0]}
              </p>
              <p className="truncate text-xs text-[color:var(--text-muted)]">{user.email}</p>
            </div>
          </button>

          {/* Profile Menu */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-2 right-2 mb-2 rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] shadow-lg">
              <div className="p-3">
                <p className="text-xs text-[color:var(--text-secondary)]">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                  {watchlistCount} {watchlistCount === 1 ? "movie" : "movies"} saved
                </p>
              </div>
              <div className="border-t border-[color:var(--border-soft)] p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[color:var(--text-secondary)] transition hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text-primary)]"
                >
                  <User className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default ChatSidebar;
