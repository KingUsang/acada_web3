"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth/context";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-surface/80 px-6 backdrop-blur-xl shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <div className="flex items-center gap-3">
          <button
            aria-controls="mobile-nav-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
            className="material-symbols-outlined rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95 sm:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            type="button"
          >
            menu
          </button>
          <span className="text-2xl font-black tracking-tighter text-primary">Acada</span>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <button className="material-symbols-outlined rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95">
            notifications
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container-high" />
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          id="mobile-nav-menu"
          className="fixed top-16 z-40 w-full bg-surface-container-lowest/95 px-6 py-4 backdrop-blur-xl shadow-[0_16px_32px_-8px_rgba(7,14,29,0.08)] sm:hidden"
        >
          <nav className="flex flex-col gap-2">
            <Link href="/" className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/student_home" className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
            <Link href="/wallet_connection" className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Wallet</Link>
            <Link href="/login" className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
          </nav>
        </div>
      ) : null}

      <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-16 pb-28">
        <section className="relative flex w-full max-w-7xl flex-col items-center px-6 py-16 text-center md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2">
            <div className="absolute left-10 top-16 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-12 right-10 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
          </div>

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center rounded-full bg-surface-container-low px-4 py-1.5 text-sm font-bold tracking-tight text-primary">
              <span className="material-symbols-outlined mr-2 text-sm">verified</span>
              WEB3 POWERED CREDENTIALS
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tighter text-inverse-surface md:text-7xl">
              Decentralized Learning <br />
              <span className="italic text-primary">for the Future</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Earn immutable blockchain certificates, own your educational data, and join a global network of curated knowledge curators and builders.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
              <Link href="/sign_up" className="inline-flex min-w-36 items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg">Sign Up</Link>
              <button onClick={login} className="inline-flex min-w-36 items-center justify-center rounded-xl border border-transparent bg-surface-container-lowest px-6 py-3 text-base font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-low active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg" type="button">Log In</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
