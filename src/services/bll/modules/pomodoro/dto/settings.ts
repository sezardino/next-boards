import { z } from "zod";

export const pomodoroSettingsRequestSchema = z.object({
  interval: z.number().int().positive().optional(),
  break: z.number().int().positive().optional(),
  rounds: z.number().int().positive().max(10).optional(),
});

export type PomodoroSettingsRequest = z.infer<
  typeof pomodoroSettingsRequestSchema
>;

export const pomodoroSettingsResponseSchema = z.object({
  success: z.boolean(),
});

export type PomodoroSettingsResponse = z.infer<
  typeof pomodoroSettingsResponseSchema
>;
