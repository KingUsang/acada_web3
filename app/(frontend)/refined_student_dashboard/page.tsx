"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth/context";
import { useCertificates, useEnrollments, useUserDashboard } from "../../lib/api";

export default function RefinedStudentDashboardPage() {
  const { user, appUser, userId, isLoading: authLoading } = useAuth();
  const effectiveUserId = appUser?.id ?? userId;
  const { data: dashboardData, isLoading: dashboardLoading } = useUserDashboard(effectiveUserId);
  const { data: enrollmentsData } = useEnrollments(effectiveUserId);
  const { data: certificatesData } = useCertificates(effectiveUserId);

  const dashboard = dashboardData?.data;
  const enrollments = enrollmentsData?.data ?? [];
  const certificates = certificatesData?.data ?? [];
  const averageProgress =
    dashboard?.progress && dashboard.progress.length > 0
      ? Math.round(
          dashboard.progress.reduce((sum, item) => sum + (item.progress_percent ?? 0), 0) /
            dashboard.progress.length
        )
      : 0;
  const firstName =
    appUser?.full_name?.split(" ")[0] ?? user?.name?.split(" ")[0] ?? "Learner";

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-outline">
        <div className="flex items-center gap-3">
          <Link href="/student_home" className="material-symbols-outlined text-primary active:scale-95 duration-200 cursor-pointer">
            arrow_back
          </Link>
          <h1 className="text-xl font-black text-primary tracking-tighter font-headline">Acada</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            alt="Student Profile"
            className="w-full h-full object-cover"
            src={
              user?.profileImage ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwWXB0-lRQMpUMnwnboX1hC7-stYxccg5VuIFEzoCc7r7bMQhH_CNkD-nVWKsfMbmhGeY6Ml1qwPs9T-OkEt8fWHC12VTULGhlxU_u0YJ-W4QxMWgtSqns94d8S35l-nvHS_AhgtX-rftdbSwOX2Do8kZhoBNmPzh1BLSs1JJpNRt2zVEMMDElwkGE2cjTUm_1fMSBxr6Bkd3_czUSy92wjDANXhZEAFgAyuvwCOUqSgSqtnAn1lgAfPUeOd7OapEIsU9jXMFw"
            }
          />
        </div>
      </header>

      <main className="px-6 pt-6 pb-24 space-y-8 max-w-2xl mx-auto">
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                Student Profile
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">Hi, {firstName}</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {appUser?.email || "Wallet-authenticated learner"}
              </p>
            </div>
            <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <span className="font-label text-[10px] font-bold text-primary tracking-widest">
                {appUser?.role || "STUDENT"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1 bg-white border border-outline p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
              <span
                className="material-symbols-outlined text-primary text-2xl relative z-10"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <div className="relative z-10">
                <div className="text-4xl font-black font-headline text-on-surface leading-none">
                  {dashboardLoading || authLoading ? "..." : `${averageProgress}%`}
                </div>
                <div className="font-label text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mt-1">
                  Overall Progress
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-3">
              <div className="bg-white border border-outline p-4 rounded-2xl flex flex-col justify-center shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Courses
                </div>
                <div className="font-headline font-black text-xl text-on-surface">{enrollments.length}</div>
              </div>
              <div className="bg-white border border-outline p-4 rounded-2xl flex flex-col justify-center shadow-sm">
                <div className="font-label text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Certificates
                </div>
                <div className="font-headline font-black text-xl text-on-surface">{certificates.length}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg tracking-tight">My Enrollments</h3>
            <Link href="/student_home" className="font-label text-[10px] text-primary font-black uppercase tracking-widest">
              View Learning Hub
            </Link>
          </div>
          <div className="space-y-3">
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => {
                const course = enrollment.course;
                const progress =
                  dashboard?.progress.find((item) => item.course_id === enrollment.course_id)?.progress_percent ?? 0;
                return (
                  <Link
                    key={enrollment.id}
                    href={course?.id ? `/course_detail_student?id=${course.id}` : "/student_home"}
                    className="block bg-white border border-outline p-4 rounded-2xl shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h4 className="font-headline font-bold text-sm truncate text-on-surface">
                          {course?.title || "Course"}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          {course?.description || "Continue your coursework"}
                        </p>
                      </div>
                      <span className="font-label text-[9px] uppercase tracking-widest text-primary">
                        {progress}%
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="bg-white border border-outline p-4 rounded-2xl shadow-sm text-on-surface-variant">
                No enrollments found yet.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg tracking-tight">Achievement Status</h3>
            <Link href="/my_credentials" className="font-label text-[10px] text-primary font-black uppercase tracking-widest">
              Open Credentials
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-on-surface p-6 rounded-2xl relative overflow-hidden shadow-xl shadow-on-surface/10">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                      Certificates minted
                    </span>
                    <h4 className="text-white font-headline font-bold text-lg">
                      {certificates.length} verified credentials on record
                    </h4>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      workspace_premium
                    </span>
                  </div>
                </div>
                <Link
                  href="/my_credentials"
                  className="w-full bg-primary text-white font-label text-[10px] font-black py-4 rounded-xl uppercase tracking-[0.25em] active:scale-[0.98] transition-all shadow-lg shadow-primary/30 flex items-center justify-center"
                >
                  Manage Credentials
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-white/80 backdrop-blur-xl border-t border-outline flex justify-around items-center h-20 px-6 max-w-2xl mx-auto left-1/2 -translate-x-1/2">
        <Link href="/student_home" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-2xl">school</span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Learn
          </span>
        </Link>
        <Link href="/my_credentials" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-2xl">verified_user</span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Credentials
          </span>
        </Link>
        <Link href="/refined_student_dashboard" className="flex flex-col items-center justify-center text-primary group">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest mt-1">
            Profile
          </span>
          <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
        </Link>
      </nav>
    </div>
  );
}
