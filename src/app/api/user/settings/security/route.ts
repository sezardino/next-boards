import { userSecuritySettingsDtoSchema } from "@/services/bll/modules/user/dto";
import { withValidation } from "../../../utils";
import { securitySettingsHandler } from "./security-settings";

export const PATCH = withValidation({
  schema: userSecuritySettingsDtoSchema,
  handler: securitySettingsHandler,
  authorization: true,
});
