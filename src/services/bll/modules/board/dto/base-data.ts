import { z } from "zod";

export enum BoardBaseDataError {
  NotFound = "Board not found",
}

export const boardBaseDataResponseSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  })
  .or(
    z.object({
      error: z.string(),
    })
  );

export type BoardBaseDataResponse = z.infer<typeof boardBaseDataResponseSchema>;
