import { z } from "zod";

export const signInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export enum SignInError {
  NotFound = "NotFound",
  WrongCredentials = "WrongCredentials",
}

export const signInResponseSchema = z.object({
  error: z.nativeEnum(SignInError),
});

export type SignInResponse = z.infer<typeof signInResponseSchema>;
