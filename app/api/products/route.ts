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
    const normalized = items.map((p: any) => ({
      id: p._id || p.id,
      catalogItemId: String(p._id || p.id || "").replace(/^product_/, ""),
      exportProductId: p.exportProductId || (p.id ? `product_${p.id}` : undefined),
      name: p.name,
      price: p.priceData?.price ?? p.price?.price ?? null,
      description: p.description,
      slug: p.slug,
      isInStock: p.stock?.inStock ?? true,
      hasVariants: (Array.isArray(p.variants) && p.variants.length > 0) || Boolean(p.manageVariants),
      image:
        p.media?.mainMedia?.image?.url ||
        p.media?.items?.[0]?.image?.url ||
        "/placeholder.svg",
      productType: p.productType,
    }))

    return NextResponse.json({ products: normalized })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 })
  }
}


