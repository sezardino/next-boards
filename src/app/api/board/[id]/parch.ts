import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import {
  ArchiveBoardDto,
  ArchiveBoardResponse,
} from "@/services/bll/modules/board/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const patchArchiveBoardHandler = async (req: NextRequest) => {
  try {
    const dto = (await req.json()) as ArchiveBoardDto;
    const session = await getNextAuthSession();

    const response = await bllService.board.archive(dto, session?.user.id!);

    return NextResponse.json(response as ArchiveBoardResponse, { status: 200 });
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
