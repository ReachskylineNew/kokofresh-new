// app/api/auth/login/route.ts
import { wixClient } from "../../../utillity/wixclient";
import { NextResponse } from "next/server";

export async function GET() {
  const url = wixClient.auth.generateOAuthRedirectUrl({
    redirectUri: "http://localhost:3000/api/auth/callback",
    scopes: [
      "wix-ecommerce:manage-cart",
      "wix-ecommerce:manage-checkout",
      "wix-stores:products.read",
    ],
  });

  return NextResponse.redirect(url);
}
