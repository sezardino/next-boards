import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { MeResponse } from "@/services/bll/modules/user/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextResponse } from "next/server";

export const meHandler = async () => {
  try {
    const session = await getNextAuthSession();

    const response = await bllService.user.currentUser(session?.user.id!);

    return NextResponse.json(response as MeResponse, { status: 200 });
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
