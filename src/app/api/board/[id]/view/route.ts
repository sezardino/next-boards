import { withValidation } from "@/app/api/utils";
import { getBoardHandler } from "./get";

export const GET = withValidation({
  handler: getBoardHandler,
  authorization: true,
});
