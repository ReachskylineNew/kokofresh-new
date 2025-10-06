import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { orderFulfillments, orders } from "@wix/ecom";
import { products, collections } from "@wix/stores";
import { contacts } from "@wix/crm";
import { items } from "@wix/data";
import { submissions } from "@wix/forms";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { trackingNumber, shippingProvider, trackingLink, lineItems } = await req.json();

    // ✅ Create a Wix Admin client directly inside this route
    const wixClient = createClient({
      modules: {
        products,
        collections,
        contacts,
        orders,
        items,
        submissions,
        orderFulfillments,
      },
      auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        accountId: process.env.WIX_ACCOUNT_ID!,
        siteId: process.env.WIX_SITE_ID!,
      }),
    });

    // ✅ Build the fulfillment object
    const fulfillment = {
      lineItems:
        lineItems || [
          {
            id: "00000000-0000-0000-0000-000000000001", // fallback ID if not passed
            quantity: 1,
          },
        ],
      trackingInfo: {
        trackingNumber,
        shippingProvider: shippingProvider || "Shiprocket",
        trackingLink:
          trackingLink || `https://shiprocket.co/tracking/${trackingNumber}`,
      },
    };

    // ✅ Create the fulfillment in Wix
    const result = await wixClient.orderFulfillments.createFulfillment(
      params.orderId,
      fulfillment
    );

    console.log("✅ Fulfillment created:", result);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Fulfillment creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create fulfillment",
      },
      { status: 500 }
    );
  }
}
