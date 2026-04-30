"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth/context";

type TokenPayload = {
  token: string;
  room: string | null;
  livekit_url: string | null;
};

type AttendanceLog = {
  id: string;
  join_time: string | null;
  leave_time: string | null;
  user?: {
    full_name: string | null;
    email: string;
  } | null;
};

function formatDateTime(dateString: string | null) {
  if (!dateString) return "Pending";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LiveClassroomPage() {
  const { idToken, appUser } = useAuth();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const mode = searchParams.get("mode");
  const isTutorMode = mode === "tutor" || appUser?.role === "TUTOR" || appUser?.role === "ORG_ADMIN";

  const [tokenData, setTokenData] = useState<TokenPayload | null>(null);
  const [attendance, setAttendance] = useState<AttendanceLog[]>([]);
  const [status, setStatus] = useState<"idle" | "started" | "joined" | "ended">("idle");
  const [isWorking, setIsWorking] = useState(false);

  const loadAttendance = async () => {
    if (!idToken || !sessionId || !isTutorMode) return;

    const res = await fetch(`/api/attendance/leave?session_id=${sessionId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) return;
    const payload = (await res.json()) as { data?: AttendanceLog[] };
    setAttendance(payload.data ?? []);
  };

  const loadToken = async () => {
    if (!idToken || !sessionId) return;

    const res = await fetch(`/api/sessions/${sessionId}/token`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const payload = (await res.json()) as { data?: TokenPayload; error?: string };
    if (!res.ok || !payload.data) {
      throw new Error(payload.error || "Failed to get classroom token");
    }

    setTokenData(payload.data);
    return payload.data;
  };

  const startClass = async () => {
    if (!idToken || !sessionId) return;

    setIsWorking(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error || "Failed to start session");
      }

      await loadToken();
      await loadAttendance();
      setStatus("started");
      toast.success("Classroom started");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to start classroom");
    } finally {
      setIsWorking(false);
    }
  };

  const joinClass = async () => {
    if (!idToken || !sessionId) return;

    setIsWorking(true);
    try {
      const joinRes = await fetch("/api/attendance/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const joinPayload = (await joinRes.json()) as { error?: string };
      if (!joinRes.ok) {
        throw new Error(joinPayload.error || "Failed to join class");
      }

      await loadToken();
      setStatus("joined");
      toast.success("Joined classroom");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to join classroom");
    } finally {
      setIsWorking(false);
    }
  };

  const leaveClass = async () => {
    if (!idToken || !sessionId) return;

    setIsWorking(true);
    try {
      const leaveRes = await fetch("/api/attendance/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const payload = (await leaveRes.json()) as { error?: string };
      if (!leaveRes.ok) {
        throw new Error(payload.error || "Failed to leave class");
      }

      setStatus("idle");
      toast.success("Attendance recorded");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to leave classroom");
    } finally {
      setIsWorking(false);
    }
  };

  const endClass = async () => {
    if (!idToken || !sessionId) return;

    setIsWorking(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error || "Failed to end classroom");
      }

      setStatus("ended");
      await loadAttendance();
      toast.success("Class ended successfully");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to end classroom");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <Link href={isTutorMode ? "/tutor_home" : "/student_home"} className="text-2xl font-black tracking-tighter text-blue-600">
          Live Classroom
        </Link>
        <span className="text-xs uppercase tracking-widest text-on-surface-variant">
          {sessionId ? `Session ${sessionId.slice(0, 8)}` : "No session selected"}
        </span>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <section className="mb-6">
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
            Live Classroom
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Start, join, and close live sessions with attendance and token generation handled by the backend.
          </p>
        </section>

        {!sessionId ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
            <p className="text-on-surface-variant">
              Open this page from a scheduled session to launch the classroom flow.
            </p>
          </section>
        ) : (
          <>
            <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl space-y-4">
              <h2 className="font-headline text-2xl font-bold">Session Controls</h2>
              <p className="text-on-surface-variant">
                Current status: <span className="font-semibold text-on-surface">{status}</span>
              </p>

              <div className="flex flex-wrap gap-3">
                {isTutorMode ? (
                  <>
                    <button
                      onClick={startClass}
                      disabled={isWorking || status === "started"}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold disabled:opacity-50"
                    >
                      {isWorking && status === "idle" ? "Starting..." : "Start Class"}
                    </button>
                    <button
                      onClick={endClass}
                      disabled={isWorking || status === "ended"}
                      className="px-5 py-3 rounded-xl bg-inverse-surface text-white font-bold disabled:opacity-50"
                    >
                      {isWorking && status === "started" ? "Ending..." : "End Class"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={joinClass}
                      disabled={isWorking || status === "joined"}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold disabled:opacity-50"
                    >
                      {isWorking && status !== "joined" ? "Joining..." : "Join Class"}
                    </button>
                    <button
                      onClick={leaveClass}
                      disabled={isWorking || status !== "joined"}
                      className="px-5 py-3 rounded-xl bg-surface-container-low text-on-surface font-bold disabled:opacity-50"
                    >
                      Leave Class
                    </button>
                  </>
                )}
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl space-y-3">
              <h2 className="font-headline text-2xl font-bold">Token & Room Details</h2>
              {tokenData ? (
                <>
                  <p className="text-sm text-on-surface-variant">
                    LiveKit URL: <span className="text-on-surface">{tokenData.livekit_url || "Not configured"}</span>
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Room: <span className="text-on-surface">{tokenData.room || "Pending room"}</span>
                  </p>
                  <p className="text-sm text-on-surface-variant break-all">
                    Token: <span className="text-on-surface">{tokenData.token}</span>
                  </p>
                </>
              ) : (
                <p className="text-on-surface-variant">
                  Start or join the session to request a room token from the backend.
                </p>
              )}
            </section>

            {isTutorMode ? (
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-bold">Attendance</h2>
                  <button
                    onClick={() => void loadAttendance()}
                    className="text-sm text-primary font-bold uppercase tracking-widest"
                  >
                    Refresh
                  </button>
                </div>
                {attendance.length > 0 ? (
                  <div className="space-y-3">
                    {attendance.map((log) => (
                      <div key={log.id} className="rounded-xl bg-surface-container-low p-4">
                        <p className="font-semibold text-on-surface">
                          {log.user?.full_name || log.user?.email || "Student"}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          Joined: {formatDateTime(log.join_time)}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          Left: {formatDateTime(log.leave_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant">No attendance records yet.</p>
                )}
              </section>
            ) : null}
          </>
        )}
      </main>
      <style jsx>{`
        .glass-header {
          background: rgba(249, 249, 255, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
