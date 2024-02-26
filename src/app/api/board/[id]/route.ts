import { archiveBoardDtoSchema } from "@/services/bll/modules/board/dto";
import { deleteBoardDtoSchema } from "@/services/bll/modules/board/dto/delete";
import { withValidation } from "../../utils";
import { deleteBoardHandler } from "./delete";
import { getBoardInformationHandler } from "./get";
import { patchArchiveBoardHandler } from "./parch";

export const PATCH = withValidation({
  handler: patchArchiveBoardHandler,
  schema: archiveBoardDtoSchema,
  authorization: true,
});

export const DELETE = withValidation({
  handler: deleteBoardHandler,
  schema: deleteBoardDtoSchema,
  authorization: true,
});

export const GET = withValidation({
  handler: getBoardInformationHandler,
  authorization: true,
});
