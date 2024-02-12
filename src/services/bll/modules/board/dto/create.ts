import { z } from "zod";

export const createBoardRequestSchema = z.object({
  title: z.string(),
});

export type CreateBoardRequest = z.infer<typeof createBoardRequestSchema>;

export const createBoardResponseSchema = z.object({});

export type CreateBoardResponse = z.infer<typeof createBoardResponseSchema>;
