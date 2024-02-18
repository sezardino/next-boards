import { z } from "zod";

export const userSecuritySettingsDtoSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type UserSecuritySettingsDto = z.infer<
  typeof userSecuritySettingsDtoSchema
>;

export enum UserSecuritySettingsError {
  NotMatch = "Wrong password",
  NotFound = "User not found",
}

export const userSecuritySettingsResponseSchema = z.object({
  error: z.string().optional(),
});

export type UserSecuritySettingsResponse = z.infer<
  typeof userSecuritySettingsResponseSchema
>;
