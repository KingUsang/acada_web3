import React from "react";

export default function QuestionBuilderPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 font-body">
      {/* Top Navigation */}
      <header className="w-full sticky top-0 z-50 bg-surface flex justify-between items-center px-6 py-4 max-w-full">
        <div className="flex items-center gap-3">
          <button className="hover:bg-blue-50 transition-colors p-2 rounded-full active:scale-95 duration-150 text-slate-500">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold tracking-tight text-lg text-primary">
            Add Question
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-slate-500 px-3 py-1 bg-surface-container-low rounded-full">
            Step 3 of 5
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-white shadow-sm">
            <img
              className="w-full h-full object-cover"
              alt="Educator avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0KO1IGo9phPrymsROaTQ_nSJYrn0I7eIn6IAiBmKiV8HYh1NhdDb2N0nKvCW41Pshf_Lg0Z10Jaxy4JClCtloqSd7E8O2IiNCMHlBk0188Hbh70LDBZDMqVvkGu5IQl7Bxbet62tlwcbpzGvBJgm1yaNwo2PmwUqtKLSIJurC95yX69TLwPrf5dBmyaANhtvFBi3zS1EeYqu5dG7LmxpC7HokNPRG6rHgkP-6d8v4WoIkF-zoFfEySs59O-wbpyjWED1OkUGYeA"
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Editorial Section Header */}
          <section>
            <h2 className="text-3xl font-extrabold tracking-tighter text-on-surface mb-2">
              Compose Your Question
            </h2>
            <p className="text-on-surface-variant font-medium opacity-80 leading-relaxed">
              Define the prompt and potential answers for your students. Precision is the key to
              effective assessment.
            </p>
          </section>

          {/* Input Section: Question Text */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                Question Prompt
              </label>
              <span className="font-label text-[10px] text-on-surface-variant">0/500 characters</span>
            </div>
            <div className="relative group">
              <textarea
                className="w-full bg-surface-container-low border-none rounded-xl p-5 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-lg font-semibold placeholder:text-on-surface-variant/40 placeholder:font-normal"
                placeholder="Enter the core question here..."
                rows={4}
              ></textarea>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 bg-surface-container-lowest rounded-lg text-on-surface-variant hover:text-primary transition-colors active:scale-90">
                  <span className="material-symbols-outlined text-[20px]">image</span>
                </button>
                <button className="p-2 bg-surface-container-lowest rounded-lg text-on-surface-variant hover:text-primary transition-colors active:scale-90">
                  <span className="material-symbols-outlined text-[20px]">functions</span>
                </button>
              </div>
            </div>
          </section>

          {/* Answer Options Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                Answer Options
              </label>
              <span className="font-label text-[10px] text-on-surface-variant">
                Select the correct one
              </span>
            </div>

            {/* Answer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((letter) => (
                <div key={letter} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-label font-bold text-primary opacity-50 group-focus-within:opacity-100">
                    {letter}
                  </div>
                  <input
                    className="w-full pl-10 pr-12 py-5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none font-medium placeholder:text-on-surface-variant/40"
                    placeholder={`Option ${letter}`}
                    type="text"
                  />
                  <label className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                    <input className="hidden peer" name="correct_answer" type="radio" />
                    <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-white hidden peer-checked:block">
                        check
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Advanced Settings Section */}
          <section className="bg-surface-container-low p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <div>
                  <h4 className="font-bold text-sm">Explanation (Optional)</h4>
                  <p className="text-xs text-on-surface-variant">Shown after the student answers.</p>
                </div>
              </div>
              <button className="text-primary hover:text-primary-dim transition-colors">
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface-container-lowest/80 backdrop-blur-xl z-50 shadow-[0_-4px_32px_rgba(7,14,29,0.04)]">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="flex-1 bg-linear-to-br from-primary to-primary-dim text-on-primary font-bold py-5 rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
            <span>Add to Quiz</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <button className="p-5 bg-surface-container-high text-on-surface rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95">
            <span className="material-symbols-outlined">delete_outline</span>
          </button>
        </div>
      </div>
    </div>
  );
}
