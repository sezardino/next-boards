import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { DeleteBoardDto } from "@/services/bll/modules/board/dto/delete";
import { AddTaskResponse } from "@/services/bll/modules/task/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const deleteBoardHandler = async (req: NextRequest) => {
  try {
    const dto = (await req.json()) as DeleteBoardDto;

    const session = await getNextAuthSession();
    const response = await bllService.board.delete(dto, session?.user.id!);

    return NextResponse.json(response as AddTaskResponse, { status: 200 });
  } catch (error) {
    if (isBllModuleError(error)) {
      return NextResponse.json({ error: error.error }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
