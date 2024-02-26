import { z } from "zod";

export enum DeleteBoardError {
  NotFound = "Board not found",
}

export const deleteBoardResponseSchema = z
  .object({})
  .or(z.object({ error: z.nativeEnum(DeleteBoardError) }));

export type DeleteBoardResponse = z.infer<typeof deleteBoardResponseSchema>;
