"use client";

import React from "react";

export default function ClassRecordingsLibraryPage() {
  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <span className="text-2xl font-black tracking-tighter text-blue-600">Class Recordings</span>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
            Your Recorded Classes
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Access and review all your past class recordings in one place. Organized, searchable, and always available.
          </p>
        </section>
        {/* Placeholder for recordings grid/list */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
            <h2 className="font-headline text-2xl font-bold mb-2">Sample Recording</h2>
            <p className="text-on-surface-variant">Recording details and playback controls will appear here.</p>
          </div>
        </section>
      </main>
      <style jsx>{`
        .glass-header {
          background: rgba(249, 249, 255, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
