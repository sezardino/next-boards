import {
  AddColumnDto,
  addColumnResponseSchema,
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
}
