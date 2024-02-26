import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { PatchBoardBaseDataResponse } from "@/services/bll/modules/board/dto/update-base-data";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const patchBaseDataHandler = async (req: NextRequest) => {
  try {
    const dto = await req.json();

    const session = await getNextAuthSession();
    const response = await bllService.board.updateBaseData(
      dto,
      session?.user.id!
    );

    return NextResponse.json(response as PatchBoardBaseDataResponse, {
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
