import { z } from "zod";

export const createBoardRequestSchema = z.object({
  title: z.string(),
});

export type CreateBoardRequest = z.infer<typeof createBoardRequestSchema>;

export enum CreateBoardError {
  // MAX_BOARDS_COUNT = 10
  MaxLimit = "Max board limit is 10",
}

export const createBoardResponseSchema = z.object({
  board: z.object({
    id: z.string(),
    title: z.string(),
  }),
  error: z.nativeEnum(CreateBoardError),
});

export type CreateBoardResponse = z.infer<typeof createBoardResponseSchema>;
