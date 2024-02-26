import { z } from "zod";

export const userGeneralSettingsDtoSchema = z.object({
  name: z.string().optional(),
  login: z.string().optional(),
});

export type UserGeneralSettingsDto = z.infer<
  typeof userGeneralSettingsDtoSchema
>;

export enum UserGeneralSettingsError {
  NotFound = "User not found",
}

export const userGeneralSettingsResponseSchema = z.object({
  user: z
    .object({
      id: z.string(),
      login: z.string(),
      name: z.string(),
    })
    .optional(),
  error: z.nativeEnum(UserGeneralSettingsError).optional(),
});

export type UserGeneralSettingsResponse = z.infer<
  typeof userGeneralSettingsResponseSchema
>;
