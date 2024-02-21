import { z } from "zod";

export const boardDtoSchema = z.object({
  id: z.string(),
});

export type BoardDto = z.infer<typeof boardDtoSchema>;

export enum BoardError {
  NotFound = "NotFound",
}

export const boardResponseSchema = z
  .object({
    board: z.object({
      id: z.string(),
      title: z.string(),
    }),
  })
  .or(z.object({ error: z.nativeEnum(BoardError) }));

export type BoardResponse = z.infer<typeof boardResponseSchema>;
