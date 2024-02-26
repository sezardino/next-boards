import { z } from "zod";

export enum MeResponseError {
  NotFound = "Not Found",
}

export const meResponseSchema = z.object({
  id: z.string(),
  login: z.string(),
  name: z.string(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
