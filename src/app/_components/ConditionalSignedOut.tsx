"use client";

import { usePathname } from "next/navigation";
import { SignedOut } from "@clerk/nextjs";

export function ConditionalSignedOut({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide cards on /keys and /docs
  if (pathname === "/keys" || pathname === "/docs") return null;

  return <SignedOut>{children}</SignedOut>;
}
