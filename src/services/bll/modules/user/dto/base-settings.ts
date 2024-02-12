import { z } from "zod";

export const userBaseSettingsRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UserBaseSettingsRequest = z.infer<
  typeof userBaseSettingsRequestSchema
>;

export const userBaseSettingsResponseSchema = z.object({
  success: z.boolean(),
});

export type UserBaseSettingsResponse = z.infer<
  typeof userBaseSettingsResponseSchema
>;
