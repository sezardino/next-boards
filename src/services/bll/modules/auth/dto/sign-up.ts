import { z } from "zod";

export const signUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

export enum SignUpError {
  EmailAlreadyExists = "EmailAlreadyExists",
  WrongCredentials = "WrongCredentials",
}

export const signUpResponseSchema = z.object({
  error: z.nativeEnum(SignUpError),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
