import { withValidation } from "@/app/api/utils";
import {
  addColumnDtoSchema,
  updateColumnDtoSchema,
} from "@/services/bll/modules/column/dto";
import { postBoardColumnHandler } from "./post";
import { patchUpdateColumnHandler } from "./patch";

export const POST = withValidation({
  schema: addColumnDtoSchema,
  handler: postBoardColumnHandler,
  authorization: true,
});

export const PATCH = withValidation({
  schema: updateColumnDtoSchema,
  handler: patchUpdateColumnHandler,
  authorization: true,
});
