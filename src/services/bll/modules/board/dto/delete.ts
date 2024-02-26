import { z } from "zod";

export const deleteBoardDtoSchema = z.object({
  id: z.string(),
});

export type DeleteBoardDto = z.infer<typeof deleteBoardDtoSchema>;

export enum DeleteBoardError {
  NotFound = "Board not found",
}

export const deleteBoardResponseSchema = z
  .object({})
  .or(z.object({ error: z.nativeEnum(DeleteBoardError) }));

export type DeleteBoardResponse = z.infer<typeof deleteBoardResponseSchema>;
