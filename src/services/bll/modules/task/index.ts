import { BllModule } from "../../utils";
import {
  AddTaskDto,
  AddTaskError,
  UpdateTaskDto,
  UpdateTaskError,
} from "./dto";

export class TaskBllModule extends BllModule {
  async add(dto: AddTaskDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
        userId: userId,
        columns: { some: { id: dto.columnId } },
      },
      select: { _count: { select: { tasks: true } } },
    });

    if (!neededBoard) this.throw(AddTaskError.WrongData);

    return await this.prismaService.task.create({
      data: {
        title: dto.title,
        order: neededBoard._count.tasks,
        board: { connect: { id: dto.boardId } },
        column: { connect: { id: dto.columnId } },
      },
      select: { id: true, title: true, order: true, priority: true },
    });
  }

  async update(dto: UpdateTaskDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId, userId },
      select: { id: true },
    });

    if (!neededBoard) this.throw(UpdateTaskError.WrongData);

    const neededTask = await this.prismaService.task.findUnique({
      where: { id: dto.taskId, boardId: dto.boardId },
    });

    if (!neededTask) this.throw(UpdateTaskError.WrongData);

    if (dto.order && !dto.newColumnId) {
      await this.prismaService.$transaction(
        dto.order.map((column, index) =>
          this.prismaService.task.update({
            where: {
              id: column,
              columnId: neededTask.columnId,
              boardId: dto.boardId,
            },
            data: { order: index },
          })
        )
      );
    } else if (dto.newColumnId && dto.order) {
      const neededColumn = await this.prismaService.column.findUnique({
        where: { id: dto.newColumnId, boardId: dto.boardId },
        select: { id: true },
      });

      if (!neededColumn) this.throw(UpdateTaskError.WrongData);

      await this.prismaService.$transaction(
        dto.order.map((task, index) =>
          this.prismaService.task.update({
            where: {
              id: task,
              columnId: dto.taskId === task ? dto.newColumnId : undefined,
            },
            data: { order: index },
          })
        )
      );
    }

    return this.prismaService.task.update({
      where: { id: dto.taskId, boardId: dto.boardId },
      data: { title: dto.title },
      select: { id: true, title: true, order: true },
    });
  }
}
