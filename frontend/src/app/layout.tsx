import type { Metadata } from "next";
import "./globals.css";
import { Cousine } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import AppShell from "@/components/layout/AppShell";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

const cousine = Cousine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Movie Magic AI",
  description: "Conversational movie discovery with RAG-powered intelligence"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${cousine.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <AppShell>{children}</AppShell>
            </QueryProvider>
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
