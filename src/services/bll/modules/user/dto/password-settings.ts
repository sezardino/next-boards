import { z } from "zod";

export const userPasswordSettingsDtoSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type UserPasswordSettingsDto = z.infer<
  typeof userPasswordSettingsDtoSchema
>;

export enum UserPasswordSettingsError {
  NotMatch = "NotMatch",
  NotFound = "NotFound",
}

export const userPasswordSettingsResponseSchema = z.object({
  success: z.boolean(),
});

export type UserPasswordSettingsResponse = z.infer<
  typeof userPasswordSettingsResponseSchema
>;
