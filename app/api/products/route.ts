import { NextResponse } from "next/server"
import { createClient, ApiKeyStrategy } from "@wix/sdk"
import { products as productsModule } from "@wix/stores"

export async function GET() {
  try {
    const apiKey = process.env.WIX_API_KEY
    const siteId = process.env.WIX_SITE_ID

    if (!apiKey || !siteId) {
      return NextResponse.json({ error: "Missing WIX_API_KEY or WIX_SITE_ID" }, { status: 500 })
    }

    const wixClient = createClient({
      modules: { products: productsModule },
      auth: ApiKeyStrategy({ siteId, apiKey }),
    })

    const result = await wixClient.products.queryProducts().limit(50).find()

    const items = result?.items || []
    console.log("Raw products from Wix:", items)

    // Return full product objects instead of normalized/filtered fields
    return NextResponse.json({ products: items })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 })
  }
}
