import { Task } from "./types";

const STORAGE_KEY = "planner:tasks";

/** Backfills fields added after a task may have been persisted, so every consumer can treat Task fields as always-present. */
function normalizeTask(task: Task): Task {
  return {
    ...task,
    priority: task.priority ?? "medium",
    subtasks: task.subtasks ?? [],
  };
}

/** Safely reads the task list from LocalStorage. Returns an empty array on the server or on parse failure. */
export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as Task[]).map(normalizeTask);
  } catch {
    return [];
  }
}

/**
 * Persists the full task list to LocalStorage. No-ops on the server.
 *
 * A dropped write here is invisible until the next fresh load re-reads the
 * (stale) previous snapshot, silently reverting whatever change triggered this
 * save — e.g. a completed task reappearing as incomplete. This can happen from
 * transient write failures (quota pressure, momentary device I/O issues), so a
 * single failed attempt retries once before giving up.
 */
export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify(tasks);
  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    try {
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch (retryError) {
      console.error("Failed to persist tasks to LocalStorage (after retry):", retryError);
    }
  }
}
