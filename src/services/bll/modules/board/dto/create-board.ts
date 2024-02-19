import { BOARD_ICONS, BoardIcon } from "@/const/icons";
import { z } from "zod";

export const createBoardDtoSchema = z.object({
  title: z.string().max(50),
  description: z.string().max(100),
  icon: z.string().refine((icon) => BOARD_ICONS.includes(icon as BoardIcon), {
    message: "Invalid icon",
    path: ["icon"],
  }),
});

export type CreateBoardDto = z.infer<typeof createBoardDtoSchema>;

export enum CreateBoardError {
  // MAX_BOARDS_COUNT = 10
  MaxLimit = "Max board limit is 10",
}

export const createBoardResponseSchema = z.object({
  board: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
  error: z.nativeEnum(CreateBoardError),
});

export type CreateBoardResponse = z.infer<typeof createBoardResponseSchema>;
