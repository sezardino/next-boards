import { z } from "zod";

export const updateTaskDtoSchema = z.object({
  boardId: z.string(),
  newColumnId: z.string().optional(),
  taskId: z.string(),
  title: z.string().optional(),
  order: z.array(z.string()).optional(),
});

export enum UpdateTaskError {
  WrongData = "WrongData",
  BoardArchived = "BoardArchived",
}

export type UpdateTaskDto = z.infer<typeof updateTaskDtoSchema>;

export const updateTaskResponseSchema = z
  .object({})
  .or(z.object({ error: z.nativeEnum(UpdateTaskError) }));

export type UpdateTaskResponse = z.infer<typeof updateTaskResponseSchema>;
