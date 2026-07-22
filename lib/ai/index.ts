import { AiPlannerService } from "@/lib/ai/types";
import { simulatedAiPlannerService } from "@/lib/ai/simulatedAiPlannerService";

/**
 * Single seam between capture UI/business logic and whatever extracts structured
 * tasks from raw text. Swap the returned implementation for a real, API-backed
 * one later without touching any caller.
 */
export function getAiPlannerService(): AiPlannerService {
  return simulatedAiPlannerService;
}

export type { AiPlannerService, ExtractedTaskDraft } from "@/lib/ai/types";
