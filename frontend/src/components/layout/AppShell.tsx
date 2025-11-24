"use client";

import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";

  // Full-screen layout for chat page (no header, no max-width)
  if (isChatPage) {
    return (
      <div className="h-screen overflow-hidden bg-[color:var(--bg-base)] text-[color:var(--text-primary)] transition-colors">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.06),_transparent_55%)]" />
        <main className="relative h-full">{children}</main>
      </div>
    );
  }

  // Regular layout with header for other pages
  return (
    <div className="min-h-screen bg-[color:var(--bg-base)] text-[color:var(--text-primary)] transition-colors">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.06),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
