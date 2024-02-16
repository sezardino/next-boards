import {
  allBoardsDtoSchema,
  createBoardDtoSchema,
} from "@/services/bll/modules/board/dto";
import { withValidation } from "../utils";
import { allBoardsHandler } from "./all-baords";
import { createBoardHandler } from "./create";

export const POST = withValidation({
  schema: createBoardDtoSchema,
  handler: createBoardHandler,
  authorization: true,
});

export const GET = withValidation({
  schema: allBoardsDtoSchema,
  handler: allBoardsHandler,
  authorization: true,
  input: "search",
});
