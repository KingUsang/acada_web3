import React from "react";

export default function QuizResultPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(7,14,29,0.04)] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">menu</span>
          <h1 className="text-xl font-extrabold tracking-tighter text-primary font-headline">
            Acada
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center">
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAME1BIn0T9UgGFus101_tUOptg6G931SCyNrH6inuh0EHlVbHshxXFmCREFnLfB-H1ZZsGr8PsKXibKw23VIY1GrOgQGxQke0f06kplNFaa1dvl3CsZSIR_zVz1ancGBzBolajH8MByfRsbJFfHGKnxFaIQWqfWHsd6KELK57QE2iEMsOuDcSji5hDlMaWUvAKVSLUhlE6t2od7mE2cwAdYA96rluE_FHyLXl1milKjIn8ekAa4JJoIdr0pmKyazmHH5w8_-m7Mg"
          />
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col items-center text-center mb-10">
          <div className="mb-4 inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full">
            <span
              className="material-symbols-outlined text-primary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="font-label text-xs font-bold tracking-widest text-primary uppercase">
              Quiz Completed
            </span>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                className="text-surface-container-high"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
              ></circle>
              <circle
                className="text-primary"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeDasharray="552.92"
                strokeDashoffset="82.93"
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-headline font-extrabold tracking-tighter text-on-surface">
                85%
              </span>
              <span className="font-label text-xs text-on-surface-variant tracking-widest uppercase">
                Final Score
              </span>
            </div>
          </div>

          <div className="bg-inverse-surface text-inverse-on-surface px-8 py-2 rounded-full font-label font-bold text-sm tracking-[0.2em] uppercase mb-8">
            Pass
          </div>
        </div>

        <div className="w-full grid grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">task_alt</span>
            <span className="text-xl font-headline font-bold text-on-surface">17/20</span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Correct
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">timer</span>
            <span className="text-xl font-headline font-bold text-on-surface">04:12</span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Time taken
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">emoji_events</span>
            <span className="text-xl font-headline font-bold text-on-surface">#12</span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Global Rank
            </span>
          </div>
        </div>

        <div className="w-full bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-16px_rgba(7,14,29,0.08)] mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Performance Analysis</h3>
            <span className="font-label text-xs text-primary font-bold">EXCELLENT</span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Great job! You&apos;ve demonstrated a strong understanding of{" "}
            <span className="font-bold text-on-surface">
              Digital Assets & Blockchain Governance
            </span>
            . You&apos;re ready to move to the next module.
          </p>
          <div className="flex items-center justify-center">
            <a
              className="inline-flex items-center gap-2 text-primary font-label text-xs font-bold tracking-widest uppercase hover:underline"
              href="#"
            >
              View Detailed Answers
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-auto">
          <button className="w-full h-14 bg-primary text-on-primary font-headline font-bold rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            Continue to Next Lesson
          </button>
          <button className="w-full h-14 bg-surface-container-high text-on-surface font-headline font-bold rounded-xl flex items-center justify-center active:scale-95 transition-transform">
            Retake Quiz
          </button>
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(7,14,29,0.08)] flex justify-around items-center h-20 px-4 z-50">
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-100 transition-all cursor-pointer">
          <span className="material-symbols-outlined">video_library</span>
          <span className="font-label text-[10px] uppercase tracking-widest font-bold">Library</span>
        </div>
        <div className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 relative after:content-[''] after:absolute after:-bottom-2 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full cursor-pointer">
          <span className="material-symbols-outlined">quiz</span>
          <span className="font-label text-[10px] uppercase tracking-widest font-bold">Quiz</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-100 transition-all cursor-pointer">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-label text-[10px] uppercase tracking-widest font-bold">Results</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-100 transition-all cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] uppercase tracking-widest font-bold">Profile</span>
        </div>
      </nav>
    </div>
  );
}
