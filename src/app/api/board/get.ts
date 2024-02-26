import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { AllBoardsResponse } from "@/services/bll/modules/board/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";
import { formatUrlSearchParams } from "../utils";

export const getAllBoardsHandler = async (req: NextRequest) => {
  try {
    const session = await getNextAuthSession();
    const params = formatUrlSearchParams(req.nextUrl.searchParams);

    const boards = await bllService.board.all(params, session?.user.id!);

    return NextResponse.json({ boards } as AllBoardsResponse, { status: 200 });
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
