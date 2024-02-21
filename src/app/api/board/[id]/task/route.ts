import { withValidation } from "@/app/api/utils";
import { postBoardTaskHandler } from "./post";
import { addTaskDtoSchema } from "@/services/bll/modules/task/dto";

export const POST = withValidation({
  schema: addTaskDtoSchema,
  handler: postBoardTaskHandler,
  authorization: true,
});
