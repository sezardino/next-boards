import {
  SignUpRequest,
  signUpResponseSchema,
} from "@/services/bll/modules/auth/dto";
import { AbstractApiModule } from "../../helpers";

export class AuthApiModule extends AbstractApiModule {
  signUp(data: SignUpRequest) {
    return this.fetch({
      endpoint: "auth/sign-up",
      config: { method: "POST", data },
      schema: signUpResponseSchema,
    });
  }
}
