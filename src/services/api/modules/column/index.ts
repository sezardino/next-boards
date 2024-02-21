import {
  AddColumnDto,
  UpdateColumnDto,
  addColumnResponseSchema,
  updateColumnResponseSchema,
} from "@/services/bll/modules/column/dto";
import { AbstractApiModule } from "../../helpers";

export class ColumnApiModule extends AbstractApiModule {
  add(data: AddColumnDto) {
    return this.fetch({
      endpoint: `board/${data.boardId}/column`,
      schema: addColumnResponseSchema,
      config: { method: "POST", data },
    });
  }

  update(data: UpdateColumnDto) {
    return this.fetch({
      endpoint: `board/${data.boardId}/column`,
      schema: updateColumnResponseSchema,
      config: { method: "PATCH", data },
    });
  }
}
