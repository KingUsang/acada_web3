import React from "react";

export default function ScheduleAClassPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen pb-32 font-body">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">
            close
          </span>
        </div>
        <span className="text-2xl font-black tracking-tighter text-primary">ACADA</span>
        <div className="w-6"></div> {/* Spacer for balance */}
      </nav>

      {/* Main Content Canvas */}
      <main className="mt-16 px-6 pt-8 max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Schedule a Class
          </h1>
          <p className="text-on-surface-variant text-lg mt-2 font-medium opacity-80">
            Define your curriculum and time slots for students.
          </p>
        </header>

        <form className="space-y-6">
          {/* Session Title */}
          <section className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
              Session Title
            </label>
            <div className="bg-surface-container-low rounded-md p-1">
              <input
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="e.g. Advanced Macroeconomics"
                type="text"
              />
            </div>
          </section>

          {/* Date Picker (Inline Calendar View) */}
          <section className="space-y-2">
            <div className="flex justify-between items-end mb-4">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Select Date
              </label>
              <span className="font-label text-sm text-primary font-bold">October 2023</span>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <span key={day} className="font-label text-[10px] text-outline">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Previous month dates */}
                <span className="py-2 text-sm text-outline opacity-40 text-center">26</span>
                <span className="py-2 text-sm text-outline opacity-40 text-center">27</span>
                <span className="py-2 text-sm text-outline opacity-40 text-center">28</span>
                {/* Current month dates */}
                <span className="py-2 text-sm text-on-surface-variant text-center">1</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">2</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">3</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">4</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">5</span>
                {/* Active Date */}
                <span className="py-2 text-sm bg-primary text-on-primary rounded-full font-bold flex items-center justify-center">
                  6
                </span>
                <span className="py-2 text-sm text-on-surface-variant text-center">7</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">8</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">9</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">10</span>
                <span className="py-2 text-sm text-on-surface-variant text-center">11</span>
              </div>
            </div>
          </section>

          {/* Time and Duration Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time Picker */}
            <section className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Start Time
              </label>
              <div className="bg-surface-container-low rounded-md flex items-center px-4 py-3">
                <span className="material-symbols-outlined text-primary text-sm mr-2">schedule</span>
                <input
                  className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold w-full"
                  type="text"
                  defaultValue="09:00 AM"
                />
              </div>
            </section>
            {/* Duration */}
            <section className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Duration
              </label>
              <div className="bg-surface-container-low rounded-md flex items-center px-4 py-3">
                <input
                  className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold w-full"
                  type="text"
                  defaultValue="60 mins"
                />
              </div>
            </section>
          </div>

          {/* Recurring Toggle */}
          <section className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-on-surface">Recurring Session</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Repeat every week at this time</p>
            </div>
            <button
              className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1"
              type="button"
            >
              <div className="bg-on-primary w-4 h-4 rounded-full ml-auto"></div>
            </button>
          </section>

          {/* Additional Detail: Bento Style Card */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="bg-surface-container-highest/30 backdrop-blur-sm p-6 rounded-xl border border-primary/5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lightbulb
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Did you know?</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                    Morning classes see a 24% higher attendance rate on average.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Fixed Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent z-40">
        <button className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-4 rounded-full shadow-[0_12px_24px_-8px_rgba(0,83,219,0.3)] active:scale-95 transition-all text-sm uppercase tracking-widest font-label max-w-md mx-auto block">
          Schedule Session
        </button>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-8 px-4 bg-white/80 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.04)] rounded-t-3xl md:hidden z-50">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1">
          <span className="material-symbols-outlined">import_contacts</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-1">Courses</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-1">Wallet</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>
    </div>
  );
}
