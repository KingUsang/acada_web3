"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth/context";
import { AuthGuard } from "../components/auth-guard";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { user, login, logout } = useAuth();
  
  return (
    <div className="bg-background text-foreground font-[family-name:var(--font-inter)] antialiased min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/60 backdrop-blur-xl shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary lg:hidden cursor-pointer mr-2" aria-hidden="true" title="Menu">menu</span>
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary font-['Manrope']">
            Acada
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors active:scale-95 duration-200" title="Notifications">
            notifications
          </button>
          <div 
            className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-blue-100" 
            onClick={user ? logout : login}
            title={user ? "Logout" : "Login"}
          >
            {user?.profileImage ? (
              <img alt="User profile avatar" className="w-full h-full object-cover" src={user.profileImage} />
            ) : (
              <span className="material-symbols-outlined text-sm text-slate-600">person</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-16 flex-1 flex flex-col w-full h-full">
        <AuthGuard>
          {children}
        </AuthGuard>
      </main>
    </div>
  );
}

