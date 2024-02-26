import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { BoardInformationResponse } from "@/services/bll/modules/board/dto/information";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: { id: string } };

export const getBoardInformationHandler = async (
  _: NextRequest,
  params: Params
) => {
  try {
    const session = await getNextAuthSession();

    const board = await bllService.board.information(
      params.params.id!,
      session?.user.id!
    );

    return NextResponse.json(board as BoardInformationResponse, {
      status: 200,
    });
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
