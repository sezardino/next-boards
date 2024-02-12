import { z } from "zod";

export const signInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const signInResponseSchema = z.object({});

export type SignInResponse = z.infer<typeof signInResponseSchema>;
