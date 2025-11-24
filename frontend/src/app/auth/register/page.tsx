"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const RegisterPage = () => {
  const { register, isLoading, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setPending(true);
      await register(email, password);
      router.push("/chat");
    } catch (error) {
      toast.error((error as Error).message || "Unable to register");
    } finally {
      setPending(false);
    }
  };

  if (user && !isLoading) {
    router.replace("/chat");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">Create account</h1>
      <p className="text-sm text-[color:var(--text-secondary)]">Save watchlists and ratings.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
            Email
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--text-primary)]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
            Password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--text-primary)]"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-[color:var(--text-secondary)]">
        Already registered?{" "}
        <button
          type="button"
          className="text-[color:var(--accent)] underline-offset-4 hover:underline"
          onClick={() => router.push("/auth/login")}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
