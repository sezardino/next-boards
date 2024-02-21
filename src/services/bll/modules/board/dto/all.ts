import { EntityStatus } from "@prisma/client";
import { z } from "zod";

export const allBoardsDtoSchema = z.object({
  search: z.string().optional(),
  status: z.enum([EntityStatus.ACTIVE, EntityStatus.INACTIVE]).optional(),
});

export type AllBoardsDto = z.infer<typeof allBoardsDtoSchema>;

export const allBoardsResponseSchema = z.object({
  boards: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      status: z.nativeEnum(EntityStatus),
      _count: z.object({
        columns: z.number(),
        tasks: z.number(),
      }),
    })
  ),
});

export type AllBoardsResponse = z.infer<typeof allBoardsResponseSchema>;
