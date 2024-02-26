import { bllService } from "@/services/bll";
import { SignUpDto } from "@/services/bll/modules/auth/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";

export const postSignUpHandler = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as SignUpDto;

    await bllService.auth.signUp(body);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    if (isBllModuleError(error)) {
      return NextResponse.json({ error: error.error }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json(
      { message: "Sign up failed", error },
      { status: 500 }
    );
  }
};
