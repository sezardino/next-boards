import { z } from "zod";

export const addColumnRequestSchema = z.object({
  boardId: z.string(),
  title: z.string(),
});

export type AddColumnRequest = z.infer<typeof addColumnRequestSchema>;

export enum AddColumnError {
  BoardNotFound = "BoardNotFound",
}

export const addColumnResponseSchema = z.object({});
