import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import { UserSecuritySettingsDto } from "@/services/bll/modules/user/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const patchSecuritySettingsHandler = async (req: NextRequest) => {
  try {
    const session = await getNextAuthSession();

    const body = (await req.json()) as UserSecuritySettingsDto;

    await bllService.user.securitySettings(body, session?.user.id!);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    if (isBllModuleError(error)) {
      return NextResponse.json({ error: error.error }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json(
      { message: "Can't update general settings", error },
      { status: 500 }
    );
  }
};
