import { z } from "zod";

export const archiveBoardDtoSchema = z.object({
  id: z.string(),
});

export type ArchiveBoardDto = z.infer<typeof archiveBoardDtoSchema>;

export enum ArchiveBoardError {
  NotFound = "Board not found",
  BoardArchived = "Already archived",
}

export const archiveBoardResponseSchema = z.object({
  error: z.nativeEnum(ArchiveBoardError).optional(),
});

export type ArchiveBoardResponse = z.infer<typeof archiveBoardResponseSchema>;
