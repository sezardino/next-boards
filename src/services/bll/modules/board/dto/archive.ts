import { z } from "zod";

export const archiveBoardDtoSchema = z.object({
  id: z.string(),
});

export type ArchiveBoardDto = z.infer<typeof archiveBoardDtoSchema>;

export enum ArchiveBoardError {
  NotFound = "Board not found",
}

export const archiveBoardResponseSchema = z.object({
  error: z.nativeEnum(ArchiveBoardError),
});

export type ArchiveBoardResponse = z.infer<typeof archiveBoardResponseSchema>;
