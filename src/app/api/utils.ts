import { getNextAuthSession } from "@/lib/next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

type Args<Schema extends ZodSchema> = {
  schema?: Schema;
  handler: Function;
  authorization?: boolean;
  input?: "body" | "search";
};

export const formatUrlSearchParams = (params: URLSearchParams) => {
  let formattedParams: Record<string, any> = {};

  params.forEach((value, key) => {
    if (key.includes("[]")) {
      const keyWithoutBrackets = key.replace("[]", "");
      if (!formattedParams[keyWithoutBrackets])
        formattedParams[keyWithoutBrackets] = [];
      formattedParams[keyWithoutBrackets].push(value);

      return;
    }

    formattedParams[key] = value;
  });

  return formattedParams;
};

export const withValidation = <Schema extends ZodSchema>(
  args: Args<Schema>
) => {
  const { schema, handler, authorization, input = "body" } = args;

  return async (req: NextRequest, params: any) => {
    const session = await getNextAuthSession();

    if (authorization && !session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!schema) return handler(req, params);

    try {
      let data;

      if (input === "body") data = await req.clone().json();
      if (input === "search")
        data = formatUrlSearchParams(req.nextUrl.searchParams);

      await schema.parseAsync(data);

      return handler(req);
    } catch (error) {
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
