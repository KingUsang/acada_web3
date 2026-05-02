import React from "react";

export default function QuizBuilderPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen font-body">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(7,14,29,0.04)]">
        <div className="flex items-center justify-between px-6 h-16 w-full">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100/50 transition-colors active:scale-95 duration-200 rounded-full">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <h1 className="text-xl font-extrabold tracking-tighter text-primary font-headline">
              Acada
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100/50 transition-colors active:scale-95 duration-200 rounded-full">
              <span className="material-symbols-outlined text-slate-500">search</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
              <img
                alt="User profile avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1um3jGRFJgBbewqZsvZDT0lyTCv0tXoBo58jA5BYe_eUAHsI1YM9UZ9kGV3e-O4wvD2NsRzPW2XAiRRvCj77CfbLcQRnBmjGWigJ4g0om7HTyahanVROU7VSiiKI_9XxgpaZMqEwvFoD5IrVc53dU_OdAwOMaGnwvjMKKnqwAzLVviLICRfSSC3I8H9DgBYTJgC-VAzXD57sbyy2t9b4mA-fdxsYL8UZg3W5Amq7dJbA7_p_DQj8RBGXUcFFnbH_r2rjyOq-Gaw"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <span className="font-label text-[12px] uppercase tracking-widest font-bold text-primary mb-2 block">
            Tutor Dashboard
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline mb-2">
            Create New Quiz
          </h2>
          <p className="text-on-surface-variant text-lg">
            Define your assessment parameters below.
          </p>
        </div>

        {/* Quiz Builder Form */}
        <div className="space-y-10">
          {/* Basic Information Group */}
          <section className="space-y-6">
            <div className="space-y-1">
              <label className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                Quiz Title
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline-variant focus:ring-0 focus:bg-surface-container-highest transition-all duration-200"
                placeholder="e.g. Advanced Macroeconomics Final"
                type="text"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                Description
              </label>
              <textarea
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline-variant focus:ring-0 focus:bg-surface-container-highest transition-all duration-200 resize-none"
                placeholder="Describe the topics covered in this quiz..."
                rows={4}
              ></textarea>
            </div>
          </section>

          {/* Configuration Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Limit */}
            <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">timer</span>
                <label className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                  Time Limit
                </label>
              </div>
              <div className="flex items-center bg-surface-container-lowest rounded-lg p-1">
                <input
                  className="w-full bg-transparent border-none text-center font-bold text-2xl text-on-surface focus:ring-0"
                  type="number"
                  defaultValue={45}
                />
                <span className="pr-4 font-label text-sm text-outline font-bold">MINS</span>
              </div>
            </div>

            {/* Number of Attempts */}
            <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">refresh</span>
                <label className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                  Max Attempts
                </label>
              </div>
              <select className="w-full bg-surface-container-lowest border-none rounded-lg py-3 px-4 font-label font-bold text-on-surface focus:ring-0">
                <option>1 Attempt</option>
                <option>2 Attempts</option>
                <option selected>3 Attempts</option>
                <option>Unlimited</option>
              </select>
            </div>

            {/* Passing Score Full Width */}
            <div className="bg-surface-container-low p-6 rounded-xl md:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <label className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                    Passing Score
                  </label>
                </div>
                <span className="font-label text-xl font-bold text-primary">75%</span>
              </div>
              <div className="relative w-full h-2 bg-surface-container-highest rounded-full flex items-center">
                <div
                  className="absolute h-full bg-primary rounded-full"
                  style={{ width: "75%" }}
                ></div>
                <div
                  className="absolute w-6 h-6 bg-primary border-4 border-surface-container-lowest rounded-full shadow-lg"
                  style={{ left: "75%", transform: "translateX(-50%)" }}
                ></div>
              </div>
              <div className="flex justify-between font-label text-[10px] text-outline font-bold uppercase tracking-tighter">
                <span>Min: 40%</span>
                <span>Avg: 70%</span>
                <span>Expert: 90%</span>
              </div>
            </div>
          </section>

          {/* Metadata Pills */}
          <section className="flex flex-wrap gap-3 py-4">
            <button className="px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">label</span>
              ECONOMICS
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label text-xs font-bold flex items-center gap-2 hover:bg-surface-container-highest transition-all">
              <span className="material-symbols-outlined text-[16px]">add</span>
              ADD TAG
            </button>
          </section>
        </div>
      </main>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary py-5 rounded-xl font-bold text-lg shadow-[0_16px_32px_-8px_rgba(0,83,219,0.3)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">add_circle</span>
            Add Questions
          </button>
        </div>
      </div>
    </div>
  );
}

