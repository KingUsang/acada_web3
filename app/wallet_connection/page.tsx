import React from "react";

export default function WalletConnectionPage() {
  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-xl shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-primary">Acada</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
              <img
                alt="User"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpu08dfQDaDBzYyCw3D-j2Mmuy7lCZSZyJ0yJRQRVmBUw7PgXYTBPC4m8kEwYZmDSGieP3VwQKvrp_8wdLxvNLgAQ7xalx6t8CTLkPSMgcP7UajYHucMRuJqoiuBRUb7iIvh6uHY3OgsujfeBVo1x2M5ojXH3hSEWIdMVTzesjBClYs1GjRpj9bBdpXLltzjtgB76HZFtPnZLRMuyXL6PU5ZKMfUgKSGare_obHizB-b_DYd3I8Jp30Mi8fyMx0Ezno5JpCVdl-g"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
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
              <button className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 px-6 rounded-full font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,83,219,0.2)]">
                <img
                  alt="Phantom"
                  className="w-6 h-6 rounded-md bg-white p-1"
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
                <div className="flex-grow">
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
            <div className="bg-surface-container-high/40 backdrop-blur-md p-6 rounded-xl border border-white/50">
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
            <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-white shadow-sm">
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

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-[0_-8px_24px_-4px_rgba(7,14,29,0.04)] z-50 rounded-t-xl md:hidden">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">
            Home
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">school</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">
            Courses
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">
            Wallet
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">
            Profile
          </span>
        </div>
      </nav>
    </div>
  );
}
