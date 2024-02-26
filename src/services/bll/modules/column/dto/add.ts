import { z } from "zod";

export const addColumnDtoSchema = z.object({
  boardId: z.string(),
  title: z.string(),
});

export type AddColumnDto = z.infer<typeof addColumnDtoSchema>;

export enum AddColumnError {
  BoardNotFound = "BoardNotFound",
  BoardArchived = "Board Archived",
}

export const addColumnResponseSchema = z
  .object({})
  .or(z.object({ error: z.nativeEnum(AddColumnError) }));

export type AddColumnResponse = z.infer<typeof addColumnResponseSchema>;
