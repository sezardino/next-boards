import { withValidation } from "../utils";
import { meHandler } from "./me";

export const GET = withValidation({
  handler: meHandler,
  authorization: true,
});
