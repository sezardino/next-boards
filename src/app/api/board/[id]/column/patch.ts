import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { UpdateColumnResponse } from "@/services/bll/modules/column/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const patchUpdateColumnHandler = async (req: NextRequest) => {
  try {
    const dto = await req.json();

    const session = await getNextAuthSession();
    const response = await bllService.column.update(dto, session?.user.id!);

    return NextResponse.json(response as UpdateColumnResponse, { status: 200 });
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
