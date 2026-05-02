"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth/context";
import { useTutorStats } from "../../lib/api";

function formatSessionDate(dateString: string | null) {
  if (!dateString) return { month: "TBD", day: "--", time: "Not scheduled" };

  const date = new Date(dateString);
  return {
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: date.toLocaleString("en-US", { day: "2-digit" }),
    time: date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export default function TutorHomePage() {
  const { user, appUser, userId, isLoading: authLoading } = useAuth();
  const { data, isLoading, error } = useTutorStats(userId);

  const stats = data?.data;
  const upcomingSessions = stats?.upcomingSessions ?? [];
  const firstName =
    appUser?.full_name?.split(" ")[0] ?? user?.name?.split(" ")[0] ?? "Tutor";

  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-container min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-slate-50/60 backdrop-blur-xl shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/refined_student_dashboard"
              className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden"
            >
              <img
                alt="Tutor profile"
                className="w-full h-full object-cover"
                src={
                  user?.profileImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_H4UmM_92IJKrQdfw24pccczcx5JEp4iuBrkW5l0SZNjLiXM4ZVdQPnWaziT7D0AmHsGVCQoW8Z6YiegRA8Q_jXfTptMiQjNUA0xYkrY0hKCFv_FXDkaA9vdWmfzxNX17RS1Nr9Z-j-16Z2Ax0rfGVggRrg3SXkyF9oAARZTMF5Al1OEa2XwSdEiJe1QO5cRwB4JSGfqPC_89JStJZWCsD6gEfuOop2CFGZeDu7MKnluAFuolbfXGQThlOG3lpsszyUH-qL-e5A"
                }
              />
            </Link>
            <Link href="/">
              <h1 className="text-2xl font-black tracking-tighter text-primary font-headline">
                Acada
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/schedule_a_class"
              className="p-2 rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-slate-500">
                event_available
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="font-label text-primary font-bold tracking-widest uppercase text-[10px] mb-2">
              Tutor Dashboard
            </p>
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-inverse-surface leading-none">
              Welcome back, {firstName}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/schedule_a_class"
              className="bg-surface-container-low hover:bg-surface-container text-on-surface px-6 py-3 rounded-xl flex items-center gap-2 font-label text-sm transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">calendar_add_on</span>
              SCHEDULE CLASS
            </Link>
            <Link
              href="/create_course"
              className="bg-primary hover:bg-primary-dim text-white px-6 py-3 rounded-xl flex items-center gap-2 font-label text-sm transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              CREATE NEW COURSE
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 group shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl">groups</span>
              <span className="font-label text-xs font-bold text-primary bg-primary-container px-2 py-1 rounded-full">
                LIVE
              </span>
            </div>
            <div>
              <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                Total Students
              </h3>
              <p className="text-5xl font-headline font-bold text-inverse-surface tracking-tighter">
                {isLoading || authLoading ? "..." : stats?.totalStudents ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-inverse-surface p-8 rounded-xl flex flex-col justify-between h-48 shadow-lg">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary-container text-3xl">
                auto_stories
              </span>
              <span className="font-label text-xs font-bold text-on-primary-container bg-primary-container/20 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div>
              <h3 className="font-label text-xs text-slate-400 uppercase tracking-widest mb-1">
                Active Courses
              </h3>
              <p className="text-5xl font-headline font-bold text-white tracking-tighter">
                {isLoading || authLoading ? "..." : stats?.activeCourses ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 border-b-4 border-primary shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl">payments</span>
              <span className="material-symbols-outlined text-on-surface-variant text-xl">
                trending_up
              </span>
            </div>
            <div>
              <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                Total Earnings
              </h3>
              <p className="text-5xl font-headline font-bold text-inverse-surface tracking-tighter">
                ${Math.round(stats?.totalEarnings ?? 0)}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-headline font-bold text-inverse-surface">
                Upcoming Classes
              </h3>
              <Link
                href="/schedule_a_class"
                className="text-primary font-label text-sm font-bold hover:underline uppercase tracking-widest"
              >
                View All Schedule
              </Link>
            </div>

            {error ? (
              <div className="p-6 bg-destructive/10 text-destructive rounded-xl">
                Failed to load tutor dashboard data.
              </div>
            ) : isLoading || authLoading ? (
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="h-28 bg-surface-container-low rounded-xl animate-pulse" />
                ))}
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => {
                  const meta = formatSessionDate(session.scheduled_at);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center justify-center bg-surface-container w-16 h-16 rounded-xl border-l-4 border-primary">
                          <span className="font-label text-[10px] uppercase font-bold text-on-surface-variant">
                            {meta.month}
                          </span>
                          <span className="text-xl font-headline font-bold text-inverse-surface">
                            {meta.day}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-lg text-inverse-surface">
                            {session.title || session.lesson?.title || "Live Session"}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-on-surface-variant text-xs font-label">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              {meta.time}
                            </span>
                            <span className="flex items-center gap-1 text-on-surface-variant text-xs font-label">
                              <span className="material-symbols-outlined text-sm">school</span>
                              {session.lesson?.title || "Lesson"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/live_classroom?sessionId=${session.id}&mode=tutor`}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-container/30 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <span className="material-symbols-outlined">video_call</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-surface-container-lowest text-on-surface-variant shadow-sm">
                No scheduled classes yet. Use the scheduler to create your next live session.
              </div>
            )}
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-headline font-bold text-inverse-surface">
              Quick Actions
            </h3>

            <div className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-inverse-surface text-xl mb-2">
                  Build your curriculum
                </h4>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  Create a course, add lessons, then schedule live sessions directly from your dashboard.
                </p>
                <Link
                  href="/create_course"
                  className="w-full py-4 bg-inverse-surface text-white rounded-xl font-label text-sm font-bold tracking-widest hover:bg-primary transition-colors uppercase flex items-center justify-center"
                >
                  Launch Builder
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 space-y-4 shadow-sm">
              <h4 className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Delivery Snapshot
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-label mb-2">
                    <span className="text-on-surface-variant">Scheduled Sessions</span>
                    <span className="text-inverse-surface font-bold">{upcomingSessions.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, upcomingSessions.length * 20)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-label mb-2">
                    <span className="text-on-surface-variant">Course Coverage</span>
                    <span className="text-inverse-surface font-bold">{stats?.activeCourses ?? 0} active</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (stats?.activeCourses ?? 0) * 15)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/80 backdrop-blur-lg z-50 rounded-t-xl shadow-[0_-8px_24px_-4px_rgba(7,14,29,0.04)]">
        <Link
          href="/tutor_home"
          className="flex flex-col items-center justify-center text-primary after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-widest mt-1">
            Home
          </span>
        </Link>
        <Link
          href="/course_content_manager"
          className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">school</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-widest mt-1">
            Courses
          </span>
        </Link>
        <Link
          href="/wallet_connection"
          className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-widest mt-1">
            Wallet
          </span>
        </Link>
        <Link
          href="/refined_student_dashboard"
          className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-widest mt-1">
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
}

