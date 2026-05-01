import React from "react";

export default function EnrolmentConfirmationPage() {
  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <span className="text-2xl font-black tracking-tighter text-blue-600">Enrolment Confirmation</span>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
            Enrolment Successful
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Your enrolment has been confirmed. Details about your course access will appear here.
          </p>
        </section>
        {/* Placeholder for enrolment confirmation details */}
        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
          <h2 className="font-headline text-2xl font-bold mb-2">Course Details</h2>
          <p className="text-on-surface-variant">Information about the enrolled course will appear here.</p>
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
