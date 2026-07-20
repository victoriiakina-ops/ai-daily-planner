import { Task } from "./types";

const STORAGE_KEY = "planner:tasks";

/** Safely reads the task list from LocalStorage. Returns an empty array on the server or on parse failure. */
export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Task[];
  } catch {
    return [];
  }
}

/** Persists the full task list to LocalStorage. No-ops on the server. */
export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage may be full or unavailable (e.g. private browsing). Fail silently.
  }
}
