import { withValidation } from "../../utils";
import { getBoardHandler } from "./get";

export const GET = withValidation({
  handler: getBoardHandler,
  authorization: true,
});
