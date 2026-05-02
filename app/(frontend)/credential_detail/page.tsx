"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { useCertificates } from "../../lib/api";

function formatDate(value: string | null) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString();
}

export default function CredentialDetailPage() {
  const params = useSearchParams();
  const certId = params.get("id");
  const { appUser, userId } = useAuth();
  const effectiveUserId = appUser?.id ?? userId;
  const { data: certificatesData, isLoading, error } = useCertificates(effectiveUserId);
  const certificate = (certificatesData?.data ?? []).find((item) => item.id === certId);

  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <span className="text-2xl font-black tracking-tighter text-blue-600">Credential Detail</span>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tighter text-inverse-surface mb-4">
            {certificate?.course?.title || "Credential"}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Verifiable learning credential details for on-chain and platform validation.
          </p>
        </section>
        {isLoading ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
            <p className="text-on-surface-variant">Loading credential...</p>
          </section>
        ) : error ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
            <p className="text-destructive">Failed to load credential details.</p>
          </section>
        ) : !certificate ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
            <p className="text-on-surface-variant">Credential not found for this account.</p>
            <Link href="/my_credentials" className="inline-block mt-4 text-primary hover:underline">
              Back to credentials
            </Link>
          </section>
        ) : (
        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl">
          <h2 className="font-headline text-2xl font-bold mb-2">Credential Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Certificate ID:</strong> {certificate.id}</p>
            <p><strong>Course:</strong> {certificate.course?.title || "Unknown"}</p>
            <p><strong>Mint Address:</strong> {certificate.mint_address || "Pending"}</p>
            <p><strong>Milestone ID:</strong> {certificate.milestone_id || "N/A"}</p>
            <p><strong>Milestone Status:</strong> {certificate.milestone?.status || "N/A"}</p>
            <p><strong>Issued:</strong> {formatDate(certificate.created_at)}</p>
            <p><strong>Metadata URL:</strong> {certificate.ipfs_url || "N/A"}</p>
          </div>
          <div className="mt-6">
            <Link href="/my_credentials" className="text-primary hover:underline">
              Back to credentials
            </Link>
          </div>
        </section>
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
