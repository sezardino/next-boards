import { z } from "zod";

export const signInRequestSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export enum SignInError {
  WrongCredentials = "Wrong credentials",
}

export const signInResponseSchema = z.object({
  error: z.nativeEnum(SignInError),
});

export type SignInResponse = z.infer<typeof signInResponseSchema>;
