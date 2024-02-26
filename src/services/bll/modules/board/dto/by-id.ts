import { z } from "zod";

export const boardViewDtoSchema = z.object({
  id: z.string(),
});

export type BoardViewDto = z.infer<typeof boardViewDtoSchema>;

export enum BoardViewError {
  NotFound = "NotFound",
}

const boardViewSchema = z.object({
  columns: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      tasks: z.array(
        z.object({
          id: z.string(),
        })
      ),
    })
  ),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      columnId: z.string(),
    })
  ),
});

export type BoardView = z.infer<typeof boardViewSchema>;

export const boardViewResponseSchema = boardViewSchema.or(
  z.object({ error: z.nativeEnum(BoardViewError) })
);

export type BoardViewResponse = z.infer<typeof boardViewResponseSchema>;
