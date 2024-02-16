import { getNextAuthSession } from "@/lib/next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

type Args<Schema extends ZodSchema> = {
  schema: Schema;
  handler: Function;
  authorization?: boolean;
};

export const withValidation = <Schema extends ZodSchema>(
  args: Args<Schema>
) => {
  const { schema, handler, authorization } = args;

  return async (req: NextRequest) => {
    const session = await getNextAuthSession();

    if (authorization && !session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const body = (await req.clone().json()) || {};

      await schema.parseAsync(body);

      return handler(req);
    } catch (error) {
      console.log("Validation error", error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          { message: "Invalid request", error },
          { status: 422 }
        );
      }

      return NextResponse.json({ message: "Invalid request" }, { status: 500 });
    }
  };
};
