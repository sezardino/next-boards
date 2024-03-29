import { z } from "zod";

export const signUpDtoSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export type SignUpDto = z.infer<typeof signUpDtoSchema>;

export enum SignUpError {
  LoginAlreadyExists = "Login is already in use",
  WrongCredentials = "Wrong credentials",
}

export const signUpResponseSchema = z.object({
  error: z.nativeEnum(SignUpError).optional(),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
