"use client";

import { AuthGuard } from "../components/auth-guard";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground font-[family-name:var(--font-inter)] antialiased min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="relative flex-1 flex flex-col w-full h-full">
        <AuthGuard>
          {children}
        </AuthGuard>
      </main>
    </div>
  );
}

