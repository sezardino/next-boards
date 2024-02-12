import { z } from "zod";

export const userPasswordSettingsRequestSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type UserPasswordSettingsRequest = z.infer<
  typeof userPasswordSettingsRequestSchema
>;

export const userPasswordSettingsResponseSchema = z.object({
  success: z.boolean(),
});

export type UserPasswordSettingsResponse = z.infer<
  typeof userPasswordSettingsResponseSchema
>;
