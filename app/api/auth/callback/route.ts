// app/api/auth/callback/route.ts
import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = process.env.WIX_CLIENT_ID || "9d6c0efd-5a3a-46f5-b3de-4cde8ded7c57";

    // Create a new client instance for auth to avoid prerendering issues
    const authClient = createClient({
      auth: OAuthStrategy({
        clientId,
      }),
    });

    const redirectUri = process.env.NODE_ENV === 'production'
      ? `${process.env.VERCEL_URL}/api/auth/callback`
      : "http://localhost:3000/api/auth/callback";

    // Let the SDK handle the redirect parsing
    const tokens = await authClient.auth.parseRedirect(url.toString(), {
      redirectUri,
    });

    // 👉 tokens now contains accessToken & refreshToken
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json(
      { error: "Failed to process auth callback" },
      { status: 500 }
    );
  }
}

// Force this route to be dynamic to avoid prerendering issues
export const dynamic = 'force-dynamic';
