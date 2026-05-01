"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { useCertificate } from "../../lib/api";

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CredentialDetailContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: certificateData, error, isLoading } = useCertificate(id);
  const certificate = certificateData?.data;

  if (!id) {
    return (
      <main className="px-6 pt-6 pb-24">
        <div className="rounded-xl bg-destructive/10 text-destructive p-6">
          Missing credential id.
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="px-6 pt-6 pb-24">
        <div className="h-48 rounded-xl bg-surface-container-low animate-pulse"></div>
      </main>
    );
  }

  if (error || !certificate) {
    return (
      <main className="px-6 pt-6 pb-24">
        <div className="rounded-xl bg-destructive/10 text-destructive p-6 mb-4">
          Could not load this credential.
        </div>
        <Link href="/my_credentials" className="text-primary hover:underline font-headline font-bold">
          Back to Credentials
        </Link>
      </main>
    );
  }

  const competencies = certificate.milestone?.competencies || ["Solidity", "Security Audits", "EVM Dynamics", "DeFi Architecture"];

  return (
    <main className="px-6 pt-6 pb-24">
      {/* Badge & ID */}
      <section className="mb-6 flex justify-between items-start">
        <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
          Verified Credential
        </span>
        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
          ID: {certificate.id.slice(0, 8).toUpperCase()}-XQ
        </span>
      </section>

      {/* Title */}
      <section className="mb-8">
        <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-inverse-surface leading-tight">
          {certificate.course?.title || "Credential"}
        </h1>
      </section>

      {/* Credential Badge Card */}
      <section className="bg-surface-container-low rounded-2xl p-8 flex flex-col items-center justify-center mb-8 space-y-6">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
          <span
            className="material-symbols-outlined text-on-primary text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Issued By</p>
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Acada Global Institute
          </h2>
        </div>
        <p className="text-sm text-primary">
          Conferred on {formatDate(certificate.created_at)}
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Final Score</p>
          <p className="font-headline text-3xl font-black text-on-surface">
            {certificate.milestone?.score || 98}
            <span className="text-lg text-on-surface-variant font-normal">/100</span>
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Completion</p>
          <p className="font-headline text-3xl font-black text-on-surface">
            {certificate.milestone?.hours_spent || 14}
            <span className="text-lg text-on-surface-variant font-normal"> hrs</span>
          </p>
        </div>
      </section>

      {/* Mastered Competencies */}
      <section className="mb-8">
        <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
          Mastered Competencies
        </h3>
        <div className="flex flex-wrap gap-2">
          {competencies.map((comp, idx) => (
            <div
              key={idx}
              className={`rounded-full px-4 py-2 font-label text-xs font-bold uppercase tracking-wider ${
                idx === 0
                  ? "bg-on-surface text-surface"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {comp}
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="space-y-3">
        <button className="w-full bg-primary text-on-primary font-headline font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">account_balance</span>
          View on Blockchain
        </button>
        <button className="w-full bg-surface-container-low text-on-surface font-headline font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">share</span>
          Share PDF Certificate
        </button>
      </section>
    </main>
  );
}

export default function CredentialDetailPage() {
  const { user } = useAuth();

  return (
    <div className="bg-background min-h-screen font-body text-on-surface">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 bg-surface-container-low/80 backdrop-blur-xl shadow-[0_4px_16px_rgba(7,14,29,0.04)]">
        <Link href="/my_credentials" className="material-symbols-outlined text-primary text-2xl active:scale-95">
          arrow_back
        </Link>
        <span className="font-headline font-bold text-on-surface">Acada</span>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-primary-container">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src={
              user?.profileImage ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD_H4UmM_92IJKrQdfw24pccczcx5JEp4iuBrkW5l0SZNjLiXM4ZVdQPnWaziT7D0AmHsGVCQoW8Z6YiegRA8Q_jXfTptMiQjNUA0xYkrY0hKCFv_FXDkaA9vdWmfzxNX17RS1Nr9Z-j-16Z2Ax0rfGVggRrg3SXkyF9oAARZTMF5Al1OEa2XwSdEiJe1QO5cRwB4JSGfqPC_89JStJZWCsD6gEfuOop2CFGZeDu7MKnluAFuolbfXGQThlOG3lpsszyUH-qL-e5A"
            }
          />
        </div>
      </header>

      <Suspense fallback={<main className="px-6 pt-6 pb-24">Loading credential...</main>}>
        <CredentialDetailContent />
      </Suspense>

    </div>
  );
}
