export type TaskStatus = "inbox" | "today" | "completed";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  /** Status the task belonged to before it was completed, so it can be restored. */
  previousStatus?: Exclude<TaskStatus, "completed">;
  createdAt: string;
  completedAt?: string;
}

export type CreateTaskInput = {
  title: string;
  notes?: string;
};

export type UpdateTaskInput = {
  title?: string;
  notes?: string;
};
