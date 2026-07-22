import { Priority } from "@/lib/types";

export interface ExtractedTaskDraft {
  title: string;
  notes?: string;
  priority: Priority;
  /** ISO date (YYYY-MM-DD), if the input implied a specific day. */
  date?: string;
  durationMinutes?: number;
}

export interface AiPlannerService {
  extractTasks(rawInput: string): Promise<ExtractedTaskDraft[]>;
}
