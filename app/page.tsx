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
    // TEMPORARY (presentation recording): always show onboarding, ignoring the
    // completed flag. MUST be reverted to
    //   router.replace(hasCompletedOnboarding() ? "/capture" : "/onboarding");
    // right after the presentation.
    void hasCompletedOnboarding;
    router.replace("/onboarding");
  }, [router]);

  return null;
}
