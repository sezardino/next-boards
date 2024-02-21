import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { AddTaskResponse } from "@/services/bll/modules/task/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const patchBoardTaskHandler = async (req: NextRequest) => {
  try {
    const dto = await req.json();

    const session = await getNextAuthSession();
    const response = await bllService.task.add(dto, session?.user.id!);

    return NextResponse.json(response as AddTaskResponse, { status: 201 });
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
