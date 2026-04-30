"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCourse } from "../../lib/api";

function CourseDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: courseData, error, isLoading } = useCourse(id || "");

  const course = courseData?.data;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-12 w-3/4 bg-surface-container-high rounded mb-4"></div>
        <div className="h-4 w-full bg-surface-container-low rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-surface-container-low rounded mb-8"></div>
        <div className="h-12 w-32 bg-primary/20 rounded"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-destructive">Course not found</h1>
        <Link href="/student_home" className="text-primary hover:underline mt-4 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <section className="mb-12">
        <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
          {course.title}
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
          {course.description || "No description provided."}
        </p>
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-surface-container-high px-4 py-2 rounded-lg">
            <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest block">Price</span>
            <span className="text-xl font-bold text-primary">${course.price_usdc} USDC</span>
          </div>
          <div className="bg-surface-container-high px-4 py-2 rounded-lg">
            <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest block">Duration</span>
            <span className="text-xl font-bold">{course.duration || "Self-paced"}</span>
          </div>
        </div>
        <Link href={`/course_checkout?id=${course.id}`} className="inline-block bg-primary text-on-primary font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-primary-dim transition-all">
          Enroll Now
        </Link>
      </section>
      {/* Course Modules */}
      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
        <h2 className="font-headline text-2xl font-bold mb-6">Course Content</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-4">
            {course.lessons.map((lesson: any, index: number) => (
              <div key={lesson.id} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">{lesson.title}</h4>
                  <span className="text-xs text-on-surface-variant uppercase">{lesson.type}</span>
                </div>
                <span className="material-symbols-outlined text-outline">lock</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant italic">No lessons listed for this course yet.</p>
        )}
      </section>
    </main>
  );
}

export default function CourseDetailStudentPage() {
  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <Link href="/student_home">
          <span className="text-2xl font-black tracking-tighter text-blue-600">Course Detail</span>
        </Link>
      </header>
      <Suspense fallback={<div className="p-10 text-center">Loading course...</div>}>
        <CourseDetailContent />
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
