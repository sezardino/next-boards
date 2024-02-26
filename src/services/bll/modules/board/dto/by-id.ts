import { EntityStatus } from "@prisma/client";
import { z } from "zod";

export const boardDtoSchema = z.object({
  id: z.string(),
});

export type BoardDto = z.infer<typeof boardDtoSchema>;

export enum BoardError {
  NotFound = "NotFound",
}

const boardSchema = z.object({
  title: z.string(),
  status: z.nativeEnum(EntityStatus),
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

export type Board = z.infer<typeof boardSchema>;

export const boardResponseSchema = boardSchema.or(
  z.object({ error: z.nativeEnum(BoardError) })
);

export type BoardResponse = z.infer<typeof boardResponseSchema>;
