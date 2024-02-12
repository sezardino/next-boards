import { z } from "zod";

export const changeTaskColumnRequestSchema = z.object({
  boardId: z.string(),
  taskId: z.string(),
  columnId: z.string(),
  before: z.string().optional(),
});

export type ChangeTaskColumnRequest = z.infer<
  typeof changeTaskColumnRequestSchema
>;

export enum ChangeTaskColumnError {
  NotFound = "NotFound",
}

export const changeTaskColumnResponseSchema = z.object({});
