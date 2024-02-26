import { z } from "zod";

export const updateColumnDtoSchema = z.object({
  boardId: z.string(),
  columnId: z.string(),
  title: z.string().optional(),
  order: z.array(z.string()).optional(),
});

export type UpdateColumnDto = z.infer<typeof updateColumnDtoSchema>;

export enum UpdateColumnError {
  NotFound = "Not found",
}

export const updateColumnResponseSchema = z.object({});

export type UpdateColumnResponse = z.infer<typeof updateColumnResponseSchema>;
