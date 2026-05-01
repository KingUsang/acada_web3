"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCourse } from "../../lib/api";

function EnrolmentConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tx = searchParams.get("tx");
  const { data: courseData, error, isLoading } = useCourse(id || "");
  const course = courseData?.data;

  if (!id) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rounded-xl bg-destructive/10 text-destructive p-6">
          Missing course id. Please return to checkout and try again.
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="h-48 rounded-xl bg-surface-container-low animate-pulse"></div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rounded-xl bg-destructive/10 text-destructive p-6">
          Failed to load course details for this enrolment.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <section className="mb-12">
        <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
          Enrolment Successful
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Your access is now active for <strong>{course.title}</strong>.
        </p>
      </section>
      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl space-y-5">
        <h2 className="font-headline text-2xl font-bold">Course Details</h2>
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Course</p>
          <p className="text-xl font-bold">{course.title}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Description</p>
          <p className="text-on-surface-variant">{course.description || "No description provided."}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-surface-container-low px-4 py-3 rounded-lg">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Price Paid</p>
            <p className="font-bold">${course.price_usdc} USDC</p>
          </div>
          {tx ? (
            <div className="bg-surface-container-low px-4 py-3 rounded-lg">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Transaction Ref</p>
              <p className="font-bold break-all">{tx}</p>
            </div>
          ) : null}
        </div>
        <div className="pt-2">
          <Link
            href={`/course_detail_student?id=${course.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-primary text-on-primary font-bold py-3 px-6"
          >
            Open Course
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function EnrolmentConfirmationPage() {
  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <span className="text-2xl font-black tracking-tighter text-blue-600">Enrolment Confirmation</span>
      </header>
      <Suspense fallback={<main className="max-w-3xl mx-auto px-6 py-16">Loading enrolment...</main>}>
        <EnrolmentConfirmationContent />
      </Suspense>
      <style jsx>{`
        .glass-header {
          background: rgba(249, 249, 255, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
