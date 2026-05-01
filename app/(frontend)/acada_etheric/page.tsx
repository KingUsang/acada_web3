import React from "react";

export default function AcadaEthericPage() {
  return (
    <div className="bg-surface min-h-screen font-body text-on-background">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 bg-surface-container-low/80 backdrop-blur-xl shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <span className="text-2xl font-black tracking-tighter text-primary">Acada Etheric</span>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 duration-200">notifications</button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="font-headline font-extrabold text-5xl md:text-7xl tracking-tighter text-inverse-surface mb-4">
            Etheric Learning
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            A curated, decentralized educational experience. Built for the future of learning, powered by Web3 and editorial design.
          </p>
        </section>
        {/* Example Card Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <h2 className="font-headline text-2xl font-bold mb-2">Curated Modules</h2>
            <p className="text-on-surface-variant">Explore handpicked learning modules, each designed for maximum impact and clarity.</p>
          </div>
          <div className="bg-surface-container-highest rounded-xl p-8 shadow-sm backdrop-blur-lg">
            <h2 className="font-headline text-2xl font-bold mb-2">Web3 Credentials</h2>
            <p className="text-on-surface-variant">Earn immutable blockchain certificates and showcase your achievements globally.</p>
          </div>
        </section>
        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-linear-to-br from-primary to-primary-dim text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dim active:scale-[0.98] transition-all text-lg">
            Get Started
          </button>
          <button className="px-8 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl shadow-sm hover:bg-surface-container-low active:scale-[0.98] transition-all text-lg">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
