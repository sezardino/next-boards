import { z } from "zod";

export const changeTaskColumnDtoSchema = z.object({
  boardId: z.string(),
  taskId: z.string(),
  columnId: z.string(),
  before: z.string().optional(),
});

export type ChangeTaskColumnDto = z.infer<typeof changeTaskColumnDtoSchema>;

export enum ChangeTaskColumnError {
  NotFound = "NotFound",
}

export const changeTaskColumnResponseSchema = z.object({});
