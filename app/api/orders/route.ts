import { NextRequest, NextResponse } from "next/server"
import { createClient, ApiKeyStrategy } from "@wix/sdk"
import { orders } from "@wix/ecom"

export async function POST(req: NextRequest) {
  try {
    const { contactId } = await req.json()

    // ❌ Never allow fallback to all orders
    if (!contactId) {
      console.error("❌ Missing contactId in request")
      return NextResponse.json({ orders: [] }, { status: 400 })
    }

    const wixAdminClient = createClient({
      modules: { orders },
      auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        siteId: process.env.WIX_SITE_ID!,
        accountId: process.env.WIX_ACCOUNT_ID!,
      }),
    })

    // ✅ Use correct $eq filter
    const response = await wixAdminClient.orders.searchOrders({
      search: {
        filter: {
          "buyerInfo.contactId": { $eq: contactId },
        },
        sort: [{ fieldName: "_createdDate", order: "DESC" }],
        cursorPaging: { limit: 10 },
      },
    })

    console.log("📦 contactId:", contactId, "→ Orders:", response.orders?.length)

    return NextResponse.json({ orders: response.orders || [] })
  } catch (err: any) {
    console.error("❌ API /orders error:", err?.response?.data || err)
    return NextResponse.json(
      { error: err?.message || "Failed to fetch orders" },
      { status: 500 },
    )
  }
}
