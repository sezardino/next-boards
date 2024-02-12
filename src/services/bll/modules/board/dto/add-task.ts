import { Priority } from "@prisma/client";
import { z } from "zod";

export const addTaskRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  boardId: z.string(),
  columnId: z.string(),
});

export type AddTaskRequest = z.infer<typeof addTaskRequestSchema>;

export enum AddTaskError {
  WrongData = "WrongData",
}

export const addTaskResponseSchema = z.object({
  error: z.nativeEnum(AddTaskError),
});

export type AddTaskResponse = z.infer<typeof addTaskResponseSchema>;
