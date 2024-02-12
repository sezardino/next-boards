import { z } from "zod";

export const tasksOrderRequestSchema = z.object({
  boardId: z.string(),
  columnId: z.string(),
  tasks: z.array(z.string()),
});

export type TasksOrderRequest = z.infer<typeof tasksOrderRequestSchema>;

export const tasksOrderResponseSchema = z.object({});

export type TasksOrderResponse = z.infer<typeof tasksOrderResponseSchema>;
