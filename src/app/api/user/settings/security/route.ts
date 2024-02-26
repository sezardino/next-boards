import { userSecuritySettingsDtoSchema } from "@/services/bll/modules/user/dto";
import { withValidation } from "../../../utils";
import { patchSecuritySettingsHandler } from "./patch";

export const PATCH = withValidation({
  schema: userSecuritySettingsDtoSchema,
  handler: patchSecuritySettingsHandler,
  authorization: true,
});
