import { z } from "zod";

export const userSecuritySettingsDtoSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type UserSecuritySettingsDto = z.infer<
  typeof userSecuritySettingsDtoSchema
>;

export enum UserSecuritySettingsError {
  NotMatch = "NotMatch",
  NotFound = "NotFound",
}

export const userSecuritySettingsResponseSchema = z.object({
  success: z.boolean(),
});

export type UserSecuritySettingsResponse = z.infer<
  typeof userSecuritySettingsResponseSchema
>;
