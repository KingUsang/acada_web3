"use client";

import { useState } from "react";
import { lamports as sol } from "@solana/kit";
import { toast } from "sonner";
import { useWallet } from "./lib/wallet/context";
import { useBalance } from "./lib/hooks/use-balance";
import { lamportsToSolString } from "./lib/lamports";
import { useSolanaClient } from "./lib/solana-client-context";
import { ellipsify } from "./lib/explorer";
import { VaultCard } from "./components/vault-card";
import { GridBackground } from "./components/grid-background";
import { ThemeToggle } from "./components/theme-toggle";
import { ClusterSelect } from "./components/cluster-select";
import { WalletButton } from "./components/wallet-button";
import { useCluster } from "./components/cluster-context";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen">
      {/* Glassmorphism Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-blue-600">Acada</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors active:scale-95 duration-200">notifications</button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
            <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjoxqYfXOWejHk8_UWFDq6Wi2-0ecZoOfbZsB4h9HK_hUVJQtd5SwnEIIYvTj2_caLv1BQQQ7xN07cepW5yeUUzAcsdJg4t4Qs-yZhM2411D9-fO70gRGDId3G6zfxdbbL1LgvS12RSzPBChq-lHxXG6Vr4TTDZZsrgEIwtzzrmfV5TFqMmPXSbvuUQnNCOC9K8i99vVsTEnQLvXMQJ_IxgXBzEFFG7VKY-EXO0zEGFzLsy5rUT1JZ0c_kpy5NBwFPvMjZwFpvOA" />
          </div>
        </div>
      </header>
      <main className="relative pt-16 min-h-screen flex flex-col items-center overflow-x-hidden">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-6 py-20 md:py-32 flex flex-col items-center text-center relative">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 blur-[150px] rounded-full"></div>
          </div>
          {/* Content */}
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-surface-container-low text-primary font-label text-sm font-bold tracking-tight">
              <span className="material-symbols-outlined text-sm mr-2">verified</span>
              WEB3 POWERED CREDENTIALS
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-inverse-surface leading-[1.1]">
              Decentralized Learning <br />
              <span className="text-primary italic">for the Future</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Earn immutable blockchain certificates, own your educational data, and join a global network of curated knowledge curators and builders.
            </p>
            {/* CTA Cluster */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dim active:scale-[0.98] transition-all text-lg">
                Sign Up
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl shadow-sm hover:bg-surface-container-low active:scale-[0.98] transition-all text-lg border border-transparent">
                Log In
              </button>
            </div>
          </div>
        </section>
        {/* Feature Bento Grid */}
        <section className="w-full max-w-7xl px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Card */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-100 overflow-hidden relative">
              <div className="relative z-10">
                <span className="font-label text-primary font-bold uppercase tracking-widest text-xs">Innovation</span>
                <h3 className="text-3xl font-bold mt-2 tracking-tight">Blockchain-Verified Excellence</h3>
                <p className="text-on-surface-variant mt-4 max-w-md">Your achievements are secured on-chain forever. No more manual verification—just one link to prove your entire skill set.</p>
              </div>
              <div className="mt-12 relative z-10 flex justify-end">
                <div className="bg-white p-6 rounded-xl shadow-xl shadow-slate-900/5 max-w-xs rotate-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-24 bg-slate-100 rounded"></div>
                      <div className="h-2 w-16 bg-slate-50 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-full bg-slate-50 rounded-lg flex items-center px-4 font-label text-[10px] text-slate-400">0x821...F3B2</div>
                    <div className="h-10 w-full bg-primary text-white text-[10px] rounded-lg flex items-center justify-center font-bold">VERIFY CERTIFICATE</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-primary/5 rounded-full blur-3xl -mb-20 -mr-20"></div>
            </div>
            {/* Small Card 1 */}
            <div className="md:col-span-4 bg-inverse-surface text-on-tertiary rounded-xl p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-surface-container-highest/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-3xl">account_balance_wallet</span>
              </div>
              <h3 className="text-xl font-bold font-headline">Wallet Native</h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">Connect your wallet to instantly access decentralized learning pathways.</p>
            </div>
            {/* Small Card 2 */}
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col">
              <span className="material-symbols-outlined text-primary mb-4">speed</span>
              <h3 className="text-xl font-bold tracking-tight">Adaptive Pace</h3>
              <p className="text-on-surface-variant mt-2 text-sm">Self-directed curriculums designed to fit into your professional schedule.</p>
            </div>
            {/* Small Card 3 */}
            <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 shadow-[0_8px_24px_-4px_rgba(7,14,29,0.04)] flex flex-col">
              <span className="material-symbols-outlined text-primary mb-4">groups</span>
              <h3 className="text-xl font-bold tracking-tight">Curated Peer Review</h3>
              <p className="text-on-surface-variant mt-2 text-sm">Learn alongside high-caliber peers and industry-leading mentors.</p>
            </div>
            {/* Small Card 4 */}
            <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between">
              <h3 className="text-xl font-bold tracking-tight">Global Network</h3>
              <div className="flex -space-x-3 mt-4">
                {/* Example avatars, replace with real data if available */}
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/54.jpg" alt="User 3" />
                <span className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold border-2 border-white">+99</span>
              </div>
              <p className="mt-4 text-sm">Join a global community of learners and educators.</p>
            </div>
          </div>
        </section>
      </main>
      <style jsx>{`
        .glass-header {
          background: rgba(249, 249, 255, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
