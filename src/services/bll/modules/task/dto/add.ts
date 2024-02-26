import { Priority } from "@prisma/client";
import { z } from "zod";

export const addTaskDtoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  boardId: z.string(),
  columnId: z.string(),
});

export type AddTaskDto = z.infer<typeof addTaskDtoSchema>;

export enum AddTaskError {
  WrongData = "WrongData",
  BoardArchived = "BoardArchived",
}

export const addTaskResponseSchema = z.object({}).or(
  z.object({
    error: z.nativeEnum(AddTaskError),
  })
);

export type AddTaskResponse = z.infer<typeof addTaskResponseSchema>;
