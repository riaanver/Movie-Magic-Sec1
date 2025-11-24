"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] px-3 py-1 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
      aria-label="Toggle color theme"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {isLight ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeToggle;
