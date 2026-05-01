"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth/context";
import { useCertificates, useEnrollments } from "../../lib/api";

type EligibilityResult = {
  eligible: boolean;
  attendance_pct: number;
  attendance_passed: boolean;
  quiz_score: number | null;
  quiz_passed: boolean;
  milestone_id: string | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "Pending";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyCredentialsPage() {
  const { idToken, user, userId } = useAuth();
  const { data: certificatesData, isLoading: certificatesLoading, mutate: mutateCertificates } = useCertificates(userId);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useEnrollments(userId);
  const [eligibilityByCourse, setEligibilityByCourse] = useState<Record<string, EligibilityResult>>({});
  const [checkingCourseId, setCheckingCourseId] = useState<string | null>(null);
  const [mintingMilestoneId, setMintingMilestoneId] = useState<string | null>(null);

  const certificates = certificatesData?.data ?? [];
  const enrollments = enrollmentsData?.data ?? [];

  const handleCheckEligibility = async (courseId: string) => {
    if (!idToken) return;

    setCheckingCourseId(courseId);
    try {
      const res = await fetch("/api/milestones/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      const payload = (await res.json()) as { data?: EligibilityResult; error?: string };
      if (!res.ok || !payload.data) {
        throw new Error(payload.error || "Failed to check credential eligibility");
      }

      setEligibilityByCourse((current) => ({ ...current, [courseId]: payload.data as EligibilityResult }));
      toast.success(payload.data.eligible ? "Course is eligible for minting" : "Course is not eligible yet");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to check eligibility");
    } finally {
      setCheckingCourseId(null);
    }
  };

  const handleMint = async (courseId: string, milestoneId: string | null) => {
    if (!idToken || !milestoneId) return;

    setMintingMilestoneId(milestoneId);
    try {
      const res = await fetch("/api/certificates/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ milestone_id: milestoneId }),
      });

      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error || "Failed to mint certificate");
      }

      toast.success("Certificate minted successfully");
      await mutateCertificates();
      setEligibilityByCourse((current) => {
        const next = { ...current };
        delete next[courseId];
        return next;
      });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to mint certificate");
    } finally {
      setMintingMilestoneId(null);
    }
  };

  return (
    <div className="bg-surface select-none min-h-screen font-body text-on-surface">
      <header className="w-full top-0 sticky bg-surface-container-low shadow-none z-40">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <Link href="/student_home" className="material-symbols-outlined text-[#2563EB] active:scale-95 duration-200 cursor-pointer">
              arrow_back
            </Link>
            <h1 className="font-headline font-bold tracking-tight text-on-surface text-xl">
              Acada
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center border border-primary-container overflow-hidden">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={
                user?.profileImage ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCmHmNgDVvbWJrCyj5nHPoH8NuAa5r3wEFl1f7VzGeguUxR-DcHzs7V5QcB3dYMoelSBFoKgPGbX2fTBBpidMzVJqeuE4y8N8AnnOZeKCKtZinaNBV4V0tdLM_k-zPTfmRdO39e9Aq2Y0kN3z5_FCjBzFpTM9GHYudgZHhlCxXmXtJ38C9gcg87uYaSoz3N88KRfRMYVRvjrTzImBoZIxqjGpUemsqGkRCvFY5yn9L1S0SGHEYmzRBfIAL6_yg6QMs_AwwPKkZ0Lg"
              }
            />
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 pb-24">
        <section className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
              My Credentials
            </h2>
            <span className="font-label text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-1">
              {certificates.length} Total
            </span>
          </div>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Verified achievements and on-chain certificates earned through the Acada ecosystem.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between h-32">
            <span
              className="material-symbols-outlined text-[#2563EB]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
            <div>
              <div className="text-2xl font-black font-headline tracking-tighter">{certificates.length}</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-secondary">
                Minted Certificates
              </div>
            </div>
          </div>
          <div className="bg-primary p-4 rounded-xl flex flex-col justify-between h-32 text-on-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <div>
              <div className="text-2xl font-black font-headline tracking-tighter">
                {enrollments.length}
              </div>
              <div className="font-label text-[10px] uppercase tracking-widest opacity-80">
                Eligible Courses To Check
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Mint New Credentials</h3>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">
              Check each completed course
            </span>
          </div>
          <div className="grid gap-4">
            {enrollmentsLoading ? (
              [1, 2].map((item) => (
                <div key={item} className="h-32 rounded-xl bg-surface-container-low animate-pulse"></div>
              ))
            ) : enrollments.length > 0 ? (
              enrollments.map((enrollment) => {
                const course = enrollment.course;
                if (!course?.id) return null;

                const eligibility = eligibilityByCourse[course.id];
                const isChecking = checkingCourseId === course.id;
                const canMint = eligibility?.eligible && eligibility.milestone_id;

                return (
                  <div key={enrollment.id} className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(37,99,235,0.04)]">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="font-headline font-bold text-lg text-on-surface leading-tight mb-1">
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
                          <span>{course.duration || "Self-paced"}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{enrollment.status || "active"}</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#2563EB] text-2xl">military_tech</span>
                    </div>

                    {eligibility ? (
                      <div className="mb-4 rounded-lg bg-surface-container-low p-3 text-sm">
                        <p className="font-semibold text-on-surface">
                          {eligibility.eligible ? "Eligible for minting" : "Not eligible yet"}
                        </p>
                        <p className="text-on-surface-variant mt-1">
                          Attendance: {eligibility.attendance_pct}% | Quiz score: {eligibility.quiz_score ?? "N/A"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant mb-4">
                        Run eligibility checks to verify attendance and final-quiz requirements.
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCheckEligibility(course.id)}
                        disabled={isChecking}
                        className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isChecking ? "Checking..." : "Check Eligibility"}
                      </button>
                      <button
                        onClick={() => handleMint(course.id, eligibility?.milestone_id ?? null)}
                        disabled={!canMint || mintingMilestoneId === eligibility?.milestone_id}
                        className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-headline font-bold active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {mintingMilestoneId === eligibility?.milestone_id ? "Minting..." : "Mint"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl bg-surface-container-low p-5 text-on-surface-variant">
                You need an active course enrollment before you can mint credentials.
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Minted Certificates</h3>
            <Link href="/student_home" className="text-xs text-primary uppercase tracking-widest font-bold">
              Back to learning
            </Link>
          </div>
          <div className="grid gap-4">
            {certificatesLoading ? (
              [1, 2].map((item) => (
                <div key={item} className="h-28 rounded-xl bg-surface-container-low animate-pulse"></div>
              ))
            ) : certificates.length > 0 ? (
              certificates.map((certificate) => (
                <Link
                  key={certificate.id}
                  href={`/credential_detail?id=${certificate.id}`}
                  className="block bg-surface-container-highest rounded-xl p-5 transition-transform active:scale-[0.98] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-on-surface text-6xl">shield</span>
                  </div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary px-3 py-1 rounded-full">
                      <span
                        className="material-symbols-outlined text-on-primary text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      <span className="font-label text-[10px] font-bold uppercase text-on-primary tracking-wider">
                        Minted
                      </span>
                    </div>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-on-surface leading-tight mb-1 relative z-10">
                    {certificate.course?.title || "Course Certificate"}
                  </h3>
                  <div className="flex items-center gap-2 relative z-10 text-xs text-on-surface-variant uppercase tracking-widest">
                    <span>Issued {formatDate(certificate.created_at)}</span>
                    <span className="w-1 h-1 bg-on-surface-variant/30 rounded-full"></span>
                    <span>{certificate.mint_address || "Pending mint reference"}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-xl bg-surface-container-low p-5 text-on-surface-variant">
                No certificates minted yet.
              </div>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}
