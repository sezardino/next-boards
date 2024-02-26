import { signUpDtoSchema } from "@/services/bll/modules/auth";
import { withValidation } from "../../utils";
import { postSignUpHandler } from "./post";

export const POST = withValidation({
  schema: signUpDtoSchema,
  handler: postSignUpHandler,
  authorization: false,
});
