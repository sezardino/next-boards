import { withValidation } from "@/app/api/utils";
import { addColumnDtoSchema } from "@/services/bll/modules/board/dto";
import { postBoardColumnHandler } from "./post";

export const POST = withValidation({
  schema: addColumnDtoSchema,
  handler: postBoardColumnHandler,
  authorization: true,
});
