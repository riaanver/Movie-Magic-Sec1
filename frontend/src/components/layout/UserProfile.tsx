"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ListVideo, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { data: watchlistItems } = useWatchlist();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const initials = user.email.substring(0, 2).toUpperCase();
  const watchlistCount = watchlistItems?.length || 0;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] px-3 py-2 transition hover:bg-[color:var(--surface-2)]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-semibold text-white">
          {initials}
        </div>
        <span className="hidden text-sm font-medium text-[color:var(--text-primary)] md:block">
          {user.email.split("@")[0]}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[color:var(--text-secondary)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] shadow-lg">
          {/* User Info Section */}
          <div className="border-b border-[color:var(--border-soft)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-lg font-semibold text-white">
                {initials}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-[color:var(--text-primary)]">
                  {user.email}
                </p>
                <p className="text-xs text-[color:var(--text-secondary)]">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-b border-[color:var(--border-soft)] p-4">
            <div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
              <ListVideo className="h-4 w-4" />
              <span>
                <span className="font-semibold text-[color:var(--text-primary)]">{watchlistCount}</span>{" "}
                {watchlistCount === 1 ? "movie" : "movies"} in watchlist
              </span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[color:var(--text-secondary)] transition hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text-primary)]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
