"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/auth/context";

// Add any other public routes here
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/sign_up"
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // Only redirect after component mounts to avoid hydration mismatches
    if (isMounted && !isLoading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [isLoading, user, pathname, router, isPublicRoute, isMounted]);

  // Don't render anything until mounted to avoid hydration errors
  if (!isMounted) {
    return null;
  }

  // Show loading spinner while checking auth state on protected routes
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prevent rendering protected content if not authenticated (before redirect happens)
  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
