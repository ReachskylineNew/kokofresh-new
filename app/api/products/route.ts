import { NextResponse, NextRequest } from "next/server"
import { createClient, ApiKeyStrategy } from "@wix/sdk"
import { products as productsModule } from "@wix/stores"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.WIX_API_KEY
    const siteId = process.env.WIX_SITE_ID
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

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

    // If id is provided, return single product
    if (id) {
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
    }

    // If no id provided, return all products
    try {
      const query = await wixClient.products.queryProducts().find()

      if (!query?.items) {
        return NextResponse.json({ products: [] })
      }

      // Return all products
      return NextResponse.json({ products: query.items })
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || "Failed to fetch products" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
