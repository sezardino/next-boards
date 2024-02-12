import { BllModule } from "../../utils";
import {
  AddColumnError,
  AddColumnRequest,
  AddTaskError,
  AddTaskRequest,
  BoardByIdError,
  BoardByIdRequest,
  ChangeTaskColumnError,
  ChangeTaskColumnRequest,
  ColumnsOrderRequest,
  TasksOrderRequest,
} from "./dto";

export class BoardBllModule extends BllModule {
  getAll(userId: string) {
    return this.prismaService.board.findMany({ where: { userId } });
  }

  async getById(dto: BoardByIdRequest, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId },
      include: { columns: { include: { tasks: true } } },
    });

    if (!neededBoard) this.throw(BoardByIdError.NotFound);

    return neededBoard;
  }

  async addColumn(dto: AddColumnRequest) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId },
      select: { _count: { select: { columns: true } } },
    });

    if (!neededBoard) this.throw(AddColumnError.BoardNotFound);

    return await this.prismaService.column.create({
      data: {
        title: dto.title,
        order: neededBoard._count.columns,
        board: { connect: { id: dto.boardId } },
      },
      select: { id: true, title: true, order: true },
    });
  }

  async columnsOrder(dto: ColumnsOrderRequest, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId, userId },
      select: { id: true },
    });

    if (!neededBoard) this.throw(AddColumnError.BoardNotFound);

    return this.prismaService.$transaction(
      dto.columns.map((column, index) =>
        this.prismaService.column.update({
          where: { id: column, boardId: dto.boardId },
          data: { order: index },
        })
      )
    );
  }

  async addTask(dto: AddTaskRequest, userId: string) {
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

  async tasksOrder(dto: TasksOrderRequest, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
        userId,
        columns: { some: { id: dto.columnId } },
      },
      select: { id: true },
    });

    if (!neededBoard) this.throw(AddColumnError.BoardNotFound);

    return this.prismaService.$transaction(
      dto.tasks.map((task, index) =>
        this.prismaService.task.update({
          where: { id: task, boardId: dto.boardId },
          data: { order: index },
        })
      )
    );
  }

  async taskColumn(dto: ChangeTaskColumnRequest, userId: string) {
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
