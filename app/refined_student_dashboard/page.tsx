import React from "react";

export default function RefinedStudentDashboardPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-outline">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary active:scale-95 duration-200 cursor-pointer">
            menu
          </span>
          <h1 className="text-xl font-black text-primary tracking-tighter font-headline">Acada</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            alt="Student Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwWXB0-lRQMpUMnwnboX1hC7-stYxccg5VuIFEzoCc7r7bMQhH_CNkD-nVWKsfMbmhGeY6Ml1qwPs9T-OkEt8fWHC12VTULGhlxU_u0YJ-W4QxMWgtSqns94d8S35l-nvHS_AhgtX-rftdbSwOX2Do8kZhoBNmPzh1BLSs1JJpNRt2zVEMMDElwkGE2cjTUm_1fMSBxr6Bkd3_czUSy92wjDANXhZEAFgAyuvwCOUqSgSqtnAn1lgAfPUeOd7OapEIsU9jXMFw"
          />
        </div>
      </header>

      <main className="px-6 pt-6 pb-24 space-y-8 max-w-2xl mx-auto">
        {/* Welcome & Progress Summary */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                Academic Overview
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">Hi, Alex</h2>
            </div>
            <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <span className="font-label text-[10px] font-bold text-primary tracking-widest">
                RANK: A+
              </span>
            </div>
          </div>
          {/* Enhanced Progress Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1 bg-white border border-outline p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
              <span
                className="material-symbols-outlined text-primary text-2xl relative z-10"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <div className="relative z-10">
                <div className="text-4xl font-black font-headline text-on-surface leading-none">
                  84%
                </div>
                <div className="font-label text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mt-1">
                  Overall Progress
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-3">
              <div className="bg-white border border-outline p-4 rounded-2xl flex flex-col justify-center shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Credits
                </div>
                <div className="font-headline font-black text-xl text-on-surface">124</div>
              </div>
              <div className="bg-white border border-outline p-4 rounded-2xl flex flex-col justify-center shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  GPA
                </div>
                <div className="font-headline font-black text-xl text-on-surface">3.9</div>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg tracking-tight">Continue Learning</h3>
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-6 px-6 no-scrollbar">
            {/* Course Card 1 */}
            <div className="min-w-[260px] bg-white border border-outline rounded-2xl overflow-hidden shadow-sm">
              <div className="h-28 relative">
                <img
                  alt="Quantum Physics"
                  className="w-full h-full object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRIftb3BIibhgKEdv9RRGgnHD_qk2Pf9PaOC7PufqXEJ4CuArql9AHL7W4LTH92oFb3w4HMxqggpF6shb_R_t6UcXpvEnaNvQY25_yDNSw68QT1pVZGzcHH9deI6vNNCXLa5DG5jwNA08Vb0IWLFgt56CXICPZyR2tBAtVvJYzKxgMU1STUJUnhyxMs27r8rfO9gvNrwof_QymkuiipWTfbf1D26TqpXBDgS5JuKs396n1RgxJPx3lj1QU7a99YwdFF6X7P6xM3A"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                <span className="absolute top-3 right-3 font-label text-[9px] font-bold text-white bg-on-surface/80 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Week 08
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-headline font-bold text-sm leading-tight text-on-surface">
                  Advanced Quantum Mechanics
                </h4>
                <div className="space-y-1.5">
                  <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[65%]"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                      65% Completed
                    </span>
                    <button className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-primary/20">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Course Card 2 */}
            <div className="min-w-[260px] bg-white border border-outline rounded-2xl overflow-hidden shadow-sm">
              <div className="h-28 relative">
                <img
                  alt="Data Structures"
                  className="w-full h-full object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqzSnLMl3f5t2HZGAiCdGW3bX5FsFs0IQmHZQrsb0h4cm2HnmPa65x2VZik2U25FYPhZwUyoq5lK-1suqI97FyuWKX-bNByrB_2SbFScO9Pj4ABMtxl24nVGxrPT4CidnKzveT011aL9RniNd0BjH97dOJfPXytRK20Qih9m6PBFzZnSM77uhAMM0Hu6bNDczHmdrAhMbbyL2tvVDLQFffLWqA9PaaCngcUe8OFX8YgwKwru4UiAdN1uZuII1uc2dR2IioPVjKlQ"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                <span className="absolute top-3 right-3 font-label text-[9px] font-bold text-white bg-on-surface/80 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Week 04
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-headline font-bold text-sm leading-tight text-on-surface">
                  Data Structures & Algorithms
                </h4>
                <div className="space-y-1.5">
                  <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[42%]"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                      42% Completed
                    </span>
                    <button className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-primary/20">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compact Schedule */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg tracking-tight">Today&apos;s Schedule</h3>
            <button className="font-label text-[10px] text-primary font-black uppercase tracking-widest">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {/* Class Row 1 */}
            <div className="flex items-center gap-4 bg-white border border-outline p-3 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center justify-center bg-surface-variant w-12 h-12 rounded-xl shrink-0">
                <span className="font-label text-[9px] font-bold text-on-surface-variant leading-none">
                  10:00
                </span>
                <span className="font-headline font-black text-sm text-on-surface">AM</span>
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-headline font-bold text-sm truncate text-on-surface">
                  Linear Algebra Lecture
                </h5>
                <p className="text-[11px] text-on-surface-variant truncate">
                  Room 402 • Prof. Jenkins
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">
                chevron_right
              </span>
            </div>
            {/* Class Row 2 */}
            <div className="flex items-center gap-4 bg-white border border-outline p-3 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center justify-center bg-surface-variant w-12 h-12 rounded-xl shrink-0">
                <span className="font-label text-[9px] font-bold text-on-surface-variant leading-none">
                  02:30
                </span>
                <span className="font-headline font-black text-sm text-on-surface">PM</span>
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-headline font-bold text-sm truncate text-on-surface">
                  UI/UX Design Studio
                </h5>
                <p className="text-[11px] text-on-surface-variant truncate">Lab 1 • Workshop</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">
                chevron_right
              </span>
            </div>
          </div>
        </section>

        {/* Urgent Quizzes */}
        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg tracking-tight">Pending Quizzes</h3>
          <div className="bg-on-surface p-6 rounded-2xl relative overflow-hidden shadow-xl shadow-on-surface/10">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                    <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                      Ends in 2h 45m
                    </span>
                  </div>
                  <h4 className="text-white font-headline font-bold text-lg">
                    Statistical Inference Quiz
                  </h4>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    assignment_late
                  </span>
                </div>
              </div>
              <button className="w-full bg-primary text-white font-label text-[10px] font-black py-4 rounded-xl uppercase tracking-[0.25em] active:scale-[0.98] transition-all shadow-lg shadow-primary/30">
                Start Quiz Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-white/80 backdrop-blur-xl border-t border-outline flex justify-around items-center h-20 px-6 max-w-2xl mx-auto left-1/2 -translate-x-1/2">
        <button className="flex flex-col items-center justify-center text-primary group">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Learn
          </span>
          <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-2xl">verified_user</span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Credentials
          </span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-2xl">search</span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Search
          </span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Profile
          </span>
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
