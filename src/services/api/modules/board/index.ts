import {
  AllBoardsDto,
  CreateBoardDto,
  allBoardsResponseSchema,
  boardBaseDataResponseSchema,
  boardResponseSchema,
  createBoardResponseSchema,
} from "@/services/bll/modules/board/dto";
import {
  PatchBoardBaseDataDto,
  patchBaseBoardDataResponseSchema,
} from "@/services/bll/modules/board/dto/update-base-data";
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

  board(id: string) {
    return this.fetch({
      endpoint: `board/${id}`,
      schema: boardResponseSchema,
      config: { method: "GET" },
    });
  }

  baseData(id: string) {
    return this.fetch({
      endpoint: `board/${id}/base-data`,
      schema: boardBaseDataResponseSchema,
      config: { method: "GET" },
    });
  }

  updateBaseData(data: PatchBoardBaseDataDto & { id: string }) {
    return this.fetch({
      endpoint: `board/${data.id}/base-data`,
      schema: patchBaseBoardDataResponseSchema,
      config: { method: "PATCH", data },
    });
  }
}
