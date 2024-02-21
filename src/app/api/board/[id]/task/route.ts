import { withValidation } from "@/app/api/utils";
import { addTaskDtoSchema } from "@/services/bll/modules/board/dto";
import { postBoardTaskHandler } from "./post";

export const POST = withValidation({
  schema: addTaskDtoSchema,
  handler: postBoardTaskHandler,
  authorization: true,
});
