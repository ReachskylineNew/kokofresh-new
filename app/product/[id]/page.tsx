"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
import { useCart } from "../../../hooks/use-cart"
import { getVariant } from "../../../lib/getvarient"

type WixProduct = any

export default function ProductPage() {
  const { add } = useCart()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<WixProduct | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [error, setError] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load product")
        const data = await res.json()
        setProduct(data.product)

        console.log("Product data:", data.product)
        console.log("Product visibility:", data.product.visibility)
        console.log("Product inStock:", data.product.stock?.inStock)

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

  const selectedVariant = product ? getVariant(product, selectedOptions) : null
  console.log("Selected options:", selectedOptions)
  console.log("Selected variant:", selectedVariant)
  console.log("Variant inStock:", selectedVariant?.stock?.inStock)

  const displayPrice = selectedVariant?.variant?.priceData?.price ?? product?.priceData?.price ?? product?.price?.price

  const displayPriceFormatted =
    selectedVariant?.variant?.priceData?.formatted?.price ??
    product?.priceData?.formatted?.price ??
    product?.price?.formatted?.price ??
    (displayPrice ? `₹${displayPrice}` : null)

  const inStock = selectedVariant?.stock?.inStock ?? product?.stock?.inStock ?? true

  const handleAddToCart = async () => {
    try {
      if (!inStock) throw new Error("Out of stock")

      const optionArray = Object.entries(selectedOptions).map(([name, value]) => ({ name, value }))

      console.log("✅ Using product._id for catalogItemId:", product._id)
      console.log("✅ VariantId:", selectedVariant?._id)
      console.log("✅ Options:", optionArray)

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navigation />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 lg:mb-8">
          <Link href="/shop" className="hover:text-orange-600 transition-colors flex items-center gap-1">
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
                <Badge className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
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
                      ? "ring-2 sm:ring-3 ring-orange-500 shadow-lg scale-105"
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
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">(4.9)</span>
                </div>
                <Button size="sm" variant="outline" className="rounded-full border-2 bg-transparent w-fit">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Share
                </Button>
              </div>

              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      {displayPriceFormatted && (
                        <span className="font-bold text-2xl sm:text-3xl text-orange-600">{displayPriceFormatted}</span>
                      )}
                      <Badge variant={inStock ? "default" : "destructive"} className="text-xs">
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
                <label className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  {opt.name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {opt.choices.map((choice: any) => (
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
                          ? "border-orange-500 bg-orange-500 text-white shadow-lg"
                          : choice.inStock
                            ? "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
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
              <label className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Quantity:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border-2 border-orange-200 rounded-xl overflow-hidden bg-white shadow-sm w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 sm:p-4 hover:bg-orange-50 transition-colors text-orange-600"
                  >
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <span className="px-6 sm:px-8 py-3 sm:py-4 border-x-2 border-orange-200 font-bold text-base sm:text-lg min-w-[60px] sm:min-w-[80px] text-center bg-orange-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 sm:p-4 hover:bg-orange-50 transition-colors text-orange-600"
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
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-green-700">Free Delivery</div>
                      <div className="text-xs text-muted-foreground">On orders above ₹500</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-700">Secure Payment</div>
                      <div className="text-xs text-muted-foreground">100% Safe & Secure</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-orange-700">Made to Order</div>
                      <div className="text-xs text-muted-foreground">Fresh preparation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-purple-700">Authentic Recipe</div>
                      <div className="text-xs text-muted-foreground">Traditional taste</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">About this product</h3>
                <div className="prose prose-sm max-w-none">
                  <div
                    className="text-gray-600 leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: product.description
                        .replace(/<p><strong>/g, '<p class="font-semibold text-gray-800">')
                        .replace(/<strong>/g, '<span class="font-semibold text-gray-800">')
                        .replace(/<\/strong>/g, "</span>"),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Card className="mb-8 sm:mb-12 lg:mb-16 shadow-lg">
          <div className="border-b">
            <div className="flex gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 overflow-x-auto">
              {["description", "instructions", "details"].map((tab) => (
                <button
                  key={tab}
                  className={`px-2 sm:px-4 py-3 sm:py-4 font-medium capitalize transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab
                      ? "border-b-2 sm:border-b-3 border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "instructions" ? "How to Usejnjn" : tab}
                </button>
              ))}
            </div>
          </div>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="prose prose-sm sm:prose-lg max-w-none">
                {product.description ? (
                  <div
                    className="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: product.description
                        .replace(/<p><strong>/g, '<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">')
                        .replace(/<\/strong><\/p>/g, "</h3>")
                        .replace(/<strong>/g, '<span class="font-semibold text-gray-800">')
                        .replace(/<\/strong>/g, "</span>")
                        .replace(/<p>/g, '<p class="mb-4">'),
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm sm:text-base">No description available.</p>
                )}
              </div>
            )}

            {activeTab === "instructions" && (
              <div className="space-y-4 sm:space-y-6">
                {product.additionalInfoSections?.map((section: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      {section.title.replace(/\*/g, "")}
                    </h3>
                    <div
                      className="prose prose-sm sm:prose-lg max-w-none text-gray-700 text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Product Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                      <span className="text-gray-600">Product Type</span>
                      <span className="font-medium capitalize">{product.productType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                      <span className="text-gray-600">Availability</span>
                      <Badge variant={product.stock?.inStock ? "default" : "destructive"}>
                        {product.stock?.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Variants</h3>
                  <div className="space-y-3">
                    {product.variants?.map((variant: any, index: number) => (
                      <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="font-medium text-sm sm:text-base">
                            {Object.entries(variant.choices)
                              .map(([key, value]) => `${value}`)
                              .join(", ")}
                          </span>
                          <span className="text-orange-600 font-semibold text-sm sm:text-base">
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

      <Footer />
    </div>
  )
}
