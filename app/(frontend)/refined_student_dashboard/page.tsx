"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth/context";
import { useUserDashboard } from "../../lib/api";

function formatClock(dateString: string | null) {
  if (!dateString) return { time: "TBD", meridiem: "" };

  const date = new Date(dateString);
  return {
    time: date
      .toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      .split(" ")[0],
    meridiem:
      date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).split(" ")[1] ?? "",
  };
}

export default function RefinedStudentDashboardPage() {
  const { user, appUser, userId, isLoading: authLoading } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading, error } = useUserDashboard(userId);

  const dashboard = dashboardData?.data;
  const firstName = appUser?.full_name?.split(" ")[0] ?? user?.name?.split(" ")[0] ?? "Alex";
  const averageProgress =
    dashboard?.progress && dashboard.progress.length > 0
      ? Math.round(
          dashboard.progress.reduce((sum, item) => sum + (item.progress_percent ?? 0), 0) /
            dashboard.progress.length
        )
      : 84;
  const continueCourses =
    dashboard?.enrollments?.map((enrollment) => ({
      id: enrollment.course?.id ?? enrollment.id,
      title: enrollment.course?.title ?? "Advanced Quantum Mechanics",
      progress:
        dashboard?.progress?.find((item) => item.course_id === enrollment.course_id)?.progress_percent ?? 65,
      thumbnail:
        enrollment.course?.thumbnail_url ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=60",
    })) ?? [];
  const todaySessions = dashboard?.todaySessions ?? [];
  const primaryQuiz = dashboard?.pendingQuizzes?.[0] ?? null;

  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface/80 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary active:scale-95 duration-200 cursor-pointer">
              menu
            </span>
            <Link href="/student_home">
              <h1 className="text-xl font-black tracking-tighter text-primary">Acada</h1>
            </Link>
          </div>
          <Link
            href="/student_home"
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container"
          >
            <img
              alt="Student Profile"
              className="h-full w-full object-cover"
              src={
                user?.profileImage ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwWXB0-lRQMpUMnwnboX1hC7-stYxccg5VuIFEzoCc7r7bMQhH_CNkD-nVWKsfMbmhGeY6Ml1qwPs9T-OkEt8fWHC12VTULGhlxU_u0YJ-W4QxMWgtSqns94d8S35l-nvHS_AhgtX-rftdbSwOX2Do8kZhoBNmPzh1BLSs1JJpNRt2zVEMMDElwkGE2cjTUm_1fMSBxr6Bkd3_czUSy92wjDANXhZEAFgAyuvwCOUqSgSqtnAn1lgAfPUeOd7OapEIsU9jXMFw"
              }
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-10 px-6 pb-28 pt-10">
        <section className="space-y-5">
          <div className="space-y-2">
            <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
              Academic Overview
            </span>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Hi, {firstName}</h2>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Rank: A+
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-20 w-20 rounded-full bg-primary/5" />
              <span className="material-symbols-outlined text-3xl text-primary">auto_awesome</span>
              <div>
                <div className="text-4xl font-black leading-none tracking-tight text-on-surface">
                  {dashboardLoading || authLoading ? "..." : `${averageProgress}%`}
                </div>
                <div className="mt-1 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Overall Progress
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="flex flex-col justify-center rounded-2xl bg-surface-container-low p-5 shadow-sm">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Credits
                </span>
                <span className="mt-1 text-3xl font-black tracking-tight text-on-surface">124</span>
              </div>
              <div className="flex flex-col justify-center rounded-2xl bg-surface-container-low p-5 shadow-sm">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  GPA
                </span>
                <span className="mt-1 text-3xl font-black tracking-tight text-on-surface">3.9</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-on-surface">Continue Learning</h3>
          {error ? (
            <div className="rounded-xl bg-destructive/10 p-4 text-destructive">Failed to load your dashboard.</div>
          ) : continueCourses.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 pr-2 no-scrollbar">
              {continueCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course_detail_student?id=${course.id}`}
                  className="min-w-[18rem] overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm"
                >
                  <div className="relative h-40">
                    <img alt={course.title} className="h-full w-full object-cover grayscale-[1]" src={course.thumbnail} />
                    <div className="absolute inset-0 bg-linear-to-t from-surface/75 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-md bg-surface-container-highest px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">
                      WEEK 08
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <h4 className="text-lg font-bold leading-tight text-on-surface">{course.title}</h4>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                        {course.progress}% completed
                      </span>
                      <span className="material-symbols-outlined text-3xl text-primary">play_circle</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-container-low p-4 text-on-surface-variant">
              You have not enrolled in any courses yet.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-on-surface">Today&apos;s Schedule</h3>
            <Link href="/live_classroom" className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {(todaySessions.length > 0 ? todaySessions : [
              { id: "1", scheduled_at: new Date().toISOString(), title: "Linear Algebra Lecture", lesson: { title: "Room 402 • Prof. Sarah Jenkins" } },
              { id: "2", scheduled_at: new Date().toISOString(), title: "UI/UX Design Studio", lesson: { title: "Digital Lab 1 • Interactive Workshop" } },
            ]).map((session) => {
              const time = formatClock(session.scheduled_at ?? null);
              return (
                <Link
                  key={session.id}
                  href={`/live_classroom?sessionId=${session.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-4 shadow-sm"
                >
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                      {time.time}
                    </span>
                    <span className="text-lg font-black leading-none">{time.meridiem || "AM"}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-lg font-bold text-on-surface">{session.title || session.lesson?.title || "Live session"}</h4>
                    <p className="truncate text-sm text-on-surface-variant">{session.lesson?.title || "Tap to join"}</p>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-outline">chevron_right</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-on-surface">Pending Quizzes</h3>
          <div className="relative min-h-56 overflow-hidden rounded-3xl bg-surface-container-highest p-6 text-on-primary shadow-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            {primaryQuiz ? (
              <>
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="font-label text-[10px] uppercase tracking-[0.22em] text-primary-container">
                      Ends in 2h 45m
                    </span>
                    <h4 className="text-2xl font-bold leading-tight text-on-surface">{primaryQuiz.title}</h4>
                  </div>
                  <span className="material-symbols-outlined rounded-xl bg-primary-container/20 p-2 text-primary">assignment</span>
                </div>
                <Link
                  href={`/quiz_interface?id=${primaryQuiz.id}`}
                  className="relative z-10 flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-bold uppercase tracking-[0.28em] text-on-primary shadow-lg shadow-primary/20"
                >
                  Start Quiz Now
                </Link>
              </>
            ) : (
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="space-y-2">
                  <span className="font-label text-[10px] uppercase tracking-[0.22em] text-primary-container">
                    Ends in 2h 45m
                  </span>
                  <h4 className="text-2xl font-bold leading-tight text-on-surface">Statistical Inference Quiz</h4>
                </div>
                <Link
                  href="/quiz_interface"
                  className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-bold uppercase tracking-[0.28em] text-on-primary shadow-lg shadow-primary/20"
                >
                  Start Quiz Now
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
