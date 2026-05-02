"use client";

import useSWR from "swr";
import { useAuth } from "@/app/lib/auth/context";

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export function useWeb3Eligible(courseId?: string) {
  const { idToken } = useAuth();
  return useSWR(idToken && courseId ? ["/api/web3/eligible", idToken, courseId] : null, async () => {
    const res = await fetch("/api/web3/eligible", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ course_id: courseId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });
}

export async function requestRewardClaim(token: string, courseId: string, milestoneId?: string) {
  const res = await fetch("/api/web3/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ course_id: courseId, milestone_id: milestoneId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function requestPurchaseQuote(token: string, courseId: string, rewardTokensToBurn: number) {
  const res = await fetch("/api/web3/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ course_id: courseId, rewardTokensToBurn }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function issueCertificate(token: string, milestoneId: string) {
  const res = await fetch("/api/web3/certificates/issue", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ milestone_id: milestoneId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const web3RelayFetcher = fetcher;
