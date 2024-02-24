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
        user: { connect: { id: userId } },
      },
      select: { id: true, title: true, order: true, priority: true },
    });
  }

  async update(dto: UpdateTaskDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId, userId },
      select: {
        id: true,
        columns: {
          select: {
            id: true,
            tasks: { select: { id: true } },
            _count: { select: { tasks: true } },
          },
        },
      },
    });

    if (!neededBoard) this.throw(UpdateTaskError.WrongData);

    const neededTask = await this.prismaService.task.findUnique({
      where: { id: dto.taskId, boardId: dto.boardId },
      select: { id: true, columnId: true },
    });

    if (!neededTask) this.throw(UpdateTaskError.WrongData);

    const updatedTask = await this.prismaService.task.update({
      where: { id: dto.taskId, boardId: dto.boardId },
      data: {
        title: dto.title,
        column: dto.newColumnId
          ? { connect: { id: dto.newColumnId } }
          : undefined,
      },
      select: { id: true, title: true, order: true },
    });

    if (dto.order && !dto.newColumnId) {
      await this.prismaService.$transaction(
        dto.order.map((taskId, index) =>
          this.prismaService.task.update({
            where: {
              id: taskId,
              columnId: neededTask.columnId,
              boardId: dto.boardId,
            },
            data: { order: index },
          })
        )
      );
    }

    if (dto.newColumnId) {
      const oldColumnsTasksWithoutUpdated =
        neededBoard.columns
          .find((c) => c.id === neededTask.columnId)
          ?.tasks.filter((t) => t.id !== dto.taskId) || [];

      await this.prismaService.$transaction(
        oldColumnsTasksWithoutUpdated.map((task, index) =>
          this.prismaService.task.update({
            where: { id: task.id },
            data: { order: index },
          })
        )
      );
    }

    return updatedTask;
  }
}
