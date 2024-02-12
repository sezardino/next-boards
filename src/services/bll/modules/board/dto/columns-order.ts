import { z } from "zod";

export const columnsOrderRequestSchema = z.object({
  boardId: z.string(),
  columns: z.array(z.string()),
});

export type ColumnsOrderRequest = z.infer<typeof columnsOrderRequestSchema>;

export enum ColumnsOrderError {
  NotFound = "NotFound",
}

export const columnsOrderResponseSchema = z.object({});

export type ColumnsOrderResponse = z.infer<typeof columnsOrderResponseSchema>;
