import { withValidation } from "@/app/api/utils";
import { patchBaseBoardDataDtoSchema } from "@/services/bll/modules/board/dto/update-base-data";
import { getBaseDataHandler } from "./get";
import { patchBaseDataHandler } from "./patch";

export const GET = withValidation({
  handler: getBaseDataHandler,
  authorization: true,
});

export const PATCH = withValidation({
  handler: patchBaseDataHandler,
  schema: patchBaseBoardDataDtoSchema,
  authorization: true,
});
