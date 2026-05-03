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

  const userName = appUser?.full_name || "Student";
  const courseTitle = certificate?.course?.title || "Unknown Course";

  return (
    <div className="bg-background min-h-screen font-body text-on-background pb-16">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <Link href="/my_credentials" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-bold text-sm uppercase tracking-widest">Back</span>
        </Link>
        <span className="text-xl font-black tracking-tighter text-primary">Acada Credentials</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl text-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">sync</span>
            <p className="text-on-surface-variant font-bold tracking-widest uppercase text-sm">Loading credential...</p>
          </section>
        ) : error ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl border border-destructive/20 text-center">
            <span className="material-symbols-outlined text-4xl text-destructive mb-4">error</span>
            <p className="text-destructive font-bold">Failed to load credential details.</p>
          </section>
        ) : !certificate ? (
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">search_off</span>
            <p className="text-on-surface-variant mb-6">Credential not found for this account.</p>
            <Link href="/my_credentials" className="inline-block bg-primary text-on-primary font-bold py-3 px-6 rounded-lg hover:bg-primary-dim transition-colors">
              View All Credentials
            </Link>
          </section>
        ) : (
          <div className="space-y-8">
            {/* The Certificate UI */}
            <div className="relative bg-white text-slate-900 border-[12px] border-double border-slate-200 rounded-lg p-12 md:p-24 shadow-2xl overflow-hidden text-center aspect-auto md:aspect-[1.4/1] max-w-full flex flex-col items-center justify-center">
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full"></div>
              
              <div className="mb-6">
                <span className="material-symbols-outlined text-6xl text-primary/80" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">Certificate of Completion</h1>
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-[0.3em] mb-10 font-bold">Acada Web3 Learning Platform</p>
              
              <p className="text-lg md:text-xl text-slate-500 mb-4 font-serif italic">This is to certify that</p>
              
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6 border-b-2 border-slate-100 pb-4 px-8 inline-block">
                {userName}
              </h2>
              
              <p className="text-lg md:text-xl text-slate-500 mb-4 font-serif italic">has successfully completed the course</p>
              
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-12 max-w-2xl leading-tight">
                {courseTitle}
              </h3>
              
              <div className="flex w-full justify-between items-end mt-auto pt-8 border-t border-slate-100">
                <div className="text-left">
                  <p className="font-bold text-slate-800">{formatDate(certificate.created_at).split(',')[0]}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Date Issued</p>
                </div>
                
                <div className="text-center hidden md:block">
                  <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-2 border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">On-Chain Verified</p>
                </div>
                
                <div className="text-right">
                  <p className="font-mono text-xs text-slate-600 font-bold max-w-[120px] truncate" title={certificate.mint_address || undefined}>
                    {certificate.mint_address ? `${certificate.mint_address.substring(0, 8)}...` : "Pending"}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Mint Address</p>
                </div>
              </div>
            </div>
            
            {/* Metadata Info below */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline/30">
               <h3 className="font-bold font-headline mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">link</span>
                 On-Chain Details
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-on-surface-variant bg-surface-container-low p-4 rounded-lg">
                  <div>
                    <strong className="block text-[10px] uppercase tracking-widest mb-1 text-on-surface">Certificate ID</strong>
                    <span className="font-mono text-xs break-all">{certificate.id}</span>
                  </div>
                  <div>
                    <strong className="block text-[10px] uppercase tracking-widest mb-1 text-on-surface">Mint Address</strong>
                    <span className="font-mono text-xs break-all">{certificate.mint_address || "Pending"}</span>
                  </div>
                  <div className="md:col-span-2">
                    <strong className="block text-[10px] uppercase tracking-widest mb-1 text-on-surface">Metadata IPFS URL</strong>
                    {certificate.ipfs_url ? (
                      <a href={certificate.ipfs_url.replace("ipfs://", "https://ipfs.io/ipfs/")} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-xs truncate block">
                        {certificate.ipfs_url}
                      </a>
                    ) : (
                      <span className="font-mono text-xs">N/A</span>
                    )}
                  </div>
               </div>
            </div>
          </div>
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
