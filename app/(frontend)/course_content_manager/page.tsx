"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "../../lib/auth/context";
import { useCourses } from "../../lib/api";

export default function CourseContentManagerPage() {
  const { appUser, userId } = useAuth();
  const { data, isLoading, error } = useCourses();

  const tutorCourses = useMemo(() => {
    const courses = data?.data ?? [];
    if (!userId) return [];
    if (appUser?.role === "ORG_ADMIN") return courses;
    return courses.filter((course) =>
      course.course_tutors?.some((tutor) => tutor.tutor_id === userId)
    );
  }, [appUser?.role, data?.data, userId]);

  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <span className="text-2xl font-black tracking-tighter text-blue-600">
          Course Content Manager
        </span>
        <Link
          href="/create_course"
          className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-lg bg-primary text-white"
        >
          Create Course
        </Link>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
            Manage Your Course Content
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Organize, update, and publish your course materials with ease.
          </p>
        </section>

        {error ? (
          <section className="bg-destructive/10 text-destructive rounded-xl p-6">
            Failed to load course data. Please refresh and try again.
          </section>
        ) : isLoading ? (
          <section className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 bg-surface-container-low rounded-xl animate-pulse"
              />
            ))}
          </section>
        ) : tutorCourses.length === 0 ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
            <h2 className="font-headline text-2xl font-bold mb-2">No Courses Yet</h2>
            <p className="text-on-surface-variant mb-6">
              You do not have any tutor-assigned courses yet.
            </p>
            <Link
              href="/create_course"
              className="inline-flex px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold tracking-widest uppercase"
            >
              Create Your First Course
            </Link>
          </section>
        ) : (
          <section className="space-y-4">
            {tutorCourses.map((course) => (
              <article
                key={course.id}
                className="bg-surface-container-lowest rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="font-headline text-2xl font-bold text-inverse-surface">
                      {course.title}
                    </h2>
                    <p className="text-on-surface-variant text-sm">
                      {course.description || "No course description yet."}
                    </p>
                  </div>
                  <div className="text-right min-w-32">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                      Lessons
                    </p>
                    <p className="text-3xl font-black text-primary">
                      {course.lessons?.length ?? 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/schedule_a_class?courseId=${course.id}`}
                    className="px-4 py-2 rounded-lg bg-primary-container text-primary text-xs font-bold tracking-widest uppercase"
                  >
                    Schedule Class
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
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
