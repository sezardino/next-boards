import { EntityStatus } from "@prisma/client";
import { z } from "zod";

export enum BoardInformationError {
  NotFound = "NotFound",
}

const boardInformationSchema = z.object({
  title: z.string(),
  status: z.nativeEnum(EntityStatus),
});

export type BoardInformation = z.infer<typeof boardInformationSchema>;

export const boardInformationResponseSchema = boardInformationSchema.or(
  z.object({ error: z.nativeEnum(BoardInformationError) })
);

export type BoardInformationResponse = z.infer<
  typeof boardInformationResponseSchema
>;
