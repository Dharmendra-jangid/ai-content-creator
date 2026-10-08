import { NextResponse } from "next/server";

import { LOGIN_PATH } from "@/lib/auth/paths";
import { getTrustedOrigin } from "@/lib/security/origin";

export async function GET(request: Request) {
  const origin = getTrustedOrigin(request);
  return NextResponse.redirect(`${origin}${LOGIN_PATH}`);
}
