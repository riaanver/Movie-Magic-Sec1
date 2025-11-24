"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to chat page - the new home for Movie Magic
    router.replace("/chat");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--accent)]" />
        <p className="text-lg text-[color:var(--text-secondary)]">Loading Movie Magic...</p>
      </div>
    </div>
  );
}
