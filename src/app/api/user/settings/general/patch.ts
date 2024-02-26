import { getNextAuthSession } from "@/lib/next-auth";
import { bllService } from "@/services/bll";
import {
  UserGeneralSettingsDto,
  UserGeneralSettingsResponse,
} from "@/services/bll/modules/user/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const patchGeneralSettingsHandler = async (req: NextRequest) => {
  try {
    const session = await getNextAuthSession();

    const body = (await req.json()) as UserGeneralSettingsDto;

    const response = await bllService.user.generalSettings(
      body,
      session?.user.id!
    );

    return NextResponse.json(
      { user: response } as UserGeneralSettingsResponse,
      { status: 200 }
    );
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
