import { MAX_BOARDS_COUNT } from "@/const";
import { EntityStatus } from "@prisma/client";
import { BllModule } from "../../utils";
import {
  AllBoardsDto,
  ArchiveBoardDto,
  ArchiveBoardError,
  BoardBaseDataError,
  BoardError,
  CreateBoardDto,
  CreateBoardError,
} from "./dto";
import { DeleteBoardError } from "./dto/delete";
import { PatchBoardBaseDataDto } from "./dto/update-base-data";

export class BoardBllModule extends BllModule {
  all(dto: AllBoardsDto = {}, userId: string) {
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

  async board(id: string, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: {
        id: id,
        userId,
        status: { in: [EntityStatus.ACTIVE, EntityStatus.INACTIVE] },
      },
      select: {
        title: true,
        status: true,
        columns: {
          select: {
            id: true,
            title: true,
            order: true,
            tasks: {
              select: { id: true, title: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        tasks: {
          select: { id: true, title: true, columnId: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!neededBoard) this.throw(BoardError.NotFound);

    return neededBoard;
  }

  async create(dto: CreateBoardDto, userId: string) {
    const boardsCount = await this.prismaService.board.count({
      where: { userId, status: EntityStatus.ACTIVE },
    });

    if (boardsCount >= MAX_BOARDS_COUNT) this.throw(CreateBoardError.MaxLimit);

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

  async archive(dto: ArchiveBoardDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId, status: EntityStatus.ACTIVE },
      select: { id: true, status: true },
    });

    if (!neededBoard) this.throw(ArchiveBoardError.NotFound);
    if (neededBoard.status === EntityStatus.INACTIVE)
      this.throw(ArchiveBoardError.BoardArchived);

    return this.prismaService.board.update({
      where: { id: dto.id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async delete(id: string, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id, userId },
      select: { id: true },
    });

    if (!neededBoard) this.throw(DeleteBoardError.NotFound);

    return this.prismaService.board.update({
      where: { id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async baseData(id: string, userId: string) {
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

  async updateBaseData(dto: PatchBoardBaseDataDto, userId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id: dto.id, userId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!board) this.throw(BoardBaseDataError.NotFound);
    if (board.status === EntityStatus.INACTIVE)
      this.throw(BoardBaseDataError.BoardArchived);

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
