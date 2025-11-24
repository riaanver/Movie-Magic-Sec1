"use client";

import Link from "next/link";
import { Film, Github } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import UserProfile from "@/components/layout/UserProfile";
import { useAuth } from "@/providers/auth-provider";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] px-4 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* User Profile (left side) - ChatGPT style */}
        {user ? (
          <UserProfile />
        ) : (
          <Link href="/chat" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-2)] text-[color:var(--text-primary)]">
              <Film className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-semibold text-[color:var(--text-primary)]">Movie Magic</p>
              <p className="text-xs text-[color:var(--text-secondary)]">Conversational discovery</p>
            </div>
          </Link>
        )}

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2">
          {!user && (
            <Link
              href="/auth/login"
              className="rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] px-4 py-1.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
            >
              Sign In
            </Link>
          )}
          <ThemeToggle />
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] px-3 py-1 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            <Github className="h-4 w-4" />
            Repo
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
