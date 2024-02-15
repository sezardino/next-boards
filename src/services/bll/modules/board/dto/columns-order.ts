import { z } from "zod";

export const columnsOrderDtoSchema = z.object({
  boardId: z.string(),
  columns: z.array(z.string()),
});

export type ColumnsOrderDto = z.infer<typeof columnsOrderDtoSchema>;

export enum ColumnsOrderError {
  NotFound = "NotFound",
}

export const columnsOrderResponseSchema = z.object({});

export type ColumnsOrderResponse = z.infer<typeof columnsOrderResponseSchema>;
