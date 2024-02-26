import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const getBaseDataHandler = async (
  _: NextRequest,
  params: { params: { id: string } }
) => {
  try {
    const session = await getNextAuthSession();
    const response = await bllService.board.baseData(
      params.params.id,
      session?.user.id!
    );

    return NextResponse.json(response, { status: 200 });
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
