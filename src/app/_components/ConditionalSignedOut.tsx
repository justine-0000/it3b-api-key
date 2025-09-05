"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function ConditionalSignedOut({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  // Don’t render until Clerk finishes loading (prevents blinking)
  if (!isLoaded) return null;

  // Hide on keys/docs pages
  if (pathname === "/keys" || pathname === "/docs") return null;

  // Show only if signed out
  if (!isSignedIn) {
    return <>{children}</>;
  }

  return null;
}
