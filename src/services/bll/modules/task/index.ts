import { BllModule } from "../../utils";
import {
  AddTaskDto,
  AddTaskError,
  ChangeTaskColumnDto,
  ChangeTaskColumnError,
  TasksOrderDto,
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

  async update(dto: TasksOrderDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
        userId,
        columns: { some: { id: dto.columnId } },
      },
      select: { id: true },
    });

    if (!neededBoard) this.throw(AddTaskError.WrongData);

    return this.prismaService.$transaction(
      dto.tasks.map((task, index) =>
        this.prismaService.task.update({
          where: { id: task, boardId: dto.boardId },
          data: { order: index },
        })
      )
    );
  }

  async taskColumn(dto: ChangeTaskColumnDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
        userId,
        columns: { some: { id: dto.columnId } },
      },
      select: {
        id: true,
        columns: {
          where: { id: dto.columnId },
          select: {
            tasks: {
              orderBy: { order: "asc" },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!neededBoard || !neededBoard.columns[0])
      this.throw(ChangeTaskColumnError.NotFound);

    const tasks = neededBoard.columns[0].tasks.map((task) => task.id);

    const beforeIndex = tasks.indexOf(dto.before || "") || tasks.length - 1;
    const newOrder = [
      ...tasks.slice(0, beforeIndex),
      dto.taskId,
      ...tasks.slice(beforeIndex),
    ];

    return this.prismaService.$transaction(
      newOrder.map((task, index) =>
        this.prismaService.task.update({
          where: { id: task, boardId: dto.boardId },
          data: {
            order: index,
            columnId: task === dto.taskId ? dto.columnId : undefined,
          },
        })
      )
    );
  }
}
