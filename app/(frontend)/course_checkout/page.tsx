"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { useCourse } from "../../lib/api";
import { toast } from "sonner";

function CheckoutContent() {
  const { idToken, user } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: courseData, error, isLoading } = useCourse(id || "");
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "fiat">("crypto");

  const course = courseData?.data;
  const gasFee = 0.0024;
  const platformFee = 0.0;
  const total = (course?.price_usdc || 0) + gasFee + platformFee;

  const handleConfirmEnrol = async () => {
    if (!course) return;

    setIsProcessing(true);
    try {
      const fakeTxRef = `sol_${Math.random().toString(36).substring(7)}`;

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          course_id: course.id,
          amount: course.price_usdc,
          currency: "USDC",
          transaction_ref: fakeTxRef,
        }),
      });

      const payload = (await res.json()) as {
        data?: { transaction_ref?: string | null };
        error?: string;
      };

      if (!res.ok) {
        throw new Error(payload.error || "Failed to process payment");
      }

      toast.success("Enrollment successful!");
      const query = new URLSearchParams({
        id: course.id,
        tx: payload.data?.transaction_ref || fakeTxRef,
      });
      router.push(`/enrolment_confirmation?${query.toString()}`);
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="px-6 pt-6 pb-24">
        <div className="h-32 rounded-xl bg-surface-container-low animate-pulse mb-4"></div>
        <div className="h-24 rounded-xl bg-surface-container-low animate-pulse"></div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="px-6 pt-6 pb-24">
        <div className="rounded-xl bg-destructive/10 text-destructive p-6 mb-4">
          Course not found
        </div>
        <Link href="/student_home" className="text-primary hover:underline font-headline font-bold">
          Return to Courses
        </Link>
      </main>
    );
  }

  return (
    <main className="px-6 pt-6 pb-24">
      {/* Page Title */}
      <section className="mb-8">
        <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-inverse-surface mb-2">
          Checkout
        </h1>
        <p className="text-on-surface-variant">
          Review your enrollment details.
        </p>
      </section>

      {/* Course Card */}
      <section className="bg-surface-container-lowest rounded-xl p-5 mb-8 flex gap-4">
        <div className="w-20 h-20 bg-linear-to-br from-primary/20 to-primary/5 rounded-lg shrink-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Advanced Course</p>
          <h3 className="font-headline font-bold text-lg text-on-surface mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {course.price_usdc} ETH / ${(course.price_usdc * 299).toFixed(2)}
          </p>
        </div>
      </section>

      {/* Course Details */}
      <section className="bg-surface-container-low rounded-xl p-4 mb-8 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
          <span className="text-on-surface">Certified Path</span>
          <span className="ml-auto text-on-surface-variant">12 Modules</span>
        </div>
      </section>

      {/* Payment Method */}
      <section className="mb-8">
        <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
          Payment Method
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setPaymentMethod("crypto")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl font-headline font-bold text-sm transition-all ${
              paymentMethod === "crypto"
                ? "bg-on-surface text-surface"
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined">bitcoin</span>
            Crypto
          </button>
          <button
            onClick={() => setPaymentMethod("fiat")}
            disabled
            className="w-full flex items-center gap-3 p-4 rounded-xl font-headline font-bold text-sm bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">credit_card</span>
            Fiat
          </button>
        </div>
      </section>

      {/* Wallet Connection */}
      <section className="bg-surface-container-low rounded-xl p-4 mb-8 border border-primary/20">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3 font-bold">Connected Wallet</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">0x71C...4f92</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Solana Mainnet</p>
            </div>
          </div>
          <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
            Change
          </button>
        </div>
      </section>

      {/* Fee Breakdown */}
      <section className="space-y-2 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Gas Fee Estimate</span>
          <span className="font-headline font-bold text-on-surface">0.0024 ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Platform Fee</span>
          <span className="font-headline font-bold text-on-surface">0.0000 ETH</span>
        </div>
      </section>

      {/* Total */}
      <section className="bg-surface-container-low rounded-xl p-4 mb-8">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Total Amount</span>
          <span className="text-xs text-on-surface-variant">≈ ${(total * 2400).toFixed(2)} USD</span>
        </div>
        <div className="font-headline font-black text-2xl text-on-surface">
          {total.toFixed(4)} <span className="text-sm text-on-surface-variant font-normal">ETH</span>
        </div>
      </section>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmEnrol}
        disabled={isProcessing}
        className="w-full bg-primary text-on-primary font-headline font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 mb-4"
      >
        {isProcessing ? "Processing..." : "Confirm & Enrol"}
      </button>

      {/* Terms */}
      <p className="text-[10px] text-on-surface-variant text-center leading-relaxed uppercase tracking-widest">
        By confirming, you agree to Acada's{" "}
        <Link href="#" className="underline text-primary">
          Terms of Service
        </Link>{" "}
        and acknowledge the non-refundable nature of digital course assets.
      </p>
    </main>
  );
}

export default function CourseCheckoutPage() {
  const { user } = useAuth();

  return (
    <div className="bg-background min-h-screen font-body text-on-surface">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 bg-surface-container-low/80 backdrop-blur-xl shadow-[0_4px_16px_rgba(7,14,29,0.04)]">
        <Link href="/student_home" className="material-symbols-outlined text-primary text-2xl active:scale-95">
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

      <Suspense fallback={<div className="px-6 pt-6 pb-24 text-center">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>

    </div>
  );
}
