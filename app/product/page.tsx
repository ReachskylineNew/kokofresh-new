"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Head from "next/head"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Star,
  Heart,
  Share2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  Shield,
  Clock,
  ChefHat,
  Info,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useCart } from "../../hooks/use-cart"
import { getVariant } from "../../lib/getvarient"

type WixProduct = any

export default function ProductPage() {
  const { add } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")

  const [product, setProduct] = useState<WixProduct | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [error, setError] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products?id=${productId}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load product")
        const data = await res.json()
        setProduct(data.product)

        if (data.product?.productOptions?.length) {
          const defaults: Record<string, string> = {}
          data.product.productOptions.forEach((opt: any) => {
            const firstChoice = opt.choices.find((c: any) => c.inStock)
            if (firstChoice) defaults[opt.name] = firstChoice.value
          })
          setSelectedOptions(defaults)
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load product")
      }
    }
    if (productId) load()
  }, [productId])

  const inferCategory = (p: any): "Masala" | "Chutney" => {
    const name = (p?.name || "").toLowerCase()
    const type = (p?.productType || "").toLowerCase()
    if (type.includes("chutney") || name.includes("chutney")) return "Chutney"
    return "Masala"
  }

  useEffect(() => {
    const loadAll = async () => {
      if (!product) return
      try {
        const res = await fetch(`/api/products`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load products")
        const data = await res.json()
        const productsList = (data.products || []).map((p: any) => ({
          ...p,
          _category: inferCategory(p),
        }))
        setAllProducts(productsList)

        const currentId = product._id || product.id || product.slug
        const currentCategory = inferCategory(product)
        const related = productsList
          .filter((p: any) => (p._id || p.id || p.slug) !== currentId)
          .filter((p: any) => p._category === currentCategory)
          .slice(0, 4)
        setRelatedProducts(related)
      } catch (e: any) {
        console.error(e)
      }
    }
    loadAll()
  }, [product])

  // Keep pretty URL in address bar after product loads
  useEffect(() => {
    if (!product) return
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const hasQueryId = params.get("id")
    const isProductPath = window.location.pathname.startsWith("/product")
    if (isProductPath && hasQueryId) {
      const prettyPath = `/product/${product?.slug || product?._id || ""}`
      if (prettyPath && window.location.pathname + window.location.search !== prettyPath) {
        window.history.replaceState(null, "", prettyPath)
      }
    }
  }, [product])

  const selectedVariant = product ? getVariant(product, selectedOptions) : null

  const displayPrice = selectedVariant?.variant?.priceData?.price ?? product?.priceData?.price ?? product?.price?.price

  const displayPriceFormatted =
    selectedVariant?.variant?.priceData?.formatted?.price ??
    product?.priceData?.formatted?.price ??
    product?.price?.formatted?.price ??
    (displayPrice ? `₹${displayPrice}` : null)

  const inStock = selectedVariant?.stock?.inStock ?? product?.stock?.inStock ?? true

  const getProductImage = (p: any): string => {
    return p?.media?.mainMedia?.image?.url || p?.media?.items?.[0]?.image?.url || "/placeholder.svg"
  }

  const getFormattedPrice = (p: any): string => {
    return (
      p?.priceData?.formatted?.price ||
      p?.price?.formatted?.price ||
      (p?.priceData?.price ? `₹${p.priceData.price}` : "₹0")
    )
  }

  const handleAddToCart = async () => {
    try {
      if (!inStock) throw new Error("Out of stock")

      const optionArray = Object.entries(selectedOptions).map(([name, value]) => ({ name, value }))
      await add(product._id, quantity, optionArray, selectedVariant?._id)

      toast.success("Added to cart", {
        description: `${product.name} × ${quantity}`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Add to cart failed"
      toast.error(message)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">{error}</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Loading...</h1>
          <Link href="/shop">
            <Button variant="outline" className="bg-transparent">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary/5 text-[#3B2B13] font-sans">
      {/* ✅ SEO Head Section */}
      <Head>
        {product && (
          <>
            <title>{product.name} | Koko Fresh</title>
            <meta name="description" content={product.description?.replace(/<[^>]+>/g, "").slice(0, 150) || ""} />
            <link rel="canonical" href={`https://www.kokofresh.in/product/${product.slug || product._id}`} />
          </>
        )}
      </Head>

      <Navigation />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 lg:mb-8">
          <Link href="/shop" className="hover:text-[#DD9627] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Shop</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-4 sm:space-y-6">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl bg-white p-2 sm:p-4">
              <img
                src={
                  product.media?.items?.[selectedImage]?.image?.url ||
                  product.media?.mainMedia?.image?.url ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] object-contain rounded-lg sm:rounded-xl"
              />
              {product.ribbon && (
                <Badge className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-[#FED649] hover:bg-[#e6c33f] text-black text-xs sm:text-sm">
                  {product.ribbon}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3 justify-center overflow-x-auto pb-2">
              {(product.media?.items?.length
                ? product.media.items.map((m: any) => m.image?.url)
                : [product.media?.mainMedia?.image?.url]
              ).map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-md sm:rounded-lg transition-all duration-200 flex-shrink-0 ${
                    selectedImage === index
                      ? "ring-2 sm:ring-3 ring-[#EDCC32] shadow-lg scale-105"
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FED649] text-[#FED649]" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FED649] text-[#FED649]" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FED649] text-[#FED649]" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FED649] text-[#FED649]" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FED649] text-[#FED649]" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">(4.9)</span>
                </div>
                <Button size="sm" variant="outline" className="rounded-full border-2 bg-transparent w-fit">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Share
                </Button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#4B2E05] leading-tight">
                {product.name}
              </h1>
            </div>

            <Card className="border-2 border-[#FED649]/40 bg-[#FFF6CC] shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
<div className="flex items-baseline gap-2 mb-2">
  {displayPriceFormatted && (
    <span className="font-bold text-2xl sm:text-3xl text-[#DD9627] leading-tight">
      {displayPriceFormatted}
    </span>
  )}
  <Badge
    variant={inStock ? "default" : "destructive"}
    className={`text-xs font-medium ${
      inStock
        ? "bg-[#FFF6CC] text-[#3B2B13] border border-[#DD9627]"
        : "bg-gray-900 text-white"
    }`}
  >
    {inStock ? "In Stock" : "Out of Stock"}
  </Badge>
</div>



                    <p className="text-xs sm:text-sm text-muted-foreground">Inclusive of all taxes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {product.productOptions?.map((opt: any) => (
              <div key={opt.name} className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-serif font-semibold text-[#3B2B13] uppercase tracking-wide">
                  {opt.name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {opt.choices
                    .filter((choice: any) => choice.visible) // ✅ only visible choices
                    .map((choice: any) => (
                      <button
                        key={choice.value}
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [opt.name]: choice.value,
                          }))
                        }
                        disabled={!choice.inStock}
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                          selectedOptions[opt.name] === choice.value
                            ? "bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] text-black shadow-lg"
                            : choice.inStock
                              ? "border-[#DD9627]/30 hover:border-[#DD9627] hover:bg-[#FFF6CC] text-[#3B2B13]"
                              : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {choice.value}
                      </button>
                    ))}
                </div>
              </div>
            ))}

            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-serif font-semibold text-[#3B2B13] uppercase tracking-wide">
                Quantity:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border-2 border-[#FED649]/40 rounded-xl overflow-hidden bg-white shadow-sm w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 sm:p-4 hover:bg-[#FFF6CC] transition-colors text-[#DD9627]"
                  >
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <span className="px-6 sm:px-8 py-3 sm:py-4 border-x-2 border-[#FED649]/40 font-bold text-base sm:text-lg min-w-[60px] sm:min-w-[80px] text-center bg-[#FFF6CC]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 sm:p-4 hover:bg-[#FFF6CC] transition-colors text-[#DD9627]"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Total: {displayPriceFormatted ? `₹${(Number.parseFloat(displayPrice) * quantity).toFixed(2)}` : "N/A"}
                </span>
              </div>
            </div>

            <Card className="border border-gray-200 bg-white/50">
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-[#DD9627] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#B47B2B]">Free Delivery</div>
                      <div className="text-xs text-muted-foreground">On orders above ₹500</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#B47B2B] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#B47B2B]">Secure Payment</div>
                      <div className="text-xs text-muted-foreground">100% Safe & Secure</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#EDCC32] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#B47B2B]">Made to Order</div>
                      <div className="text-xs text-muted-foreground">Fresh preparation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-[#DD9627] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#B47B2B]">Authentic Recipe</div>
                      <div className="text-xs text-muted-foreground">Traditional taste</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] hover:brightness-95 text-black py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="sm:w-auto w-full p-3 sm:p-4 rounded-xl border-2 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              </Button>
            </div>

            {product.description && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-serif font-semibold text-[#3B2B13] mb-3 text-sm sm:text-base">About this product</h3>
                <div className="prose prose-sm max-w-none">
                  <div
                    className="text-gray-600 leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: product.description
                        .replace(/<p><strong>/g, '<p class="font-semibold text-gray-800">')
                        .replace(/<strong>/g, '<span class="font-semibold text-gray-800">')
                        .replace(/<\/strong>/g, "</span>")
                        .replace(/<em>/g, '<em class="italic text-[#B47B2B]">'),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

    <Card className="mb-8 sm:mb-12 lg:mb-16 shadow-lg border-0">
  {/* --- Tabs --- */}
  <div className="border-b border-[#FED649]/30">
    <div className="flex gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 overflow-x-auto">
      {["description", "instructions", "details"].map((tab) => (
        <button
          key={tab}
          className={`px-2 sm:px-4 py-3 sm:py-4 font-medium capitalize transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
            activeTab === tab
              ? "border-b-2 sm:border-b-3 border-[#DD9627] text-[#DD9627]"
              : "text-[#6B4A0F] hover:text-[#B47B2B]"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === "instructions" ? "How to Use" : tab}
        </button>
      ))}
    </div>
  </div>

  {/* --- Tab Content --- */}
  <CardContent className="p-4 sm:p-6 lg:p-8 bg-white">
    {activeTab === "description" && (
      <div className="prose prose-sm sm:prose-lg max-w-none">
        {product.description ? (
          <div
            className="text-[#4B3A1F] leading-relaxed space-y-4 text-sm sm:text-base"
            dangerouslySetInnerHTML={{
              __html: product.description
                .replace(/<p><strong>/g, '<h3 class="text-lg sm:text-xl font-semibold text-[#B47B2B] mb-3">')
                .replace(/<\/strong><\/p>/g, "</h3>")
                .replace(/<strong>/g, '<span class="font-semibold text-[#DD9627]">')
                .replace(/<\/strong>/g, "</span>")
                .replace(/<p>/g, '<p class="mb-4">'),
            }}
          />
        ) : (
          <p className="text-[#6B4A0F]/80 text-sm sm:text-base">No description available.</p>
        )}
      </div>
    )}

    {/* --- How to Use --- */}
    {activeTab === "instructions" && (
      <div className="space-y-6 sm:space-y-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#FFF6CC] rounded-lg">
              <Info className="h-5 w-5 sm:h-6 sm:w-6 text-[#DD9627]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#3B2B13] leading-tight">
                How to Use
              </h2>
              <p className="text-sm sm:text-base text-[#6B4A0F]/80 mt-1">
                Follow these simple steps for the best experience
              </p>
            </div>
          </div>
        </div>

        {product.additionalInfoSections?.map((section: any, index: number) => (
          <div
            key={index}
            className="bg-[#FFFDF3] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#FED649]/40 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-4 mb-4 sm:mb-6">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#DD9627] text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#3B2B13] mb-3 sm:mb-4 leading-tight">
                  {section.title.replace(/\*/g, "")}
                </h3>
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#4B3A1F] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: section.description
                      .replace(/<p>/g, '<p class="mb-4 text-[#4B3A1F]">')
                      .replace(/<ul>/g, '<ul class="space-y-2 ml-4 list-disc list-inside">')
                      .replace(/<ol>/g, '<ol class="space-y-2 ml-4 list-decimal list-inside">')
                      .replace(/<li>/g, '<li class="text-[#4B3A1F] pl-2">')
                      .replace(/<strong>/g, '<strong class="font-semibold text-[#DD9627]">')
                      .replace(/<em>/g, '<em class="italic text-[#B47B2B]">'),
                  }}
                />
              </div>
            </div>

            {index < product.additionalInfoSections?.length - 1 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#FED649] to-transparent"></div>
              </div>
            )}
          </div>
        ))}

        {product.additionalInfoSections?.length > 0 && (
          <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-[#FFF6CC] border border-[#FED649]/40 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#DD9627] text-white rounded-full flex items-center justify-center text-xs font-bold">
                💡
              </div>
              <div>
                <h4 className="font-semibold text-[#B47B2B] mb-2 text-sm sm:text-base">Pro Tip</h4>
                <p className="text-[#4B3A1F] text-sm sm:text-base leading-relaxed">
                  For the best results, follow the instructions in order and take your time with each step.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* --- Details --- */}
    {activeTab === "details" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#3B2B13]">Product Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[#F0E6C0] text-sm sm:text-base">
              <span className="text-[#6B4A0F]/80">Product Type</span>
              <span className="font-medium text-[#3B2B13] capitalize">{product.productType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0E6C0] text-sm sm:text-base">
              <span className="text-[#6B4A0F]/80">Availability</span>
              <Badge
                variant={product.stock?.inStock ? "default" : "destructive"}
                className={`text-xs font-medium ${
                  product.stock?.inStock
                    ? "bg-[#FFF6CC] text-[#3B2B13] border border-[#DD9627]"
                    : "bg-gray-900 text-white"
                }`}
              >
                {product.stock?.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#3B2B13]">Variants</h3>
          <div className="space-y-3">
            {product.variants
              ?.filter((variant: any) => variant.variant.visible)
              .map((variant: any, index: number) => (
                <div key={index} className="p-3 sm:p-4 border border-[#FED649]/40 rounded-lg bg-[#FFFDF3]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-medium text-sm sm:text-base text-[#3B2B13]">
                      {Object.entries(variant.choices)
                        .map(([key, value]) => `${value}`)
                        .join(", ")}
                    </span>
                    <span className="text-[#DD9627] font-semibold text-sm sm:text-base">
                      {variant.variant.priceData.formatted.price}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )}
  </CardContent>
</Card>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[#4B2E05]">
              Related {inferCategory(product) === "Masala" ? "Masalas" : "Chutneys"}
            </h2>
            <Link href="/shop" className="text-sm text-[#DD9627] hover:text-[#B47B2B] hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rp: any) => {
              const rpId = rp._id || rp.id || ""
              return (
                <Link key={rpId} href={`/product?id=${rp.slug || rpId}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white rounded-xl border border-[#DD9627]/20">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={getProductImage(rp) || "/placeholder.svg"}
                          alt={rp.name}
                          className="object-cover w-full h-40 sm:h-44 lg:h-48 group-hover:scale-105 transition-all duration-500"
                        />
                        {rp.ribbon && (
                          <Badge className="absolute top-2 left-2 bg-[#FED649] hover:bg-[#e6c33f] text-black text-xs sm:text-sm">
                            {rp.ribbon}
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-serif font-semibold text-sm sm:text-base text-[#3B2B13] line-clamp-2 group-hover:text-[#DD9627] transition-colors">
                          {rp.name}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-[#B47B2B]">{getFormattedPrice(rp)}</span>
                          {rp.stock?.inStock === false && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
