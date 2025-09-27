import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { orders } from "@wix/ecom";

export async function POST(req: NextRequest) {
  try {
    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
    }

    const wixAdminClient = createClient({
      modules: { orders },
      auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        siteId: process.env.WIX_SITE_ID!,
        accountId: process.env.WIX_ACCOUNT_ID!,
      }),
    });

    // ✅ Use correct filter syntax
    const response = await wixAdminClient.orders.searchOrders({
      search: {
        filter: {
          "buyerInfo.contactId": { $eq: contactId }, // 👈 must use $eq
        },
        sort: [{ fieldName: "_createdDate", order: "DESC" }],
        cursorPaging: { limit: 10 },
      },
    });

    return NextResponse.json({ orders: response.orders || [] });
  } catch (err: any) {
    console.error("❌ API /orders error:", err?.response?.data || err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
