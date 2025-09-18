// app/api/auth/callback/route.ts
import { wixClient } from "../../../utillity/wixclient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Let the SDK handle the redirect parsing
  const tokens = await wixClient.auth.parseRedirect(url.toString(), {
    redirectUri: "http://localhost:3000/api/auth/callback",
  });

  // 👉 tokens now contains accessToken & refreshToken
  return NextResponse.json({ tokens });
}
