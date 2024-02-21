import { userGeneralSettingsDtoSchema } from "@/services/bll/modules/user/dto";
import { withValidation } from "../../../utils";
import { patchGeneralSettingsHandler } from "./patch";

export const PATCH = withValidation({
  schema: userGeneralSettingsDtoSchema,
  handler: patchGeneralSettingsHandler,
  authorization: true,
});
