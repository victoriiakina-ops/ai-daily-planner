"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedOnboarding } from "@/lib/onboarding";

/**
 * The onboarding flag lives in LocalStorage, so this gate can only resolve on
 * the client. Renders nothing until it does, to avoid a flash of the wrong screen.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(hasCompletedOnboarding() ? "/capture" : "/onboarding");
  }, [router]);

  return null;
}
