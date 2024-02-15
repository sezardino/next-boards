import { z } from "zod";

export const userBaseSettingsDtoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UserBaseSettingsDto = z.infer<typeof userBaseSettingsDtoSchema>;

export enum UserBaseSettingsError {
  NotFound = "NotFound",
}

export const userBaseSettingsResponseSchema = z.object({
  error: z.nativeEnum(UserBaseSettingsError),
});

export type UserBaseSettingsResponse = z.infer<
  typeof userBaseSettingsResponseSchema
>;
