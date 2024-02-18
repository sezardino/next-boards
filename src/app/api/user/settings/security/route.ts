import { bllService } from "@/services/bll";
import { userSecuritySettingsDtoSchema } from "@/services/bll/modules/user/dto";
import { withValidation } from "../../../utils";

export const PATCH = withValidation({
  schema: userSecuritySettingsDtoSchema,
  handler: bllService.user.securitySettings,
  authorization: true,
});
