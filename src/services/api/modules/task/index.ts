import { AddTaskDto, addTaskDtoSchema } from "@/services/bll/modules/task/dto";
import { AbstractApiModule } from "../../helpers";

export class TaskApiModule extends AbstractApiModule {
  add(data: AddTaskDto) {
    return this.fetch({
      endpoint: `board/${data.boardId}/task`,
      schema: addTaskDtoSchema,
      config: { method: "POST", data },
    });
  }
}
