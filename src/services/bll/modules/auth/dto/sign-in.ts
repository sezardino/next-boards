import { z } from "zod";

export const signInDtoSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export type SignInDto = z.infer<typeof signInDtoSchema>;

export enum SignInError {
  WrongCredentials = "Wrong credentials",
}

export const signInResponseSchema = z.object({
  error: z.nativeEnum(SignInError),
});

export type SignInResponse = z.infer<typeof signInResponseSchema>;
