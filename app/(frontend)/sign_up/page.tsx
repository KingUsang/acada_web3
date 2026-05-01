"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { toast } from "sonner";

export default function SignUpPage() {
  const { login, authenticateUser, refreshAppUser } = useAuth();
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    try {
      await login();
      const idToken = await authenticateUser();
      
      if (!idToken) {
        toast.error("Failed to get authentication token");
        return;
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
              <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Choose your journey
              </label>
              <div className="flex p-1 bg-surface-container-high rounded-full w-full">
                {/* Student Pill */}
                <button 
                  onClick={() => setRole("STUDENT")}
                  className={`flex-1 py-3 px-6 rounded-full font-label font-semibold text-sm transition-all duration-200 ${role === "STUDENT" ? "bg-inverse-surface text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  Student
                </button>
                {/* Tutor Pill */}
                <button 
                  onClick={() => setRole("TUTOR")}
                  className={`flex-1 py-3 px-6 rounded-full font-label font-semibold text-sm transition-all duration-200 ${role === "TUTOR" ? "bg-inverse-surface text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  Tutor
                </button>
              </div>
            </div>

            {/* Input Group */}
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
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline">
                    alternate_email
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200 text-on-surface placeholder:text-outline/60 font-body"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                  Secure Password
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline">
                    lock_open
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200 text-on-surface placeholder:text-outline/60 font-body"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                  <button type="button" className="absolute right-4 text-outline hover:text-primary">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>

              {/* Primary Action */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-5 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-extrabold text-lg tracking-tight shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  disabled={isSigningUp}
                >
                  <span>{isSigningUp ? "Creating Account..." : "Create Account"}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
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
            <a className="underline" href="#">
              Terms of Service
            </a>{" "}
            &{" "}
            <a className="underline" href="#">
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
