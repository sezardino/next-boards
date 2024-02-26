import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { CreateBoardDto } from "@/services/bll/modules/board/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const postCreateBoardHandler = async (req: NextRequest) => {
  try {
    const session = await getNextAuthSession();

    const body = (await req.json()) as CreateBoardDto;

    const response = await bllService.board.create(body, session?.user.id!);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (isBllModuleError(error)) {
      return NextResponse.json({ error: error.error }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json(
      { message: "Can't create board", error },
      { status: 500 }
    );
  }
};
