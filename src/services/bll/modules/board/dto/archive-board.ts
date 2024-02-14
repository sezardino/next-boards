import { z } from "zod";

export const archiveBoardRequestSchema = z.object({
  id: z.string(),
});

export type ArchiveBoardRequest = z.infer<typeof archiveBoardRequestSchema>;

export enum ArchiveBoardError {
  NotFound = "Board not found",
}

export const archiveBoardResponseSchema = z.object({
  error: z.nativeEnum(ArchiveBoardError),
});

export type ArchiveBoardResponse = z.infer<typeof archiveBoardResponseSchema>;
