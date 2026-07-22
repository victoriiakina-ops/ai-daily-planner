export type TaskStatus = "inbox" | "today" | "completed";

export type Priority = "low" | "medium" | "high";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  /** Status the task belonged to before it was completed, so it can be restored. */
  previousStatus?: Exclude<TaskStatus, "completed">;
  priority: Priority;
  /** ISO date (YYYY-MM-DD) the task is scheduled for, if any. */
  date?: string;
  /** Scheduled time as "HH:mm", if any. */
  time?: string;
  durationMinutes?: number;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export type CreateTaskInput = {
  title: string;
  notes?: string;
  priority?: Priority;
  date?: string;
  time?: string;
  durationMinutes?: number;
};

export type UpdateTaskInput = {
  title?: string;
  notes?: string;
  priority?: Priority;
  /** Pass null to clear, omit to leave unchanged. */
  date?: string | null;
  time?: string | null;
  durationMinutes?: number | null;
  subtasks?: Subtask[];
};
