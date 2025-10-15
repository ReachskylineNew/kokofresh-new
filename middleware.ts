import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

// 🧠 Configurable constants
const WIX_CLIENT_ID = "2656201f-a899-4ec4-8b24-d1132bcf5405";
const IS_DEV = process.env.NODE_ENV === "development";
const HEADLESS_URL = IS_DEV
  ? "http://localhost:3000"
  : "https://kokofresh-new.vercel.app";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const res = NextResponse.next();

  // 🛒 1️⃣ Handle Wix Checkout → Cart Redirects
  if (url.hostname === "www.kokofresh.in" && url.pathname.startsWith("/cart-page")) {
    const redirectUrl = `${HEADLESS_URL}/cart`;
    console.log("🔁 Redirecting from cart-page →", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  }

  // 🔐 2️⃣ Ensure Visitor Tokens Exist
  const cookies = req.cookies;

  if (cookies.get("refreshToken")) {
    // Already has tokens → continue normally
    return res;
  }

  // 3️⃣ No tokens → generate new visitor tokens from Wix SDK
  try {
    const wixClient = createClient({
      auth: OAuthStrategy({
        clientId: WIX_CLIENT_ID,
      }),
    });

    const tokens = await wixClient.auth.generateVisitorTokens();

    res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "Lax",
    });

    res.cookies.set("accessToken", JSON.stringify(tokens.accessToken), {
      maxAge: 60 * 60, // 1 hour
      sameSite: "Lax",
    });

    console.log("✅ Visitor tokens generated via middleware");
  } catch (err) {
    console.error("❌ Failed to generate Wix visitor tokens:", err);
  }

  return res;
}

// ✅ 4️⃣ Apply middleware only where needed
export const config = {
  matcher: ["/cart-page", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
