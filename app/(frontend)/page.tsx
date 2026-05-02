"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body antialiased">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between px-6 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-primary">Acada</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95 duration-200">
            notifications
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container-high">
            <img alt="User profile avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjoxqYfXOWejHk8_UWFDq6Wi2-0ecZoOfbZsB4h9HK_hUVJQtd5SwnEIIYvTj2_caLv1BQQQ7xN07cepW5yeUUzAcsdJg4t4Qs-yZhM2411D9-fO70gRGDId3G6zfxdbbL1LgvS12RSzPBChq-lHxXG6Vr4TTDZZsrgEIwtzzrmfV5TFqMmPXSbvuUQnNCOC9K8i99vVsTEnQLvXMQJ_IxgXBzEFFG7VKY-EXO0zEGFzLsy5rUT1JZ0c_kpy5NBwFPvMjZwFpvOA" />
          </div>
        </div>
      </header>

      <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden pt-16">
        <section className="relative flex w-full max-w-7xl flex-col items-center px-6 py-20 text-center md:py-32">
          <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2">
            <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
          </div>

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center rounded-full bg-surface-container-low px-4 py-1.5 font-label text-sm font-bold tracking-tight text-primary">
              <span className="material-symbols-outlined mr-2 text-sm">verified</span>
              WEB3 POWERED CREDENTIALS
            </div>
            <h1 className="text-5xl leading-[1.1] font-extrabold tracking-tighter text-inverse-surface md:text-7xl">
              Decentralized Learning <br />
              <span className="text-primary italic">for the Future</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Earn immutable blockchain certificates, own your educational data, and join a global network of curated knowledge curators and builders.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
              <Link href="/sign_up" className="flex w-full items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim active:scale-[0.98] sm:w-auto">
                Sign Up
              </Link>
              <Link href="/login" className="flex w-full items-center justify-center rounded-xl border border-transparent bg-surface-container-lowest px-8 py-4 text-lg font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-low active:scale-[0.98] sm:w-auto">
                Log In
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl px-6 pb-32">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative min-h-100 overflow-hidden rounded-xl bg-surface-container-low p-8 md:col-span-8">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="font-label text-xs font-bold uppercase tracking-widest text-primary">Innovation</span>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight">Blockchain-Verified Excellence</h3>
                  <p className="mt-4 max-w-md text-on-surface-variant">Your achievements are secured on-chain forever. No more manual verification, just one link to prove your entire skill set.</p>
                </div>
                <div className="relative z-10 mt-12 flex justify-end">
                  <div className="max-w-xs rotate-3 rounded-xl bg-surface-container-lowest p-6 shadow-xl shadow-surface-tint/10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-24 rounded bg-surface-container-high" />
                        <div className="h-2 w-16 rounded bg-surface-container-low" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex h-12 w-full items-center rounded-lg bg-surface-container-low px-4 font-label text-[10px] text-on-surface-variant">0x821...F3B2</div>
                      <div className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-on-primary">VERIFY CERTIFICATE</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 -mb-20 -mr-20 h-2/3 w-2/3 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center rounded-xl bg-inverse-surface p-8 text-center text-on-tertiary">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-highest/20">
                <span className="material-symbols-outlined text-3xl text-on-tertiary">account_balance_wallet</span>
              </div>
              <h3 className="font-headline text-xl font-bold">Wallet Native</h3>
              <p className="mt-2 text-sm leading-relaxed text-inverse-on-surface">Connect your wallet to instantly access decentralized learning pathways.</p>
            </div>

            <div className="md:col-span-4 rounded-xl bg-surface-container-high p-8">
              <span className="material-symbols-outlined mb-4 text-primary">speed</span>
              <h3 className="text-xl font-bold tracking-tight">Adaptive Pace</h3>
              <p className="mt-2 text-sm text-on-surface-variant">Self-directed curriculums designed to fit into your professional schedule.</p>
            </div>

            <div className="md:col-span-4 rounded-xl bg-surface-container-lowest p-8 shadow-[0_8px_24px_-4px_rgba(7,14,29,0.04)]">
              <span className="material-symbols-outlined mb-4 text-primary">groups</span>
              <h3 className="text-xl font-bold tracking-tight">Curated Peer Review</h3>
              <p className="mt-2 text-sm text-on-surface-variant">Learn alongside high-caliber peers and industry-leading mentors.</p>
            </div>

            <div className="md:col-span-4 flex flex-col justify-between rounded-xl bg-primary p-8 text-on-primary">
              <h3 className="text-xl font-bold tracking-tight">Global Network</h3>
              <div className="mt-4 flex -space-x-3">
                <img className="h-10 w-10 rounded-full border-2 border-on-primary" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" />
                <img className="h-10 w-10 rounded-full border-2 border-on-primary" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" />
                <img className="h-10 w-10 rounded-full border-2 border-on-primary" src="https://randomuser.me/api/portraits/men/54.jpg" alt="User 3" />
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-on-primary bg-on-primary font-bold text-primary">+99</span>
              </div>
              <p className="mt-4 text-sm">Join a global community of learners and educators.</p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .glass-header {
          background: color-mix(in oklab, var(--color-surface) 60%, transparent);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
