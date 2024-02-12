import { z } from "zod";

export const signUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

export const signUpResponseSchema = z.object({});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
