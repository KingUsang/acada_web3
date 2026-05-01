import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth/context";

export default function WalletConnectionPage() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectPhantom = async () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="bg-background min-h-screen font-body text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 bg-surface-container-low/80 backdrop-blur-xl shadow-[0_4px_16px_rgba(7,14,29,0.04)]">
        <Link href="/student_home" className="material-symbols-outlined text-primary text-2xl active:scale-95">
          arrow_back
        </Link>
        <span className="font-headline font-bold text-on-surface">Acada</span>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-primary-container">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src={user?.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuD_H4UmM_92IJKrQdfw24pccczcx5JEp4iuBrkW5l0SZNjLiXM4ZVdQPnWaziT7D0AmHsGVCQoW8Z6YiegRA8Q_jXfTptMiQjNUA0xYkrY0hKCFv_FXDkaA9vdWmfzxNX17RS1Nr9Z-j-16Z2Ax0rfGVggRrg3SXkyF9oAARZTMF5Al1OEa2XwSdEiJe1QO5cRwB4JSGfqPC_89JStJZWCsD6gEfuOop2CFGZeDu7MKnluAFuolbfXGQThlOG3lpsszyUH-qL-e5A"}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pt-6 pb-24">
        {/* Hero Context */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-inverse-surface mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Unlock your on-chain credentials. We use blockchain technology to issue immutable
            certificates for every course you master.
          </p>
        </div>

        {/* Main Interaction Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {/* Left: Connection States */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* State: Disconnected */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="font-label text-xs uppercase tracking-widest text-primary mb-2 block font-bold">
                    Step 01
                  </span>
                  <h2 className="text-2xl font-bold text-inverse-surface">Select Provider</h2>
                </div>
                <span className="material-symbols-outlined text-primary-dim text-3xl">
                  account_balance_wallet
                </span>
              </div>
              <button className="w-full bg-linear-to-br from-primary to-primary-dim text-on-primary py-4 px-6 rounded-full font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,83,219,0.2)]">
                <img
                  alt="Phantom"
                  className="w-6 h-6 rounded-md bg-surface-container-lowest p-1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZy2Jc8nnsbPKfVehCvslQXu0pSo5FrNpkfWojfHp8iy8URdIgQScxWWFW0xjgmC0WR7wGjjMMjH6mEKO7JCsXLbZfEvKJwmmT7GwP5Y05l8xQElppP4QMe6sQczmDANYTJtk9WSHNdp6bdCQQxEvqVN7n0l_e44tWWeBX4kmYHiHF5snGokdXtTGdraGCcqSRlBGnrIlbypRi4GwM02Ym5e8UQtNgkfs3V8vwTabnZxbD2nSoPBOgyOFe4M0FcQqLhYE9-l5BMw"
                />
                <span>Connect Phantom Wallet</span>
              </button>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm font-label text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Solana Mainnet
                </span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span className="hover:text-primary cursor-pointer transition-colors font-bold uppercase tracking-widest text-xs">
                  Other Wallets
                </span>
              </div>
            </div>

            {/* State: Connected (Mock) */}
            <div className="bg-surface-container-low p-6 rounded-xl border-2 border-dashed border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-emerald-600"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="grow">
                  <p className="text-xs font-label text-secondary uppercase tracking-tighter font-bold">
                    Verified Connection
                  </p>
                  <p className="font-label text-lg font-bold text-inverse-surface tracking-widest">
                    0x123...abc
                  </p>
                </div>
                <button className="text-on-surface-variant hover:text-error transition-colors p-2">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Information & Context */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Info Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-primary mb-4 block">
                verified_user
              </span>
              <h3 className="font-bold text-inverse-surface mb-2">Why a Wallet?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Acada certificates are minted as soul-bound tokens. Your wallet acts as your digital
                academic transcript that you truly own.
              </p>
            </div>
            {/* Info Card 2 */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-[20px] p-6 rounded-xl shadow-[0_8px_32px_-16px_rgba(7,14,29,0.08)]">
              <span className="material-symbols-outlined text-primary mb-4 block">security</span>
              <h3 className="font-bold text-inverse-surface mb-2">Secure & Private</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We never store your private keys. Connection only allows us to view your public
                address for certificate issuance.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <section className="mt-20 w-full">
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-surface-container-lowest shadow-sm">
              <img
                alt="Certificate"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW3yoiaZ-gHFISZM08DE5g8DKU30ObRF6GDTYim4_N7BIghtuOCT_4SgyYBAAoclr4UEkLHEmxEq7Ia0VDZlwRcdydfhgvhhOLz8inyFpVKC1dcDBy8Jw4hkuxc9Ao4gypBZpgpbiPBOwzagMoQET5wcd46BZbghOYcdN2YYjTtZoqJXPYCEEuU_b4l3z3ILlm8y9zqGueg_8m5WsgbCC3iZnXiZChS814fzo-iMA4VhW6U6wWNjpUY9SymqAMD2cbnBEQrxnUqQ"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h4 className="text-xl font-bold text-inverse-surface mb-3">
                Earn Industry-Recognized NFTs
              </h4>
              <p className="text-on-surface-variant mb-4">
                Upon completion of any Acada track, your certificate is automatically pushed to your
                connected wallet. These are recognized by our partner network of 50+ Web3 companies.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-surface-container-low"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-surface-container-low"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-surface-container-low"></div>
                </div>
                <span className="text-xs font-label text-on-surface-variant self-center font-bold tracking-widest">
                  + 12.4k students certified
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 flex-col items-center py-8 gap-8 bg-surface-container-lowest shadow-[16px_0_32px_-4px_rgba(7,14,29,0.02)]">
        <div className="p-3 rounded-xl text-slate-400 hover:bg-surface-container-low transition-colors cursor-pointer">
          <span className="material-symbols-outlined">home</span>
        </div>
        <div className="p-3 rounded-xl text-slate-400 hover:bg-surface-container-low transition-colors cursor-pointer">
          <span className="material-symbols-outlined">school</span>
        </div>
        <div className="p-3 rounded-xl bg-primary-container text-primary shadow-sm">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
        </div>
        <div className="p-3 rounded-xl text-slate-400 hover:bg-surface-container-low transition-colors cursor-pointer mt-auto">
          <span className="material-symbols-outlined">settings</span>
        </div>
      </div>

    </div>
  );
}
