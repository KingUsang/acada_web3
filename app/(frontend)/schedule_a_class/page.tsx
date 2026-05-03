"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth/context";
import { useCourses } from "../../lib/api";

function toIsoDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

export default function ScheduleAClassPage() {
  const { idToken, userId, appUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCourseId = searchParams.get("courseId") ?? "";
  const { data, isLoading } = useCourses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    courseId: defaultCourseId,
    lessonId: "",
    title: "",
    date: "",
    time: "",
  });

  const tutorCourses = useMemo(() => {
    const courses = data?.data ?? [];
    if (!userId) return [];

    return courses.filter((course) => {
      if (appUser?.role === "ORG_ADMIN") return true;
      return course.course_tutors?.some((tutor) => tutor.tutor_id === userId);
    });
  }, [appUser?.role, data?.data, userId]);

  const selectedCourse = tutorCourses.find((course) => course.id === form.courseId);
  const lessons = selectedCourse?.lessons ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!idToken || !form.lessonId || !form.date || !form.time) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          lesson_id: form.lessonId,
          title: form.title || "Live Session",
          scheduled_at: toIsoDateTime(form.date, form.time),
        }),
      });

      const payload = (await res.json()) as { data?: { id: string }; error?: string };
      if (!res.ok || !payload.data) {
        throw new Error(payload.error || "Failed to schedule session");
      }

      toast.success("Session scheduled successfully");
      router.push(`/live_classroom?sessionId=${payload.data.id}&mode=tutor`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to schedule session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen pb-32 font-body">
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-4">
          <Link href="/tutor_home" className="material-symbols-outlined text-on-surface-variant cursor-pointer">
            close
          </Link>
        </div>
        <span className="text-2xl font-black tracking-tighter text-primary">ACADA</span>
        <div className="w-6"></div>
      </nav>

      <main className="mt-16 px-6 pt-8 max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Schedule a Class
          </h1>
          <p className="text-on-surface-variant text-lg mt-2 font-medium opacity-80">
            Create a live session and launch it when class time begins.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
              Course
            </label>
            <div className="bg-surface-container-low rounded-md p-1">
              <select
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface font-medium"
                value={form.courseId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    courseId: event.target.value,
                    lessonId: "",
                  }))
                }
                required
              >
                <option value="">Select a course</option>
                {tutorCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
              Lesson
            </label>
            <div className="bg-surface-container-low rounded-md p-1">
              <select
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface font-medium"
                value={form.lessonId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    lessonId: event.target.value,
                  }))
                }
                required
                disabled={!form.courseId}
              >
                <option value="">Select a lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
              Session Title
            </label>
            <div className="bg-surface-container-low rounded-md p-1">
              <input
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="e.g. Advanced Macroeconomics Live Review"
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <section className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Date
              </label>
              <div className="bg-surface-container-low rounded-md flex items-center px-4 py-3">
                <input
                  className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold w-full"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </section>

            <section className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Start Time
              </label>
              <div className="bg-surface-container-low rounded-md flex items-center px-4 py-3">
                <input
                  className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold w-full"
                  type="time"
                  value={form.time}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      time: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </section>
          </div>

          <section className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-on-surface">Tutor Scope</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isLoading
                  ? "Loading your courses..."
                  : tutorCourses.length > 0
                    ? `${tutorCourses.length} course(s) available for scheduling`
                    : "No eligible tutor courses found yet"}
              </p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1">
              <div className="bg-on-primary w-4 h-4 rounded-full ml-auto"></div>
            </div>
          </section>

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
                  <h4 className="font-bold text-on-surface">What happens next?</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                    After scheduling, you can open the classroom and start the LiveKit room when class begins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="pt-4">
            <button
              disabled={isSubmitting || tutorCourses.length === 0}
              className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-4 rounded-full shadow-[0_12px_24px_-8px_rgba(0,83,219,0.3)] active:scale-95 transition-all text-sm uppercase tracking-widest font-label max-w-md mx-auto block disabled:opacity-50"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Session"}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
