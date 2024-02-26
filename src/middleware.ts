import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { PageUrls } from "./const";
import nextAuthMiddleware from "./lib/next-auth/middleware";

export default withAuth((req: NextRequestWithAuth) => {
  const currentPathName = req.nextUrl.pathname;
  const token = req.nextauth.token;

  if (!token && currentPathName !== PageUrls.auth) {
    return NextResponse.redirect(new URL(PageUrls.auth, req.url));
  }

  if (token && currentPathName === PageUrls.auth) {
    return NextResponse.redirect(new URL(PageUrls.home, req.url));
  }
}, nextAuthMiddleware);
