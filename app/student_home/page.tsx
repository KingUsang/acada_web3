import React from "react";

export default function StudentHomePage() {
  return (
    <div className="bg-background text-on-surface min-h-screen font-body">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-low shadow-none flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary active:scale-95 duration-200 cursor-pointer">
            menu
          </span>
          <h1 className="text-xl font-black text-primary tracking-tighter font-headline">Acada</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container">
          <img
            alt="Student Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwWXB0-lRQMpUMnwnboX1hC7-stYxccg5VuIFEzoCc7r7bMQhH_CNkD-nVWKsfMbmhGeY6Ml1qwPs9T-OkEt8fWHC12VTULGhlxU_u0YJ-W4QxMWgtSqns94d8S35l-nvHS_AhgtX-rftdbSwOX2Do8kZhoBNmPzh1BLSs1JJpNRt2zVEMMDElwkGE2cjTUm_1fMSBxr6Bkd3_czUSy92wjDANXhZEAFgAyuvwCOUqSgSqtnAn1lgAfPUeOd7OapEIsU9jXMFw"
          />
        </div>
      </header>

      <main className="px-6 pt-4 pb-24 space-y-8 max-w-2xl mx-auto">
        {/* Welcome & Progress Summary */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Academic Overview
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">Hi, Alex</h2>
            </div>
            <div className="bg-primary-container px-3 py-1 rounded-full">
              <span className="font-label text-[10px] font-bold text-on-primary-container tracking-widest">
                RANK: A+
              </span>
            </div>
          </div>
          {/* Bento Progress Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between aspect-square shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
              <div>
                <div className="text-3xl font-extrabold font-headline">84%</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Overall Progress
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Credits
                </div>
                <div className="font-headline font-bold text-lg">124</div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  GPA
                </div>
                <div className="font-headline font-bold text-lg">3.9</div>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg tracking-tight">Continue Learning</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
            {/* Course Card 1 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm">
              <div className="h-32 relative">
                <img
                  alt="Quantum Physics"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRIftb3BIibhgKEdv9RRGgnHD_qk2Pf9PaOC7PufqXEJ4CuArql9AHL7W4LTH92oFb3w4HMxqggpF6shb_R_t6UcXpvEnaNvQY25_yDNSw68QT1pVZGzcHH9deI6vNNCXLa5DG5jwNA08Vb0IWLFgt56CXICPZyR2tBAtVvJYzKxgMU1STUJUnhyxMs27r8rfO9gvNrwof_QymkuiipWTfbf1D26TqpXBDgS5JuKs396n1RgxJPx3lj1QU7a99YwdFF6X7P6xM3A"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent"></div>
                <span className="absolute bottom-3 left-3 font-label text-[10px] text-on-primary bg-primary px-2 py-0.5 rounded">
                  WEEK 08
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-headline font-bold leading-tight">
                  Advanced Quantum Mechanics
                </h4>
                <div className="w-full bg-surface-container-high h-1.5 rounded-sm overflow-hidden">
                  <div className="bg-primary h-full w-[65%]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-[10px] text-on-surface-variant">
                    65% COMPLETED
                  </span>
                  <span className="material-symbols-outlined text-primary text-xl cursor-pointer">
                    play_circle
                  </span>
                </div>
              </div>
            </div>
            {/* Course Card 2 */}
            <div className="min-w-[280px] bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="h-32 relative">
                <img
                  alt="Data Structures"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqzSnLMl3f5t2HZGAiCdGW3bX5FsFs0IQmHZQrsb0h4cm2HnmPa65x2VZik2U25FYPhZwUyoq5lK-1suqI97FyuWKX-bNByrB_2SbFScO9Pj4ABMtxl24nVGxrPT4CidnKzveT011aL9RniNd0BjH97dOJfPXytRK20Qih9m6PBFzZnSM77uhAMM0Hu6bNDczHmdrAhMbbyL2tvVDLQFffLWqA9PaaCngcUe8OFX8YgwKwru4UiAdN1uZuII1uc2dR2IioPVjKlQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent"></div>
                <span className="absolute bottom-3 left-3 font-label text-[10px] text-on-primary bg-primary px-2 py-0.5 rounded">
                  WEEK 04
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-headline font-bold leading-tight">
                  Data Structures & Algorithms
                </h4>
                <div className="w-full bg-surface-container-high h-1.5 rounded-sm overflow-hidden">
                  <div className="bg-primary h-full w-[42%]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-[10px] text-on-surface-variant">
                    42% COMPLETED
                  </span>
                  <span className="material-symbols-outlined text-primary text-xl cursor-pointer">
                    play_circle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg tracking-tight">Today&apos;s Schedule</h3>
            <span className="font-label text-[10px] text-primary font-bold uppercase tracking-widest cursor-pointer">
              View All
            </span>
          </div>
          <div className="space-y-3">
            {/* Class Row 1 */}
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl shadow-sm">
              <div className="flex flex-col items-center justify-center bg-surface-container-lowest w-14 h-14 rounded-lg shadow-sm">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  10:00
                </span>
                <span className="font-headline font-bold">AM</span>
              </div>
              <div className="flex-1">
                <h5 className="font-headline font-bold text-sm">Linear Algebra Lecture</h5>
                <p className="text-xs text-on-surface-variant">Room 402 • Prof. Sarah Jenkins</p>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
            {/* Class Row 2 */}
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl shadow-sm">
              <div className="flex flex-col items-center justify-center bg-surface-container-lowest w-14 h-14 rounded-lg shadow-sm">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  02:30
                </span>
                <span className="font-headline font-bold">PM</span>
              </div>
              <div className="flex-1">
                <h5 className="font-headline font-bold text-sm">UI/UX Design Studio</h5>
                <p className="text-xs text-on-surface-variant">Digital Lab 1 • Interactive Workshop</p>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Pending Quizzes */}
        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg tracking-tight">Pending Quizzes</h3>
          <div className="bg-inverse-surface p-6 rounded-xl relative overflow-hidden shadow-lg">
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-label text-[10px] text-primary-container uppercase tracking-widest">
                    Ends in 2h 45m
                  </span>
                  <h4 className="text-on-primary font-headline font-bold text-lg">
                    Statistical Inference Quiz
                  </h4>
                </div>
                <span className="material-symbols-outlined text-primary-container">
                  assignment_late
                </span>
              </div>
              <button className="w-full bg-primary text-on-primary font-label text-xs font-bold py-3 rounded-full uppercase tracking-widest active:scale-95 transition-transform shadow-md">
                Start Quiz Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-white/80 dark:bg-[#070e1d]/80 backdrop-blur-xl shadow-[0_-4px_32px_rgba(7,14,29,0.04)] flex justify-around items-center h-16 px-4 max-w-2xl mx-auto left-1/2 -translate-x-1/2">
        <button className="flex flex-col items-center justify-center text-primary after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary transition-colors">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Learn</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Credentials</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Search</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Profile</span>
        </button>
      </nav>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
