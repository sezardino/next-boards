import { bllService } from "@/services/bll";
import {
  SignUpRequest,
  signUpRequestSchema,
} from "@/services/bll/modules/auth/dto";
import { isBllModuleError } from "@/services/bll/utils";
import { NextRequest, NextResponse } from "next/server";
import { withValidation } from "../../utils";

const handler = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as SignUpRequest;

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

export const POST = withValidation({ schema: signUpRequestSchema, handler });
