import { NextRequest, NextResponse } from "next/server";

export const POST = (req: NextRequest) =>
  NextResponse.json({ message: "Sign up successful" });
