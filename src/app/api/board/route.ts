import {
  allBoardsDtoSchema,
  createBoardDtoSchema,
} from "@/services/bll/modules/board/dto";
import { withValidation } from "../utils";
import { getAllBoardsHandler } from "./get";
import { postCreateBoardHandler } from "./post";

export const POST = withValidation({
  schema: createBoardDtoSchema,
  handler: postCreateBoardHandler,
  authorization: true,
});

export const GET = withValidation({
  schema: allBoardsDtoSchema,
  handler: getAllBoardsHandler,
  authorization: true,
  input: "search",
});
