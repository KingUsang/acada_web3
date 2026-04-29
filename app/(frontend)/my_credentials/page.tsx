import React from "react";

export default function MyCredentialsPage() {
  return (
    <div className="bg-surface select-none min-h-screen font-body text-on-surface">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-surface-container-low shadow-none z-40">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2563EB] active:scale-95 duration-200 cursor-pointer">
              menu
            </span>
            <h1 className="font-headline font-bold tracking-tight text-on-surface text-xl">
              Acada
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center border border-primary-container overflow-hidden">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmHmNgDVvbWJrCyj5nHPoH8NuAa5r3wEFl1f7VzGeguUxR-DcHzs7V5QcB3dYMoelSBFoKgPGbX2fTBBpidMzVJqeuE4y8N8AnnOZeKCKtZinaNBV4V0tdLM_k-zPTfmRdO39e9Aq2Y0kN3z5_FCjBzFpTM9GHYudgZHhlCxXmXtJ38C9gcg87uYaSoz3N88KRfRMYVRvjrTzImBoZIxqjGpUemsqGkRCvFY5yn9L1S0SGHEYmzRBfIAL6_yg6QMs_AwwPKkZ0Lg"
            />
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 pb-24">
        {/* Header Section */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
              My Credentials
            </h2>
            <span className="font-label text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-1">
              8 Total
            </span>
          </div>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Verified achievements and professional certifications earned through the Acada ecosystem.
          </p>
        </section>

        {/* Stats Overview (Asymmetric Bento-ish) */}
        <section className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between h-32">
            <span
              className="material-symbols-outlined text-[#2563EB]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
            <div>
              <div className="text-2xl font-black font-headline tracking-tighter">04</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-secondary">
                Advanced Tiers
              </div>
            </div>
          </div>
          <div className="bg-primary p-4 rounded-xl flex flex-col justify-between h-32 text-on-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <div>
              <div className="text-2xl font-black font-headline tracking-tighter">100%</div>
              <div className="font-label text-[10px] uppercase tracking-widest opacity-80">
                On-Chain Verified
              </div>
            </div>
          </div>
        </section>

        {/* Credentials Grid */}
        <div className="grid gap-4">
          {/* Credential Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(37,99,235,0.04)] active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2563EB] text-2xl">code</span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-container px-3 py-1 rounded-full">
                <span
                  className="material-symbols-outlined text-[#2563EB] text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-label text-[10px] font-bold uppercase text-[#2563EB] tracking-wider">
                  Verified
                </span>
              </div>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface leading-tight mb-1">
              Full-Stack Architecture
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-slate-500 uppercase tracking-widest">
                Issued Oct 2023
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="font-label text-xs text-slate-500 uppercase tracking-widest">
                ID: AC-882
              </span>
            </div>
          </div>

          {/* Credential Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(37,99,235,0.04)] active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2563EB] text-2xl">database</span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-container px-3 py-1 rounded-full">
                <span
                  className="material-symbols-outlined text-[#2563EB] text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-label text-[10px] font-bold uppercase text-[#2563EB] tracking-wider">
                  Verified
                </span>
              </div>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface leading-tight mb-1">
              Data Systems Mastery
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-slate-500 uppercase tracking-widest">
                Issued Aug 2023
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="font-label text-xs text-slate-500 uppercase tracking-widest">
                ID: AC-714
              </span>
            </div>
          </div>

          {/* Credential Card 3 (Editorial Style Variant) */}
          <div className="bg-inverse-surface rounded-xl p-5 active:scale-[0.98] transition-transform relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-white text-6xl">shield</span>
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">security</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#2563EB] px-3 py-1 rounded-full">
                <span
                  className="material-symbols-outlined text-white text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-label text-[10px] font-bold uppercase text-white tracking-wider">
                  Verified
                </span>
              </div>
            </div>
            <h3 className="font-headline font-bold text-lg text-white leading-tight mb-1 relative z-10">
              Cybersecurity Fundamentals
            </h3>
            <div className="flex items-center gap-2 relative z-10">
              <span className="font-label text-xs text-white/60 uppercase tracking-widest">
                Issued Jan 2024
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="font-label text-xs text-white/60 uppercase tracking-widest">
                ID: AC-901
              </span>
            </div>
          </div>

          {/* Credential Card 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(37,99,235,0.04)] active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2563EB] text-2xl">palette</span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-container px-3 py-1 rounded-full">
                <span
                  className="material-symbols-outlined text-[#2563EB] text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-label text-[10px] font-bold uppercase text-[#2563EB] tracking-wider">
                  Verified
                </span>
              </div>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface leading-tight mb-1">
              Visual Design Systems
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-slate-500 uppercase tracking-widest">
                Issued Jun 2023
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="font-label text-xs text-slate-500 uppercase tracking-widest">
                ID: AC-552
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-white/80 dark:bg-[#070e1d]/80 backdrop-blur-xl shadow-[0_-4px_32px_rgba(7,14,29,0.04)]">
        <div className="flex justify-around items-center h-16 px-4 w-full">
          <div className="flex flex-col items-center justify-center text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">school</span>
            <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Learn</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#2563EB] after:content-[''] after:w-1 after:h-1 after:bg-[#2563EB] after:rounded-full after:mt-1 cursor-pointer">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">
              Credentials
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">search</span>
            <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Search</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
