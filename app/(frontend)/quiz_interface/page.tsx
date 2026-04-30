"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth/context";
import { useQuiz, type QuizDetails } from "../../lib/api";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function QuizRunner({ idToken, quiz, quizId }: { idToken: string | null; quiz: QuizDetails; quizId: string }) {
  const router = useRouter();
  const questions = quiz.quiz_data.questions ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(
    quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null
  );

  const collectedAnswers = questions.map((_, index) =>
    answers[index] === undefined ? null : answers[index]
  );

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const hasAnsweredCurrent = answers[currentIndex] !== undefined;

  const handleSubmit = useCallback(async () => {
    if (!idToken) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          answers: collectedAnswers,
        }),
      });

      const payload = (await res.json()) as {
        data?: {
          attempt_id: string;
          score: number;
          total: number;
          correct: number;
          is_passed: boolean;
        };
        error?: string;
      };

      if (!res.ok || !payload.data) {
        throw new Error(payload.error || "Failed to submit quiz");
      }

      const params = new URLSearchParams({
        attemptId: payload.data.attempt_id,
        quizId,
        title: quiz.title || "Quiz",
        score: String(payload.data.score),
        total: String(payload.data.total),
        correct: String(payload.data.correct),
        passed: String(payload.data.is_passed),
        courseId: quiz.course_id || "",
      });

      router.push(`/quiz_result?${params.toString()}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [collectedAnswers, idToken, quiz.course_id, quiz.title, quizId, router]);

  useEffect(() => {
    if (secondsRemaining === null) return;

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current === null) return null;
        if (current <= 1) {
          window.clearInterval(timer);
          if (!isSubmitting) {
            void handleSubmit();
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [handleSubmit, isSubmitting, secondsRemaining]);

  const handleNext = async () => {
    if (currentIndex >= questions.length - 1) {
      await handleSubmit();
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-surface flex justify-between items-center px-6 py-4 max-w-full">
        <div className="flex items-center gap-3">
          <Link href="/student_home" className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 duration-150">
            close
          </Link>
          <h1 className="font-headline font-bold tracking-tight text-lg text-on-surface">
            Question {questions.length > 0 ? currentIndex + 1 : 0} of {questions.length}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full">
          <span
            className="material-symbols-outlined text-primary text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <span className="font-label text-sm font-bold tracking-wider text-on-primary-fixed-variant">
            {secondsRemaining === null ? "No limit" : formatTime(secondsRemaining)}
          </span>
        </div>
      </header>

      <div className="w-full h-1 bg-surface-container">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <main className="flex-grow flex flex-col px-6 py-8 max-w-3xl mx-auto w-full">
        {currentQuestion ? (
          <>
            <section className="mb-12">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 block">
                {quiz.title}
              </span>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface leading-tight tracking-tight">
                {currentQuestion.question}
              </h2>
            </section>

            <div className="space-y-4 mb-24">
              {(currentQuestion.options ?? []).map((option, optionIndex) => {
                const isSelected = answers[currentIndex] === optionIndex;
                return (
                  <label
                    key={`${currentQuestion.id}-${optionIndex}`}
                    className={`group relative flex items-center p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-primary-container/30 border-primary/20"
                        : "bg-surface-container-lowest hover:bg-surface-container-high border-transparent"
                    }`}
                  >
                    <input
                      checked={isSelected}
                      className="hidden peer"
                      name={`quiz-option-${currentIndex}`}
                      type="radio"
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [currentIndex]: optionIndex,
                        }))
                      }
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary bg-primary" : "border-outline-variant"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full bg-white ${isSelected ? "opacity-100" : "opacity-0"}`}></div>
                    </div>
                    <span
                      className={`ml-4 font-headline font-semibold transition-colors ${
                        isSelected ? "text-on-primary-container" : "text-on-surface group-hover:text-primary"
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-surface-container-low p-5 text-on-surface-variant">
            This quiz has no questions yet.
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-[#070e1d]/80 backdrop-blur-xl border-t border-blue-100/10 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
          <button className="flex items-center gap-2 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">flag</span>
            Review
          </button>
          <button
            onClick={() => void handleNext()}
            disabled={isSubmitting || !hasAnsweredCurrent}
            className="flex-grow md:flex-grow-0 md:min-w-[220px] bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 px-8 rounded-full font-headline font-bold text-lg shadow-[0_8px_24px_rgba(0,83,219,0.25)] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : currentIndex === questions.length - 1
                ? "Submit Quiz"
                : "Next Question"}
          </button>
        </div>
      </footer>
    </>
  );
}

export default function QuizInterfacePage() {
  const { idToken } = useAuth();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");
  const { data, isLoading, error } = useQuiz(quizId);
  const quiz = data?.data;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      {error ? (
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="rounded-xl bg-destructive/10 p-5 text-destructive">
            Failed to load quiz.
          </div>
        </main>
      ) : isLoading || !quiz || !quizId ? (
        <main className="flex-grow flex flex-col px-6 py-8 max-w-3xl mx-auto w-full">
          <div className="space-y-6">
            <div className="h-6 w-40 bg-surface-container-low rounded animate-pulse"></div>
            <div className="h-24 w-full bg-surface-container-low rounded animate-pulse"></div>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 w-full bg-surface-container-low rounded-xl animate-pulse"></div>
            ))}
          </div>
        </main>
      ) : (
        <QuizRunner idToken={idToken} quiz={quiz} quizId={quizId} />
      )}
    </div>
  );
}
