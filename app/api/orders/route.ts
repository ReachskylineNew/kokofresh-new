import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    const res = await fetch("https://www.kokofresh.in/account/my-orders", {
      headers: {
        Authorization: authHeader || "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy /api/orders error:", err);
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
