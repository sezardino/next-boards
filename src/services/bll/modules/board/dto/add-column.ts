import { z } from "zod";

export const addColumnDtoSchema = z.object({
  boardId: z.string(),
  title: z.string(),
});

export type AddColumnDto = z.infer<typeof addColumnDtoSchema>;

export enum AddColumnError {
  BoardNotFound = "BoardNotFound",
}

export const addColumnResponseSchema = z.object({});
