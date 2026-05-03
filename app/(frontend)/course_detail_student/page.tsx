"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCourse, useCourseProgress, useCourseQuizzes, useEnrollments, useCertificates } from "../../lib/api";
import { useAuth } from "../../lib/auth/context";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

function CourseDetailContent() {
  const { appUser, userId, idToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { mutate } = useSWRConfig();
  const id = searchParams.get("id");
  const effectiveUserId = appUser?.id ?? userId;
  const { data: courseData, error, isLoading } = useCourse(id || "");
  const { data: progressData } = useCourseProgress(effectiveUserId, id);
  const { data: quizzesData, isLoading: quizzesLoading, error: quizzesError } = useCourseQuizzes(id);
  const { data: enrollmentsData } = useEnrollments(effectiveUserId);
  const { data: certificatesData } = useCertificates(effectiveUserId);

  const existingCertificate = (certificatesData?.data ?? []).find(
    (cert) => cert.course_id === id
  );

  const course = courseData?.data;

  // Enrollment check with explicit loading state
  const isEnrollmentLoading = !enrollmentsData && !error;
  const isEnrolled = Boolean(
    id &&
      (enrollmentsData?.data ?? []).some(
        (enrollment) =>
          enrollment.course_id?.toLowerCase() === id.toLowerCase()
      )
  );

  const progress = progressData?.data?.[0];
  const progressPercent = progress?.progress_percent ?? 0;
  const isCompleted = Boolean(progress?.completed || progressPercent >= 80);

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

  const handleOpenLesson = (lessonId: string) => {
    if (!isEnrolled) {
      router.push(`/course_checkout?id=${course.id}`);
      return;
    }
    router.push(`/lesson_room?id=${lessonId}&course_id=${course.id}`);
  };

  const handleMarkComplete = async () => {
    if (!effectiveUserId || !idToken || !course.lessons?.length) return;
    setIsMarkingComplete(true);
    const completedLessons = course.lessons.length;
    const progressPercent = 100;
    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          user_id: effectiveUserId,
          course_id: course.id,
          progress_percent: progressPercent,
          completed: completedLessons > 0,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to update progress");
      }
      toast.success("Marked complete for demo judging flow");
      mutate(`/api/progress?user_id=${effectiveUserId}&course_id=${course.id}`);
    } catch (err: any) {
      toast.error(err?.message || "Could not mark complete");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleClaimCertificate = async () => {
    if (!idToken || !course?.id) return;
    setIsClaiming(true);
    try {
      const eligibilityRes = await fetch("/api/milestones/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ course_id: course.id }),
      });
      const eligibilityPayload = await eligibilityRes.json().catch(() => ({}));
      if (!eligibilityRes.ok || !eligibilityPayload?.data?.eligible || !eligibilityPayload?.data?.milestone_id) {
        throw new Error(eligibilityPayload?.error || "Not yet eligible for certificate");
      }
      const mintRes = await fetch("/api/certificates/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ milestone_id: eligibilityPayload.data.milestone_id }),
      });
      const mintPayload = await mintRes.json().catch(() => ({}));
      if (!mintRes.ok) throw new Error(mintPayload?.error || "Failed to claim certificate");
      toast.success("Certificate claimed successfully");
    } catch (err: any) {
      toast.error(err?.message || "Could not claim certificate");
    } finally {
      setIsClaiming(false);
    }
  };

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
        
        {isEnrollmentLoading ? (
          <div className="h-12 w-40 bg-surface-container-high animate-pulse rounded-xl"></div>
        ) : isEnrolled ? (
          <span className="inline-block bg-primary/10 text-primary font-bold py-4 px-8 rounded-xl">
            You are enrolled
          </span>
        ) : (
          <Link href={`/course_checkout?id=${course.id}`} className="inline-block bg-primary text-on-primary font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-primary-dim transition-all">
            Enroll Now
          </Link>
        )}
        
        {isEnrolled && !isEnrollmentLoading ? (
          <div className="mt-4 text-sm text-on-surface-variant">
            Progress: <strong>{progressPercent}%</strong> {isCompleted ? "(Completed)" : "(In progress)"}
          </div>
        ) : null}
      </section>
      {/* Course Modules */}
      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
        <h2 className="font-headline text-2xl font-bold mb-6">Course Content</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-4">
            {course.lessons.map((lesson: any, index: number) => (
              <button
                key={lesson.id}
                onClick={() => handleOpenLesson(lesson.id)}
                className="w-full text-left flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">{lesson.title}</h4>
                  <span className="text-xs text-on-surface-variant uppercase">{lesson.type}</span>
                </div>
                <span className="material-symbols-outlined text-outline">
                  {isEnrollmentLoading ? "sync" : isEnrolled ? "lock_open" : "lock"}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant italic">No lessons listed for this course yet.</p>
        )}
        {isEnrolled ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleMarkComplete}
              disabled={isMarkingComplete}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-high font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMarkingComplete ? (
                <span className="material-symbols-outlined animate-spin text-base">sync</span>
              ) : (
                <span className="material-symbols-outlined text-base">task_alt</span>
              )}
              {isMarkingComplete ? "Marking..." : "Mark Course Complete (Demo)"}
            </button>
            {existingCertificate ? (
              <Link
                href={`/credential_detail?id=${existingCertificate.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-bold text-sm shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                View Certificate
              </Link>
            ) : (
              <button
                onClick={handleClaimCertificate}
                disabled={!isCompleted || isClaiming}
                title={!isCompleted ? "Complete the course to claim your certificate" : "Claim your certificate"}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  isCompleted && !isClaiming
                    ? "bg-primary text-on-primary hover:bg-primary-dim shadow-md cursor-pointer"
                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                }`}
              >
                {isClaiming ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">workspace_premium</span>
                )}
                {isClaiming ? "Claiming..." : "Claim Certificate"}
              </button>
            )}
          </div>
        ) : null}
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl mt-8">
        <h2 className="font-headline text-2xl font-bold mb-6">Course Quizzes</h2>
        {quizzesError ? (
          <p className="text-destructive">Failed to load quizzes.</p>
        ) : quizzesLoading ? (
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="h-16 bg-surface-container-low rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (quizzesData?.data?.length ?? 0) > 0 ? (
          <div className="space-y-4">
            {quizzesData?.data?.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between gap-4 p-4 bg-surface-container-low rounded-lg">
                <div className="min-w-0">
                  <h4 className="font-bold text-on-surface truncate">{quiz.title}</h4>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                    Passing Score: {quiz.passing_score ?? "N/A"}%
                  </p>
                </div>
                {isEnrolled ? (
                  <Link
                    href={`/quiz_interface?id=${quiz.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm"
                  >
                    Take Quiz
                  </Link>
                ) : (
                  <Link
                    href={`/course_checkout?id=${course.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-outline-variant font-bold text-sm"
                  >
                    Enroll to Access
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant italic">No quizzes published for this course yet.</p>
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
