import { withValidation } from "@/app/api/utils";
import {
  addTaskDtoSchema,
  updateTaskDtoSchema,
} from "@/services/bll/modules/task/dto";
import { patchBoardTaskHandler } from "./patch";
import { postBoardTaskHandler } from "./post";

export const POST = withValidation({
  schema: addTaskDtoSchema,
  handler: postBoardTaskHandler,
  authorization: true,
});

export const PATCH = withValidation({
  schema: updateTaskDtoSchema,
  handler: patchBoardTaskHandler,
  authorization: true,
});
