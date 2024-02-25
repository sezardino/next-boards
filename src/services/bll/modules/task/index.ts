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
    const { boardId, taskId, newColumnId, order, title } = dto;

    const neededTask = await this.prismaService.task.findUnique({
      where: { id: taskId, boardId, userId },
      select: { id: true, columnId: true },
    });

    if (!neededTask) this.throw(UpdateTaskError.WrongData);

    if (order && !newColumnId) {
      await this.updateTasksOrderInColumn({
        columnId: neededTask.columnId,
        order,
      });
    }

    if (newColumnId) {
      if (order) {
        await this.updateTasksOrderInNewColumn({
          newColumnId: newColumnId,
          oldColumnId: neededTask.columnId,
          order,
          taskId,
        });
      }

      if (!order) {
        const neededColumn = await this.prismaService.column.findUnique({
          where: { id: newColumnId },
          select: { _count: { select: { tasks: true } } },
        });

        if (!neededColumn) this.throw(UpdateTaskError.WrongData);

        await this.prismaService.task.update({
          where: { id: taskId, boardId, userId },
          data: {
            columnId: newColumnId,
            order: neededColumn._count.tasks,
          },
        });

        return await this.prismaService.task.update({
          where: { id: taskId, boardId, userId },
          data: { title },
          select: { id: true, title: true, order: true },
        });
      }
    }

    return await this.prismaService.task.update({
      where: { id: taskId, boardId: boardId, userId },
      data: { title },
      select: { id: true, title: true, order: true },
    });
  }

  private async updateTasksOrderInColumn(dto: {
    columnId: string;
    order: string[];
  }) {
    const { columnId, order } = dto;

    await this.prismaService.$transaction(
      order.map((id, index) =>
        this.prismaService.task.update({
          where: { id, columnId },
          data: { order: index },
        })
      )
    );
  }

  private async updateTasksOrderInNewColumn(dto: {
    oldColumnId: string;
    newColumnId: string;
    order: string[];
    taskId: string;
  }) {
    console.log("here");
    const { oldColumnId, newColumnId, order, taskId } = dto;

    // update order in new column
    await this.prismaService.$transaction(
      order.map((id, index) =>
        this.prismaService.task.update({
          where: { id },
          data: {
            order: index,
            columnId: taskId === id ? newColumnId : undefined,
          },
        })
      )
    );

    // update order in old column
    const oldColumnTasks = await this.prismaService.task.findMany({
      where: { columnId: oldColumnId },
      select: { id: true },
      orderBy: { order: "asc" },
    });

    await this.prismaService.$transaction(
      oldColumnTasks
        .filter((task) => task.id !== taskId)
        .map((task, index) =>
          this.prismaService.task.update({
            where: { id: task.id },
            data: { order: index },
          })
        )
    );
  }
}
