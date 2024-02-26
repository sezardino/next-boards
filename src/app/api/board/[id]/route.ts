import { archiveBoardDtoSchema } from "@/services/bll/modules/board/dto";
import { deleteBoardDtoSchema } from "@/services/bll/modules/board/dto/delete";
import { withValidation } from "../../utils";
import { getBoardHandler } from "./view/get";

export const PATCH = withValidation({
  handler: getBoardHandler,
  schema: archiveBoardDtoSchema,
  authorization: true,
});

export const DELETE = withValidation({
  handler: getBoardHandler,
  schema: deleteBoardDtoSchema,
  authorization: true,
});
