import {
  AllBoardsDto,
  CreateBoardDto,
  allBoardsResponseSchema,
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

  all(params: AllBoardsDto) {
    return this.fetch({
      endpoint: "board",
      schema: allBoardsResponseSchema,
      config: { method: "GET", params },
    });
  }
}
