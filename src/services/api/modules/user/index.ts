import {
  UserGeneralSettingsDto,
  UserSecuritySettingsDto,
  meResponseSchema,
  userGeneralSettingsResponseSchema,
  userSecuritySettingsResponseSchema,
} from "@/services/bll/modules/user/dto";
import { AbstractApiModule } from "../../helpers";

export class UserApiModule extends AbstractApiModule {
  me() {
    return this.fetch({
      endpoint: "user",
      schema: meResponseSchema,
      config: { method: "GET" },
    });
  }

  generalSettings(data: UserGeneralSettingsDto) {
    return this.fetch({
      endpoint: "user/settings/general",
      schema: userGeneralSettingsResponseSchema,
      config: { method: "PATCH", data },
    });
  }

  securitySettings(data: UserSecuritySettingsDto) {
    return this.fetch({
      endpoint: "user/settings/security",
      schema: userSecuritySettingsResponseSchema,
      config: { method: "PATCH", data },
    });
  }
}
