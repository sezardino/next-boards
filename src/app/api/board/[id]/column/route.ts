import { withValidation } from "@/app/api/utils";
import { postBoardColumnHandler } from "./post";
import { addColumnDtoSchema } from "@/services/bll/modules/column/dto";

export const POST = withValidation({
  schema: addColumnDtoSchema,
  handler: postBoardColumnHandler,
  authorization: true,
});
