import { z } from "zod";

export enum PatchBoardBaseDataError {
  NotFound = "Board not found",
}

export const patchBaseBoardDataDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const patchBaseBoardDataResponseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  })
  .or(
    z.object({
      error: z.string(),
    })
  );

export type PatchBoardBaseDataResponse = z.infer<
  typeof patchBaseBoardDataResponseSchema
>;

export type PatchBoardBaseDataDto = z.infer<typeof patchBaseBoardDataDtoSchema>;
