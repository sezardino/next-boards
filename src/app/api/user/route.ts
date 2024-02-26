import { withValidation } from "../utils";
import { getMeHandler } from "./get";

export const GET = withValidation({
  handler: getMeHandler,
  authorization: true,
});
