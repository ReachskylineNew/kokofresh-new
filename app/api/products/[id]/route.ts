import { NextResponse } from "next/server"
import { createClient, ApiKeyStrategy } from "@wix/sdk"
import { products as productsModule } from "@wix/stores"

export async function GET(_request: Request, context: { params: { id: string } }) {
  try {
    const apiKey = process.env.WIX_API_KEY
    const siteId = process.env.WIX_SITE_ID
    const { id } = context.params

    if (!apiKey || !siteId) {
      return NextResponse.json(
        { error: "Missing WIX_API_KEY or WIX_SITE_ID" },
        { status: 500 }
      )
    }

    const wixClient = createClient({
      modules: { products: productsModule },
      auth: ApiKeyStrategy({ siteId, apiKey }),
    })

    let product: any
    try {
      // Try by ID
      product = await wixClient.products.getProduct(id)
    } catch {
      // Fallback to slug query
      const q = await wixClient.products
        .queryProducts()
        .eq("slug", id)
        .limit(1)
        .find()

      if (!q?.items?.length) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      product = q.items[0]
    }

    // ✅ Instead of normalizing, return full product object
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
