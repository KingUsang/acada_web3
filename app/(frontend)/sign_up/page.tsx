"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { toast } from "sonner";
import { SolanaWallet } from "@web3auth/solana-provider";

export default function SignUpPage() {
  const { login, authenticateUser, refreshAppUser, isLoading, provider } = useAuth();
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [fullName, setFullName] = useState("");

  const handleSignUp = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (isLoading) {
      toast.error("Authentication is still initializing. Please wait a moment.");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setIsSigningUp(true);
    try {
      await login();
      const idToken = await authenticateUser();
      
      if (!idToken) {
        toast.error("Failed to get authentication token");
        return;
      }

      let solana_wallet_address = null;
      if (provider) {
        const solanaWallet = new SolanaWallet(provider);
        const accounts = await solanaWallet.requestAccounts();
        solana_wallet_address = accounts[0];
      }

      // Call register API to upsert user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          role,
          full_name: fullName.trim(),
          solana_wallet_address,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to register");
      }

      toast.success(`Account created as ${role}!`);
      router.push(role === "STUDENT" ? "/student_home" : "/tutor_home");
      await refreshAppUser(idToken);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during sign up";
      console.error("Sign up error:", error);
      toast.error(message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="bg-background font-body text-on-background min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Ambient Glow Background Decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-surface-dim/30 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="w-full max-w-[480px] z-10">
        {/* Brand Identity Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">
            Acada
          </h1>
          <p className="font-headline text-lg font-bold tracking-tight text-on-surface-variant">
            The future of curated learning starts here.
          </p>
        </div>

        {/* Content Canvas */}
        <section className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
          <div className="flex flex-col space-y-8">
            {/* Role Toggle Pills */}
            <div className="flex flex-col space-y-3">
              <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant text-center md:text-left">
                Choose your journey
              </label>
              <div className="flex p-1 bg-surface-container-high rounded-full w-full">
                {/* Student Pill */}
                <button 
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`flex-1 py-3 px-6 rounded-full font-label font-semibold text-sm transition-all duration-200 ${role === "STUDENT" ? "bg-inverse-surface text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  Student
                </button>
                {/* Tutor Pill */}
                <button 
                  type="button"
                  onClick={() => setRole("TUTOR")}
                  className={`flex-1 py-3 px-6 rounded-full font-label font-semibold text-sm transition-all duration-200 ${role === "TUTOR" ? "bg-inverse-surface text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  Tutor
                </button>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200 text-on-surface placeholder:text-outline/60 font-body"
                    placeholder="John Doe"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Primary Action */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-3 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-headline font-bold py-4 px-6 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 group"
                  disabled={isSigningUp || isLoading}
                >
                  {/* Google SVG */}
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>{isLoading ? "Preparing Auth..." : isSigningUp ? "Creating Account..." : "Sign up with Web3Auth"}</span>
                </button>
                
                <p className="mt-6 text-center font-body text-sm text-on-surface-variant">
                  Already have an account?{" "}
                  <Link className="text-primary font-bold hover:underline" href="/login">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Terms & Privacy */}
        <footer className="mt-8 text-center px-4">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline/80 leading-relaxed">
            By creating an account, you agree to our{" "}
            <a className="underline hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>{" "}
            &{" "}
            <a className="underline hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            . Acada utilizes decentralized encryption to secure your data.
          </p>
        </footer>
      </main>

      {/* Side Visual for Web View */}
      <div className="hidden lg:block fixed right-16 top-1/2 -translate-y-1/2 w-[400px] space-y-6">
        {/* Feature Card 1 */}
        <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface">Curated Pathing</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Our AI-driven curriculum adapts to your learning velocity and style.
          </p>
        </div>
        {/* Feature Card 2 */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-xl space-y-4 border border-white/20">
          <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface">Verified Credentials</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            On-chain certificates recognized by top industry leaders.
          </p>
        </div>
      </div>
    </div>
  );
}
