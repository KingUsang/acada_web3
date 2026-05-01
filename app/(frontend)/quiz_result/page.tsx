"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const score = Number(searchParams.get("score") || 0);
  const total = Number(searchParams.get("total") || 0);
  const correct = Number(searchParams.get("correct") || 0);
  const passed = searchParams.get("passed") === "true";
  const quizId = searchParams.get("quizId");
  const title = searchParams.get("title") || "Quiz";
  const courseId = searchParams.get("courseId");

  const strokeOffset = 552.92 - (552.92 * Math.min(score, 100)) / 100;

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(7,14,29,0.04)] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <Link href="/student_home" className="material-symbols-outlined text-primary">
            arrow_back
          </Link>
          <h1 className="text-xl font-extrabold tracking-tighter text-primary font-headline">
            Acada
          </h1>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col items-center text-center mb-10">
          <div className="mb-4 inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full">
            <span
              className="material-symbols-outlined text-primary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="font-label text-xs font-bold tracking-widest text-primary uppercase">
              Quiz Completed
            </span>
          </div>

          <p className="text-sm text-on-surface-variant uppercase tracking-[0.25em] mb-4">
            {title}
          </p>

          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                className="text-surface-container-high"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
              ></circle>
              <circle
                className="text-primary"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeDasharray="552.92"
                strokeDashoffset={strokeOffset}
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-headline font-extrabold tracking-tighter text-on-surface">
                {score}%
              </span>
              <span className="font-label text-xs text-on-surface-variant tracking-widest uppercase">
                Final Score
              </span>
            </div>
          </div>

          <div className="bg-surface-container-highest text-on-surface px-8 py-2 rounded-full font-label font-bold text-sm tracking-[0.2em] uppercase mb-8">
            {passed ? "Pass" : "Retry"}
          </div>
        </div>

        <div className="w-full grid grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">task_alt</span>
            <span className="text-xl font-headline font-bold text-on-surface">
              {correct}/{total}
            </span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Correct
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">trophy</span>
            <span className="text-xl font-headline font-bold text-on-surface">
              {passed ? "Passed" : "Retry"}
            </span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Outcome
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">monitoring</span>
            <span className="text-xl font-headline font-bold text-on-surface">{score >= 80 ? "High" : score >= 60 ? "Mid" : "Low"}</span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Mastery
            </span>
          </div>
        </div>

        <div className="w-full bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-16px_rgba(7,14,29,0.08)] mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Performance Analysis</h3>
            <span className="font-label text-xs text-primary font-bold">
              {passed ? "ELIGIBLE TO CONTINUE" : "REVIEW NEEDED"}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            {passed
              ? "You met the quiz requirement and your result has been saved to your learning record."
              : "Your result has been saved. Review the course material, then retake the quiz when you are ready."}
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-auto">
          <Link
            href={courseId ? `/course_detail_student?id=${courseId}` : "/student_home"}
            className="w-full h-14 bg-primary text-on-primary font-headline font-bold rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            Continue Learning
          </Link>
          {quizId ? (
            <Link
              href={`/quiz_interface?id=${quizId}`}
              className="w-full h-14 bg-surface-container-high text-on-surface font-headline font-bold rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              Retake Quiz
            </Link>
          ) : null}
        </div>
      </main>
    </div>
  );
}
