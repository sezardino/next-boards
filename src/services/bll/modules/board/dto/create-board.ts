import { z } from "zod";

export const createBoardDtoSchema = z.object({
  title: z.string(),
});

export type CreateBoardDto = z.infer<typeof createBoardDtoSchema>;

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
