import { BllModule } from "../../utils";
import { AddColumnDto, AddColumnError, ColumnsOrderDto } from "./dto";

export class ColumnBllModule extends BllModule {
  async add(dto: AddColumnDto, userId: string) {
    const neededBoard = await this.prismaService.board.findUnique({
      where: { id: dto.boardId, userId },
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

  async order(dto: ColumnsOrderDto, userId: string) {
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
}
