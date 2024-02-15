import { z } from "zod";

export const boardByIdDtoSchema = z.object({
  id: z.string(),
});

export type BoardByIdDto = z.infer<typeof boardByIdDtoSchema>;

export enum BoardByIdError {
  NotFound = "NotFound",
}

export const boardByIdResponseSchema = z.object({
  error: z.nativeEnum(BoardByIdError),
  board: z.object({
    id: z.string(),
    title: z.string(),
  }),
});
