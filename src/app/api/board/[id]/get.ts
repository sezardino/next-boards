import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { BoardResponse } from "@/services/bll/modules/board/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: { id: string } };

export const getBoardHandler = async (_: NextRequest, params: Params) => {
  try {
    const session = await getNextAuthSession();

    const board = await bllService.board.board(
      params.params.id!,
      session?.user.id!
    );

    return NextResponse.json({ board } as BoardResponse, { status: 200 });
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
