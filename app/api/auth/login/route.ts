// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.WIX_CLIENT_ID || "9d6c0efd-5a3a-46f5-b3de-4cde8ded7c57";
    const redirectUri = process.env.NODE_ENV === 'production'
      ? `${process.env.VERCEL_URL}/api/auth/callback`
      : "http://localhost:3000/api/auth/callback";

    const scopes = [
      "wix-ecommerce:manage-cart",
      "wix-ecommerce:manage-checkout",
      "wix-stores:products.read",
    ].join('%20');

    const url = `https://www.wix.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Auth redirect error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}

// Force this route to be dynamic to avoid prerendering issues
export const dynamic = 'force-dynamic';
