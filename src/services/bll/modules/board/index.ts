import { MAX_BOARDS_COUNT } from "@/const";
import { EntityStatus } from "@prisma/client";
import { BllModule } from "../../utils";
import {
  AddColumnDto,
  AddColumnError,
  AddTaskDto,
  AddTaskError,
  AllBoardsDto,
  ArchiveBoardDto,
  ArchiveBoardError,
  BoardBaseDataError,
  BoardByIdDto,
  BoardByIdError,
  ChangeTaskColumnDto,
  ChangeTaskColumnError,
  ColumnsOrderDto,
  CreateBoardDto,
  TasksOrderDto,
} from "./dto";
import { PatchBoardBaseDataDto } from "./dto/update-base-board-data";

export class BoardBllModule extends BllModule {
  getAll(dto: AllBoardsDto = {}, userId: string) {
    const { search, status } = dto;

    return this.prismaService.board.findMany({
      where: {
        userId,
        status: status || EntityStatus.ACTIVE,
        title: search ? { contains: search } : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        status: true,
        _count: { select: { columns: true, tasks: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getById(dto: BoardByIdDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId, status: EntityStatus.ACTIVE },
      include: { columns: { include: { tasks: true } } },
    });

    if (!neededBoard) this.throw(BoardByIdError.NotFound);

    return neededBoard;
  }

  async createBoard(dto: CreateBoardDto, userId: string) {
    const boardsCount = await this.prismaService.board.count({
      where: { userId, status: EntityStatus.ACTIVE },
    });

    if (boardsCount >= MAX_BOARDS_COUNT)
      this.throw(AddColumnError.BoardNotFound);

    return await this.prismaService.board.create({
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
        user: { connect: { id: userId } },
      },
      select: { id: true, title: true, description: true, icon: true },
    });
  }

  async archiveBoard(dto: ArchiveBoardDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId, status: EntityStatus.ACTIVE },
      select: { id: true },
    });

    if (!neededBoard) this.throw(ArchiveBoardError.NotFound);

    return this.prismaService.board.update({
      where: { id: dto.id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async deleteBoard(dto: BoardByIdDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId, status: EntityStatus.ACTIVE },
      select: { id: true },
    });

    if (!neededBoard) this.throw(BoardByIdError.NotFound);

    return this.prismaService.board.update({
      where: { id: dto.id },
      data: { status: EntityStatus.INACTIVE },
    });
  }

  async addColumn(dto: AddColumnDto) {
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

  async columnsOrder(dto: ColumnsOrderDto, userId: string) {
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

  async addTask(dto: AddTaskDto, userId: string) {
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

  async tasksOrder(dto: TasksOrderDto, userId: string) {
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

  async baseBoardData(id: string, userId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
      },
    });

    if (!board) this.throw(BoardBaseDataError.NotFound);

    return board;
  }

  async updateBaseBoardData(dto: PatchBoardBaseDataDto, userId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId },
      select: {
        id: true,
      },
    });

    if (!board) this.throw(BoardBaseDataError.NotFound);

    return this.prismaService.board.update({
      where: { id: board.id },
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
      },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
      },
    });
  }
}
