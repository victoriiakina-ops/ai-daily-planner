import { Priority } from "@/lib/types";
import { AiPlannerService, ExtractedTaskDraft } from "@/lib/ai/types";
import { todayIsoDate } from "@/lib/date";

const URGENT_KEYWORDS = ["терміново", "негайно", "asap", "urgent", "сьогодні"];
const LOW_PRIORITY_KEYWORDS = ["колись", "можливо", "someday", "maybe"];

function splitIntoThoughts(rawInput: string): string[] {
  return rawInput
    .split(/[\n.;]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function guessPriority(line: string): Priority {
  const lower = line.toLowerCase();
  if (URGENT_KEYWORDS.some((word) => lower.includes(word))) return "high";
  if (LOW_PRIORITY_KEYWORDS.some((word) => lower.includes(word))) return "low";
  return "medium";
}

function guessDate(line: string): string | undefined {
  const lower = line.toLowerCase();
  if (lower.includes("сьогодні") || lower.includes("today")) {
    return todayIsoDate();
  }
  return undefined;
}

/**
 * Heuristic, local stand-in for a real AI extraction backend. Deliberately dumb —
 * this exists only to make the capture -> structured-tasks flow demonstrable
 * without a network dependency, behind the same AiPlannerService interface a
 * real implementation will later satisfy.
 */
export const simulatedAiPlannerService: AiPlannerService = {
  async extractTasks(rawInput: string): Promise<ExtractedTaskDraft[]> {
    return splitIntoThoughts(rawInput).map((line) => ({
      title: line,
      priority: guessPriority(line),
      date: guessDate(line),
    }));
  },
};
