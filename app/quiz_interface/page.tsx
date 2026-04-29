import React from "react";

export default function QuizInterfacePage() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      {/* TopAppBar Fragmented */}
      <header className="w-full sticky top-0 z-50 bg-surface flex justify-between items-center px-6 py-4 max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 duration-150">
            close
          </span>
          <h1 className="font-headline font-bold tracking-tight text-lg text-on-surface">
            Question 4 of 20
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full">
          <span
            className="material-symbols-outlined text-primary text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <span className="font-label text-sm font-bold tracking-wider text-on-primary-fixed-variant">
            14:52
          </span>
        </div>
      </header>

      {/* Linear Progress Bar */}
      <div className="w-full h-1 bg-surface-container">
        <div className="h-full bg-primary w-[20%] transition-all duration-500"></div>
      </div>

      <main className="flex-grow flex flex-col px-6 py-8 max-w-3xl mx-auto w-full">
        {/* Question Section */}
        <section className="mb-12">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 block">
            Advanced Microeconomics
          </span>
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface leading-tight tracking-tight">
            Explain the relationship between the Nash Equilibrium and the concept of Pareto
            Efficiency within a non-cooperative game environment.
          </h2>
        </section>

        {/* Media/Visual Context */}
        <div className="w-full h-48 bg-surface-container-low rounded-xl mb-12 overflow-hidden flex items-center justify-center relative">
          <img
            className="w-full h-full object-cover mix-blend-multiply opacity-40"
            alt="Strategic Interaction Matrix"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUR8MX5IpCRqww3KDBFUIVNyGp7f5CTAoTxqZXQYbV_J5tZ8p4LbnFDGa-W3zg4Smgw_6OYmpJ9_oa7YSA4o_vmOUP0DJknh__y0vAkvWBYA2U4OjB0ctI_mAJZjenF9zInxBjL4UIXk4sLAUBITsVkDu660M0X9p4BlN9Sr_NTSxFWXvlh0Q5sJxpCKlo-nJk5xDUnEsQwjfqw4-6LXdRlEYB3VwzO2J8d-WqAsTRm4tA0Yq6KK6btUVrJpEHvvqUu5RD_4uVFA"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-label text-xs font-bold text-primary-dim uppercase tracking-widest bg-white/60 backdrop-blur-md px-4 py-2 rounded-lg">
              Figure 4.1: Strategic Interaction Matrix
            </span>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-4 mb-24">
          {/* Option A */}
          <label className="group relative flex items-center p-5 bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-high transition-all duration-200 border-2 border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary-container/30">
            <input className="hidden peer" name="quiz-option" type="radio" />
            <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
            </div>
            <span className="ml-4 font-headline font-semibold text-on-surface group-hover:text-primary transition-colors">
              Every Nash Equilibrium is necessarily Pareto Efficient in competitive markets.
            </span>
          </label>

          {/* Option B (Selected State) */}
          <label className="group relative flex items-center p-5 bg-primary-container/30 rounded-xl cursor-pointer transition-all duration-200 border-2 border-primary/20">
            <input defaultChecked className="hidden peer" name="quiz-option" type="radio" />
            <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center transition-colors">
              <div className="w-2 h-2 rounded-full bg-white opacity-100"></div>
            </div>
            <span className="ml-4 font-headline font-semibold text-on-primary-container">
              A Nash Equilibrium is not guaranteed to be Pareto Efficient, as seen in the Prisoner's
              Dilemma.
            </span>
          </label>

          {/* Option C */}
          <label className="group relative flex items-center p-5 bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-high transition-all duration-200 border-2 border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary-container/30">
            <input className="hidden peer" name="quiz-option" type="radio" />
            <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
            </div>
            <span className="ml-4 font-headline font-semibold text-on-surface group-hover:text-primary transition-colors">
              Nash Equilibrium only exists when Pareto Efficiency is achieved through side payments.
            </span>
          </label>

          {/* Option D */}
          <label className="group relative flex items-center p-5 bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-high transition-all duration-200 border-2 border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary-container/30">
            <input className="hidden peer" name="quiz-option" type="radio" />
            <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
            </div>
            <span className="ml-4 font-headline font-semibold text-on-surface group-hover:text-primary transition-colors">
              Pareto Efficiency is a prerequisite for reaching any stable Nash strategy.
            </span>
          </label>
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-[#070e1d]/80 backdrop-blur-xl border-t border-blue-100/10 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
          <button className="flex items-center gap-2 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">flag</span>
            Report
          </button>
          <button className="flex-grow md:flex-grow-0 md:min-w-[200px] bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 px-8 rounded-full font-headline font-bold text-lg shadow-[0_8px_24px_rgba(0,83,219,0.25)] active:scale-95 transition-all">
            Next Question
          </button>
        </div>
      </footer>
    </div>
  );
}
