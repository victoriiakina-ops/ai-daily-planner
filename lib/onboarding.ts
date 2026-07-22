const ONBOARDING_KEY = "planner:onboarding-completed";

/** Safely reads whether onboarding was already completed. False on the server or on failure. */
export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

/** Persists that onboarding was completed. No-ops on the server. */
export function setOnboardingCompleted(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // Storage may be full or unavailable (e.g. private browsing). Fail silently.
  }
}
