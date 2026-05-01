"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth/context";

export default function LandingPage() {
  const { user, login } = useAuth();

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen">
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
              <span className="material-symbols-outlined text-sm mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
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
              <Link href="/sign_up" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dim active:scale-[0.98] transition-all text-lg">
                Sign Up
              </Link>
              <button 
                onClick={login}
                className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl shadow-sm hover:bg-surface-container-low active:scale-[0.98] transition-all text-lg border border-transparent"
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="w-full max-w-7xl px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Card */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[400px] overflow-hidden relative">
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
              <h3 className="text-xl font-bold font-headline text-white">Wallet Native</h3>
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
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtsyaMSyWRjmhGIep9jK7roFtlbgtgtyT6rus39Zc3AP1ywDREzk-KhVswXenkdxeBxzJw8Iza9hk4cbpTBsRotJz3YwyHXG3HwlRFrsO9LAIHHCh4szspRw78lpPe9ieAtTLoAG1DU1Ost_2Byw8gF60cKM6IkqCvbl8tA-D91llVX-0XjgzZgiZCviMCzrlCynAlGVLrL9NiOhr_UlK86CNpNwdi_xzsr2gTIAgWc4uOaPw9D2frYPNQec5q4WLmlfonP0esOA" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfGGt71lOTXaUazg4l24buMvrq1-8SiCUMafHRLNcr5hG3CPgBHs7twjsCwWcpNxi7vnNSqCQVnZdhyvJZrOr88gJivaHXms7iP50EOyv04WuVuDgYAg65DVRVgPO0Stcym_l5aPsb0gBCuNLtUd1KHB9NF48KYuJtYqcwecvdXm9a0S3coNCVU6H7Ooo2R5glWvAx9wuBEMmdsGxw2Nl8iWRxg6lTY80q7rRhNo36binWM5B9iC_Ejil_EqPch4P-UWUjuoKRXQ" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqC6ejf4tDb15svJYoB7Tr-hjlnhKue9g8l7jlq1BaoaQ3moGOCqbCG3RcXBViYuuqP4Z9-hWmRInpQjOgOsCHJxz1dgBjViqV54vhOLthwNQssGQOHulJO9tvhvcTh-M3YRPAakBmj5CKmdsZi8sgCtfOar2B9RXyhEFSPuqGxOWHsDooSlRbMKkbC_xSudS_criZP2SOkbYnmmbWC-vJx3l_GaLGkU8mV3UYgFF5bd92jOj4_2Z_6Ax6GGiejQHo4b2CwqR03A" alt="" />
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 flex items-center justify-center text-xs font-bold font-label">+12k</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Secondary CTA */}
        <footer className="w-full max-w-7xl px-6 py-20 flex flex-col items-center">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm font-label text-on-surface-variant uppercase tracking-widest font-bold">Ready to take control of your learning?</p>
            <button onClick={login} className="group flex items-center gap-3 px-6 py-3 rounded-full bg-surface-container-lowest border border-primary/10 shadow-sm hover:shadow-md transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary text-xl">wallet</span>
              <span className="font-label font-bold text-primary">Connect Wallet</span>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <p className="text-xs text-slate-400 pt-4">MetaMask, WalletConnect, and Coinbase Wallet supported.</p>
          </div>
        </footer>
      </main>

      {/* BottomNavBar (Only for mobile destinations) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/80 backdrop-blur-lg z-50 rounded-t-xl shadow-[0_-8px_24px_-4px_rgba(7,14,29,0.04)]">
        <Link href="/" className="flex flex-col items-center justify-center text-blue-600 after:content-[''] after:w-1 after:h-1 after:bg-blue-600 after:rounded-full after:mt-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest mt-1">Home</span>
        </Link>
        <Link href="/courses" className="flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
          <span className="material-symbols-outlined">school</span>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest mt-1">Courses</span>
        </Link>
        <button onClick={login} className="flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest mt-1">Wallet</span>
        </button>
        <Link href="/profile" className="flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
