import { z } from "zod";

export const userBaseSettingsRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UserBaseSettingsRequest = z.infer<
  typeof userBaseSettingsRequestSchema
>;

export enum UserBaseSettingsError {
  NotFound = "NotFound",
}

export const userBaseSettingsResponseSchema = z.object({
  error: z.nativeEnum(UserBaseSettingsError),
});

export type UserBaseSettingsResponse = z.infer<
  typeof userBaseSettingsResponseSchema
>;
