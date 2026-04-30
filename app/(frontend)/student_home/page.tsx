"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth/context";
import { useCourses, useUserDashboard } from "../../lib/api";

function formatClock(dateString: string | null) {
  if (!dateString) return { time: "TBD", meridiem: "" };

  const date = new Date(dateString);
  return {
    time: date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).split(" ")[0],
    meridiem: date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).split(" ")[1] ?? "",
  };
}

export default function StudentHomePage() {
  const { user, appUser, userId, isLoading: authLoading } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useUserDashboard(userId);
  const { data: coursesData, isLoading: coursesLoading } = useCourses();

  const dashboard = dashboardData?.data;
  const progressMap = new Map(
    (dashboard?.progress ?? []).map((item) => [item.course_id, item.progress_percent ?? 0])
  );
  const enrolledCourseIds = new Set(
    (dashboard?.enrollments ?? []).map((item) => item.course_id).filter(Boolean)
  );
  const availableCourses = (coursesData?.data ?? []).filter((course) => !enrolledCourseIds.has(course.id));
  const firstName =
    appUser?.full_name?.split(" ")[0] ?? user?.name?.split(" ")[0] ?? "Learner";
  const averageProgress =
    dashboard?.progress && dashboard.progress.length > 0
      ? Math.round(
          dashboard.progress.reduce((sum, item) => sum + (item.progress_percent ?? 0), 0) /
            dashboard.progress.length
        )
      : 0;
  const primaryQuiz = dashboard?.pendingQuizzes?.[0] ?? null;

  return (
    <div className="bg-background text-on-surface min-h-screen font-body">
      <header className="w-full top-0 sticky z-50 bg-surface-container-low shadow-none flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary active:scale-95 duration-200 cursor-pointer">
            menu
          </span>
          <Link href="/">
            <h1 className="text-xl font-black text-primary tracking-tighter font-headline">Acada</h1>
          </Link>
        </div>
        <Link href="/refined_student_dashboard" className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container">
          <img
            alt="Student Profile"
            className="w-full h-full object-cover"
            src={
              user?.profileImage ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwWXB0-lRQMpUMnwnboX1hC7-stYxccg5VuIFEzoCc7r7bMQhH_CNkD-nVWKsfMbmhGeY6Ml1qwPs9T-OkEt8fWHC12VTULGhlxU_u0YJ-W4QxMWgtSqns94d8S35l-nvHS_AhgtX-rftdbSwOX2Do8kZhoBNmPzh1BLSs1JJpNRt2zVEMMDElwkGE2cjTUm_1fMSBxr6Bkd3_czUSy92wjDANXhZEAFgAyuvwCOUqSgSqtnAn1lgAfPUeOd7OapEIsU9jXMFw"
            }
          />
        </Link>
      </header>

      <main className="px-6 pt-4 pb-24 space-y-8 max-w-2xl mx-auto">
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Academic Overview
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">Hi, {firstName}</h2>
            </div>
            <div className="bg-primary-container px-3 py-1 rounded-full">
              <span className="font-label text-[10px] font-bold text-on-primary-container tracking-widest">
                {dashboard?.enrollments?.length ?? 0} ENROLLED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between aspect-square shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
              <div>
                <div className="text-3xl font-extrabold font-headline">
                  {dashboardLoading || authLoading ? "..." : `${averageProgress}%`}
                </div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Overall Progress
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Live Today
                </div>
                <div className="font-headline font-bold text-lg">{dashboard?.todaySessions?.length ?? 0}</div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Pending Quizzes
                </div>
                <div className="font-headline font-bold text-lg">{dashboard?.pendingQuizzes?.length ?? 0}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg tracking-tight">Continue Learning</h3>
          {dashboardError ? (
            <div className="rounded-xl bg-destructive/10 text-destructive p-4">
              Failed to load your dashboard.
            </div>
          ) : dashboardLoading || authLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {[1, 2].map((item) => (
                <div key={item} className="min-w-[280px] h-64 bg-surface-container-low rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (dashboard?.enrollments?.length ?? 0) > 0 ? (
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
              {dashboard?.enrollments.map((enrollment) => {
                const course = enrollment.course;
                if (!course?.id) return null;
                const progress = progressMap.get(course.id) ?? 0;
                return (
                  <Link
                    key={enrollment.id}
                    href={`/course_detail_student?id=${course.id}`}
                    className="min-w-[280px] bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm"
                  >
                    <div className="h-32 relative">
                      <img
                        alt={course.title}
                        className="w-full h-full object-cover"
                        src={
                          course.thumbnail_url ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent"></div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-headline font-bold leading-tight line-clamp-2">{course.title}</h4>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-sm overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label text-[10px] text-on-surface-variant">
                          {progress > 0 ? `${progress}% COMPLETE` : "JUST ENROLLED"}
                        </span>
                        <span className="material-symbols-outlined text-primary text-xl cursor-pointer">
                          play_circle
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-on-surface-variant italic">You have not enrolled in any courses yet.</p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg tracking-tight">Browse More Courses</h3>
            <span className="font-label text-[10px] text-primary font-bold uppercase tracking-widest">
              Marketplace
            </span>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
            {coursesLoading ? (
              <div className="flex gap-4">
                {[1, 2].map((item) => (
                  <div key={item} className="min-w-[280px] h-56 bg-surface-container-low rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : availableCourses.length > 0 ? (
              availableCourses.slice(0, 6).map((course) => (
                <Link
                  key={course.id}
                  href={`/course_detail_student?id=${course.id}`}
                  className="min-w-[280px] bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="h-32 relative">
                    <img
                      alt={course.title}
                      className="w-full h-full object-cover"
                      src={
                        course.thumbnail_url ||
                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60"
                      }
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-headline font-bold line-clamp-2">{course.title}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">{course.duration || "Self-paced"}</span>
                      <span className="font-bold text-primary">${course.price_usdc ?? 0}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-on-surface-variant italic">No new courses available right now.</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg tracking-tight">Today&apos;s Schedule</h3>
            <Link
              href={dashboard?.todaySessions?.[0] ? `/live_classroom?sessionId=${dashboard.todaySessions[0].id}` : "/live_classroom"}
              className="font-label text-[10px] text-primary font-bold uppercase tracking-widest"
            >
              Join Live
            </Link>
          </div>
          <div className="space-y-3">
            {(dashboard?.todaySessions?.length ?? 0) > 0 ? (
              dashboard?.todaySessions.map((session) => {
                const time = formatClock(session.scheduled_at);
                return (
                  <Link
                    key={session.id}
                    href={`/live_classroom?sessionId=${session.id}`}
                    className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex flex-col items-center justify-center bg-surface-container-lowest w-14 h-14 rounded-lg shadow-sm">
                      <span className="font-label text-[10px] text-on-surface-variant uppercase">
                        {time.time}
                      </span>
                      <span className="font-headline font-bold">{time.meridiem}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-headline font-bold text-sm">
                        {session.title || session.lesson?.title || "Live session"}
                      </h5>
                      <p className="text-xs text-on-surface-variant">
                        {session.lesson?.title || "Classroom"} • Tap to join
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                  </Link>
                );
              })
            ) : (
              <div className="bg-surface-container-low p-4 rounded-xl text-on-surface-variant">
                No live classes scheduled for today.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg tracking-tight">Pending Quizzes</h3>
          {primaryQuiz ? (
            <div className="bg-inverse-surface p-6 rounded-xl relative overflow-hidden shadow-lg">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-label text-[10px] text-primary-container uppercase tracking-widest">
                      Ready to attempt
                    </span>
                    <h4 className="text-on-primary font-headline font-bold text-lg">
                      {primaryQuiz.title}
                    </h4>
                  </div>
                  <span className="material-symbols-outlined text-primary-container">
                    assignment_late
                  </span>
                </div>
                <Link
                  href={`/quiz_interface?id=${primaryQuiz.id}`}
                  className="w-full bg-primary text-on-primary font-label text-xs font-bold py-3 rounded-full uppercase tracking-widest active:scale-95 transition-transform shadow-md flex items-center justify-center"
                >
                  Start Quiz Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-xl p-5 text-on-surface-variant shadow-sm">
              No pending quizzes right now.
            </div>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-white/80 dark:bg-[#070e1d]/80 backdrop-blur-xl shadow-[0_-4px_32px_rgba(7,14,29,0.04)] flex justify-around items-center h-16 px-4 max-w-2xl mx-auto left-1/2 -translate-x-1/2">
        <Link href="/student_home" className="flex flex-col items-center justify-center text-primary after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary transition-colors">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Learn</span>
        </Link>
        <Link href="/my_credentials" className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Credentials</span>
        </Link>
        <Link href="/acada_etheric" className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Search</span>
        </Link>
        <Link href="/refined_student_dashboard" className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] uppercase tracking-widest mt-0.5">Profile</span>
        </Link>
      </nav>

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
