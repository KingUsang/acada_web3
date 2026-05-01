"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
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
          <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container-high">
            <img
              alt="User profile avatar"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjoxqYfXOWejHk8_UWFDq6Wi2-0ecZoOfbZsB4h9HK_hUVJQtd5SwnEIIYvTj2_caLv1BQQQ7xN07cepW5yeUUzAcsdJg4t4Qs-yZhM2411D9-fO70gRGDId3G6zfxdbbL1LgvS12RSzPBChq-lHxXG6Vr4TTDZZsrgEIwtzzrmfV5TFqMmPXSbvuUQnNCOC9K8i99vVsTEnQLvXMQJ_IxgXBzEFFG7VKY-EXO0zEGFzLsy5rUT1JZ0c_kpy5NBwFPvMjZwFpvOA"
            />
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          id="mobile-nav-menu"
          className="fixed top-16 z-40 w-full bg-surface-container-lowest/95 px-6 py-4 backdrop-blur-xl shadow-[0_16px_32px_-8px_rgba(7,14,29,0.08)] sm:hidden"
        >
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:bg-surface-container-low"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/student_home"
              className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-low"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/wallet_connection"
              className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-low"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-low"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </Link>
          </nav>
        </div>
      ) : null}

      <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-16 pb-28">
        <section className="relative flex w-full max-w-7xl flex-col items-center px-6 py-16 text-center md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2">
            <div className="absolute left-10 top-16 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-12 right-10 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
          </div>
          <div className="space-y-6 max-w-4xl">
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
              <Link
                href="/sign_up"
                className="inline-flex min-w-36 items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="inline-flex min-w-36 items-center justify-center rounded-xl border border-transparent bg-surface-container-lowest px-6 py-3 text-base font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-low active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg"
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl px-6 pb-14">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative min-h-100 overflow-hidden rounded-xl bg-surface-container-low p-8 md:col-span-8">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Innovation</span>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight">Blockchain-Verified Excellence</h3>
                  <p className="mt-4 max-w-md text-on-surface-variant">
                    Your achievements are secured on-chain forever. No more manual verification, just one link to prove your entire skill set.
                  </p>
                </div>
                <div className="mt-12 flex justify-end">
                  <div className="max-w-xs rotate-3 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-24 rounded bg-slate-100" />
                        <div className="h-2 w-16 rounded bg-slate-50" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex h-12 w-full items-center rounded-lg bg-surface-container-low px-4 font-label text-[10px] text-on-surface-variant">
                        0x821...F3B2
                      </div>
                      <div className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-on-primary">
                        VERIFY CERTIFICATE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 h-2/3 w-2/3 rounded-full bg-primary/5 blur-3xl -mb-20 -mr-20" />
            </div>
            {/* Small Card 1 */}
            <div className="md:col-span-4 bg-inverse-surface text-on-tertiary rounded-xl p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-surface-container-highest/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-3xl">account_balance_wallet</span>
              </div>
              <h3 className="text-xl font-bold font-headline text-on-surface">Wallet Native</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                Connect your wallet to instantly access decentralized learning pathways.
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-high p-8 md:col-span-4">
              <span className="material-symbols-outlined mb-4 text-primary">speed</span>
              <h3 className="text-xl font-bold tracking-tight">Adaptive Pace</h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Self-directed curriculums designed to fit into your professional schedule.
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_8px_24px_-4px_rgba(7,14,29,0.04)] md:col-span-4">
              <span className="material-symbols-outlined mb-4 text-primary">groups</span>
              <h3 className="text-xl font-bold tracking-tight">Curated Peer Review</h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Learn alongside high-caliber peers and industry-leading mentors.
              </p>
            </div>
            {/* Small Card 4 */}
            <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between">
              <h3 className="text-xl font-bold tracking-tight">Global Network</h3>
              <div className="mt-4 flex -space-x-3">
                <img className="h-10 w-10 rounded-full border-2 border-on-primary" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" />
                <img className="h-10 w-10 rounded-full border-2 border-on-primary" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" />
                <img className="h-10 w-10 rounded-full border-2 border-on-primary" src="https://randomuser.me/api/portraits/men/54.jpg" alt="User 3" />
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-on-primary bg-on-primary font-bold text-primary">+99</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl px-6 pb-8 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Ready to take control of your learning?
          </p>
          <div className="mt-4 flex max-w-sm items-center gap-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 shadow-sm">
            <span className="material-symbols-outlined text-primary">wallet</span>
            <Link
              href="/wallet_connection"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container-lowest py-2.5 font-bold text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Connect Wallet
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant">
            MetaMask, WalletConnect, and Coinbase Wallet supported.
          </p>
        </section>
      </main>

    </div>
  );
}
