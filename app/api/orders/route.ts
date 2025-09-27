import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { orders } from "@wix/ecom";

export async function POST(req: NextRequest) {
  try {
    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
    }

    // ✅ Create Wix Admin client
    const wixAdminClient = createClient({
      modules: { orders },
      auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        siteId: process.env.WIX_SITE_ID!,
        accountId: process.env.WIX_ACCOUNT_ID!,
      }),
    });

    // ✅ Call the new search API
    const response = await wixAdminClient.orders.searchOrders({
      search: {
        filter: {
          "buyerInfo.contactId": contactId, // filter by logged-in user
        },
        sort: [
          {
            fieldName: "_createdDate",
            order: "DESC",
          },
        ],
        cursorPaging: {
          limit: 10, // return last 10 orders
        },
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
