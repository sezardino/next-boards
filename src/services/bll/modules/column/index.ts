import { EntityStatus } from "@prisma/client";
import { BllModule } from "../../utils";
import {
  AddColumnDto,
  AddColumnError,
  UpdateColumnDto,
  UpdateColumnError,
} from "./dto";

export class ColumnBllModule extends BllModule {
  async add(dto: AddColumnDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId, userId },
      select: { status: true, _count: { select: { columns: true } } },
    });

    if (!neededBoard) this.throw(AddColumnError.BoardNotFound);
    if (neededBoard.status === EntityStatus.INACTIVE)
      this.throw(AddColumnError.BoardArchived);

    return await this.prismaService.column.create({
      data: {
        title: dto.title,
        order: neededBoard._count.columns,
        board: { connect: { id: dto.boardId } },
        user: { connect: { id: userId } },
      },
      select: { id: true, title: true, order: true },
    });
  }

  async update(dto: UpdateColumnDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId, userId },
      select: { id: true, status: true },
    });

    if (!neededBoard) this.throw(UpdateColumnError.NotFound);
    if (neededBoard.status === EntityStatus.INACTIVE)
      this.throw(UpdateColumnError.BoardArchived);

    const neededColumn = await this.prismaService.column.findUnique({
      where: { id: dto.columnId, boardId: dto.boardId },
    });

    if (!neededColumn) this.throw(UpdateColumnError.NotFound);

    if (dto.order) {
      await this.prismaService.$transaction(
        dto.order.map((column, index) =>
          this.prismaService.column.update({
            where: { id: column, boardId: dto.boardId },
            data: { order: index },
          })
        )
      );
    }

    return this.prismaService.column.update({
      where: { id: dto.columnId },
      data: { title: dto.title },
      select: { id: true, title: true, order: true },
    });
  }
}
