"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { useCourse } from "../../lib/api";
import { toast } from "sonner";

function CheckoutContent() {
  const { idToken } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: courseData, error, isLoading } = useCourse(id || "");
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const course = courseData?.data;

  const handlePayAndEnroll = async () => {
    if (!course) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          course_id: course.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to enroll");
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("last_enrolled_course_id", course.id);
      }
      toast.success("Enrollment successful!");
      router.push(`/enrolment_confirmation?course_id=${course.id}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An error occurred during enrollment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse">Loading checkout details...</div>;
  }

  if (error || !course) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-destructive">Course not found</h2>
        <Link href="/student_home" className="text-primary hover:underline mt-4 inline-block">
          Return to Browse
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <section className="mb-12">
        <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-inverse-surface mb-4">
          Checkout
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Confirm your details and complete the enrollment for <strong>{course.title}</strong>.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant">
            <h2 className="font-headline text-2xl font-bold mb-6">Payment Method</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">Solana Wallet (USDC)</h4>
                  <p className="text-xs text-on-surface-variant">Pay with stablecoin for instant access</p>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-primary"></div>
              </div>
              <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined">payments</span>
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">Fiat (Disabled)</h4>
                  <p className="text-xs text-on-surface-variant">Credit/Debit cards not supported yet</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pricing Sidebar */}
        <div className="space-y-6">
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-xl border border-outline-variant sticky top-24">
            <h3 className="font-headline font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 pb-4 border-b border-outline-variant">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Course Price</span>
                <span className="font-bold">${course.price_usdc}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Platform Fee</span>
                <span className="font-bold text-primary">FREE</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 mb-8">
              <span className="font-bold text-inverse-surface text-lg">Total</span>
              <span className="font-black text-2xl text-primary">${course.price_usdc} USDC</span>
            </div>
            <button
              onClick={handlePayAndEnroll}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-primary text-on-primary font-headline font-extrabold text-lg tracking-tight shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isProcessing ? "Enrolling..." : "Enroll Now"}
            </button>
            <p className="text-[10px] text-on-surface-variant mt-4 text-center leading-tight uppercase tracking-widest font-bold">
              Demo mode enrollment
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function CourseCheckoutPage() {
  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <Link href="/student_home">
          <span className="text-2xl font-black tracking-tighter text-blue-600">Acada</span>
        </Link>
      </header>
      <Suspense fallback={<div className="p-10 text-center">Loading checkout...</div>}>
        <CheckoutContent />
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
