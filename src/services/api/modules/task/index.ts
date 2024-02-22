import {
  AddTaskDto,
  UpdateTaskDto,
  addTaskResponseSchema,
  updateTaskResponseSchema,
} from "@/services/bll/modules/task/dto";
import { AbstractApiModule } from "../../helpers";

export class TaskApiModule extends AbstractApiModule {
  add(data: AddTaskDto) {
    return this.fetch({
      endpoint: `board/${data.boardId}/task`,
      schema: addTaskResponseSchema,
      config: { method: "POST", data },
    });
  }

  update(data: UpdateTaskDto) {
    return this.fetch({
      endpoint: `board/${data.boardId}/task`,
      schema: updateTaskResponseSchema,
      config: { method: "PATCH", data },
    });
  }
}
