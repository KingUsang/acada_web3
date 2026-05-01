"use client";

import useSWR from "swr";
import { useAuth } from "./auth/context";
import type { Database } from "./database.types";

type AppUser = Database["public"]["Tables"]["users"]["Row"];
type CourseProgress = Database["public"]["Tables"]["course_progress"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"];
type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

export interface CourseSummary {
  id: string;
  title: string;
  description?: string | null;
  price_usdc?: number | null;
  category?: string | null;
  duration?: string | null;
  thumbnail_url?: string | null;
  lessons?: Array<{
    id: string;
    title: string;
    type: string;
    order_index?: number | null;
  }>;
  course_tutors?: Array<{
    tutor_id: string | null;
  }>;
}

export interface EnrollmentRecord {
  id: string;
  status: string | null;
  course_id: string | null;
  user_id: string | null;
  created_at?: string | null;
  course?: CourseSummary | null;
}

export interface DashboardSession extends Session {
  lesson?: {
    id: string;
    title: string;
    course_id: string | null;
  } | null;
}

export interface PendingQuiz {
  id: string;
  title: string;
  passing_score: number | null;
  course_id: string | null;
  lesson_id: string | null;
}

export interface StudentDashboardData {
  enrollments: EnrollmentRecord[];
  todaySessions: DashboardSession[];
  pendingQuizzes: PendingQuiz[];
  progress: CourseProgress[];
}

export interface TutorStatsData {
  totalStudents: number;
  activeCourses: number;
  upcomingSessions: DashboardSession[];
  totalEarnings: number;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
}

export interface CourseCertificate extends Certificate {
  course?: {
    id: string;
    title: string;
  } | null;
  milestone?: {
    id: string;
    status: string | null;
    metadata: Record<string, unknown> | null;
  } | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  options?: string[];
  marks?: number;
  explanation?: string;
}

export interface QuizDetails {
  id: string;
  title: string;
  passing_score: number | null;
  time_limit_minutes?: number | null;
  max_attempts?: number | null;
  course_id: string | null;
  lesson_id: string | null;
  quiz_data: {
    questions: QuizQuestion[];
  };
}

interface ApiResponse<T> {
  data: T;
}

export function useApiFetcher() {
  const { idToken } = useAuth();

  return async function fetcher<T>(url: string): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const error = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(error?.error || "An error occurred while fetching data.");
    }

    return (await res.json()) as ApiResponse<T>;
  };
}

export function useCourses(orgId?: string) {
  const fetcher = useApiFetcher();
  const url = orgId ? `/api/courses?org_id=${orgId}` : "/api/courses";
  return useSWR<ApiResponse<CourseSummary[]>>(url, fetcher);
}

export function useCourse(id: string) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<CourseSummary>>(id ? `/api/courses/${id}` : null, fetcher);
}

export function useUserDashboard(userId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<StudentDashboardData>>(
    userId ? `/api/users/${userId}/dashboard` : null,
    fetcher
  );
}

export function useTutorStats(userId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<TutorStatsData>>(
    userId ? `/api/users/${userId}/tutor-stats` : null,
    fetcher
  );
}

export function useOrganizations() {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<OrganizationSummary[]>>("/api/organizations", fetcher);
}

export function useUserProfile(userId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<AppUser>>(userId ? `/api/users/${userId}` : null, fetcher);
}

export function useEnrollments(userId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<EnrollmentRecord[]>>(
    userId ? `/api/enrollments?user_id=${userId}` : null,
    fetcher
  );
}

export function useCertificates(userId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<CourseCertificate[]>>(
    userId ? `/api/certificates?user_id=${userId}` : null,
    fetcher
  );
}

export function useCertificate(certificateId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<CourseCertificate>>(
    certificateId ? `/api/certificates/${certificateId}` : null,
    fetcher
  );
}

export function useQuiz(quizId: string | null) {
  const fetcher = useApiFetcher();
  return useSWR<ApiResponse<QuizDetails>>(quizId ? `/api/quizzes/${quizId}` : null, fetcher);
}

export function useSessions(lessonId?: string | null) {
  const fetcher = useApiFetcher();
  const url = lessonId ? `/api/sessions?lesson_id=${lessonId}` : "/api/sessions";
  return useSWR<ApiResponse<DashboardSession[]>>(url, fetcher);
}
