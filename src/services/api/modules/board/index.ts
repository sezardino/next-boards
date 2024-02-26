import {
  AllBoardsDto,
  ArchiveBoardDto,
  CreateBoardDto,
  allBoardsResponseSchema,
  archiveBoardResponseSchema,
  boardBaseDataResponseSchema,
  boardViewResponseSchema,
  createBoardResponseSchema,
} from "@/services/bll/modules/board/dto";
import {
  DeleteBoardDto,
  deleteBoardResponseSchema,
} from "@/services/bll/modules/board/dto/delete";
import { boardInformationResponseSchema } from "@/services/bll/modules/board/dto/information";
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

  information(id: string) {
    return this.fetch({
      endpoint: `board/${id}`,
      schema: boardInformationResponseSchema,
      config: { method: "GET" },
    });
  }

  view(id: string) {
    return this.fetch({
      endpoint: `board/${id}/view`,
      schema: boardViewResponseSchema,
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

  delete(data: DeleteBoardDto) {
    return this.fetch({
      endpoint: `board/${data.id}`,
      schema: deleteBoardResponseSchema,
      config: { method: "DELETE", data },
    });
  }

  archive(data: ArchiveBoardDto) {
    return this.fetch({
      endpoint: `board/${data.id}`,
      schema: archiveBoardResponseSchema,
      config: { method: "PATCH", data },
    });
  }
}
