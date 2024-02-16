import {
  CreateBoardDto,
  createBoardResponseSchema,
} from "@/services/bll/modules/board/dto";
import { AbstractApiModule } from "../../helpers";

export class BoardApiModule extends AbstractApiModule {
  create(data: CreateBoardDto) {
    return this.fetch({
      endpoint: "board",
      schema: createBoardResponseSchema,
      config: { method: "POST", data },
    });
  }
}
