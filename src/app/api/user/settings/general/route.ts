import { userGeneralSettingsDtoSchema } from "@/services/bll/modules/user/dto";
import { withValidation } from "../../../utils";
import { generalSettingsHandler } from "./general-settings";

export const PATCH = withValidation({
  schema: userGeneralSettingsDtoSchema,
  handler: generalSettingsHandler,
  authorization: true,
});
