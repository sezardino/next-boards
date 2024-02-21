import { z } from "zod";

export const tasksOrderDtoSchema = z.object({
  boardId: z.string(),
  columnId: z.string(),
  tasks: z.array(z.string()),
});

export type TasksOrderDto = z.infer<typeof tasksOrderDtoSchema>;

export const tasksOrderResponseSchema = z.object({});

export type TasksOrderResponse = z.infer<typeof tasksOrderResponseSchema>;
