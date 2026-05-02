"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EnrolmentConfirmationPage() {
  const searchParams = useSearchParams();
  const queryCourseId = searchParams.get("course_id");
  const storedCourseId =
    typeof window !== "undefined" ? window.sessionStorage.getItem("last_enrolled_course_id") : null;
  const courseId = queryCourseId || storedCourseId;
  const courseHref = courseId ? `/course_detail_student?id=${courseId}` : "/student_home";

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
          <p className="text-on-surface-variant">You now have access to your course and can start learning immediately.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={courseHref}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-on-primary font-bold"
            >
              Go to Course
            </Link>
            <Link
              href="/student_home"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-outline-variant font-bold"
            >
              View My Learning
            </Link>
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
