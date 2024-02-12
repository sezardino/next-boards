import { z } from "zod";

export const boardByIdRequestSchema = z.object({
  id: z.string(),
});

export type BoardByIdRequest = z.infer<typeof boardByIdRequestSchema>;

export enum BoardByIdError {
  NotFound = "NotFound",
}

export const boardByIdResponseSchema = z.object({
  error: z.nativeEnum(BoardByIdError),
  board: z.object({
    id: z.string(),
    title: z.string(),
  }),
});
