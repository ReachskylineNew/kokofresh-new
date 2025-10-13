"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ManufacturingProcess from "../components/ProcessSection"
import {
  ArrowRight,
  Star,
  Users,
  Play,
  Heart,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Flame,
  Instagram,
  Twitter,
  Youtube,
  ShoppingCart,
} from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

type Product = {
  _id?: string
  id?: string
  name: string
  priceData?: {
    price: number
    currency: string
    formatted: {
      price: string
    }
  }
  price?: {
    price: number
    currency: string
    formatted: {
      price: string
    }
  }
  media?: {
    mainMedia?: {
      image?: {
        url: string
      }
    }
    items?: Array<{
      image?: {
        url: string
      }
    }>
  }
  description?: string
  slug?: string
  stock?: {
    inStock: boolean
  }
  variants?: Array<{
    choices: {
      weight: string
    }
    variant: {
      priceData: {
        price: number
        formatted: {
          price: string
        }
      }
      visible?: boolean
    }
    stock: {
      inStock: boolean
    }
    _id: string
  }>
  ribbons?: Array<{
    text: string
  }>
  productType?: string
  region?: string
  category?: string
  rating?: number
  reviews?: number
  bestseller?: boolean
  limitedEdition?: boolean
  ribbon?: string
  additionalInfoSections?: any[]
  productOptions?: any[]
}

type Reel = {
  _id: string
  title: string
  url: string
  thumbnail?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { add } = useCart()
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const [reels, setReels] = useState<Reel[]>([])

  useEffect(() => {
    const loadReels = async () => {
      try {
        const res = await fetch("/api/reels", { cache: "no-store" })
        const data = await res.json()
        setReels(data.data || [])
      } catch (err) {
        console.error("Failed to load reels:", err)
      }
    }
    loadReels()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load products")
        const data = await res.json()
        const productsData = data.products || []
        console.log("Fetched products for homepage:", productsData)

        // Show first 6 products or filter for featured/bestsellers
        const featuredProducts = productsData.slice(0, 6)
        setProducts(featuredProducts)

        // Set default variants
        const defaultVariants: Record<string, string> = {}
        featuredProducts.forEach((product: Product) => {
          const productId = product._id || product.id || ""
          if (product.variants && product.variants.length > 0) {
            // Only use visible variants for default selection
            const visibleVariants = product.variants.filter((variant) => variant.variant.visible)
            if (visibleVariants.length > 0) {
              defaultVariants[productId] = visibleVariants[0]._id
            }
          }
        })
        setSelectedVariants(defaultVariants)
      } catch (e: any) {
        setError(e?.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const getProductImage = (product: Product): string => {
    return product.media?.mainMedia?.image?.url || product.media?.items?.[0]?.image?.url || "/placeholder.svg"
  }

  const getCurrentPrice = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) {
      return product.priceData?.price ?? product.price?.price ?? 0
    }

    const selectedVariantId = selectedVariants[product._id || product.id || ""]
    const visibleVariants = product.variants.filter((variant) => variant.variant.visible)
    const selectedVariant = visibleVariants.find((v) => v._id === selectedVariantId) || visibleVariants[0]
    return selectedVariant?.variant.priceData.price || 0
  }

  const getFormattedPrice = (product: Product): string => {
    return (
      product.priceData?.formatted?.price ??
      product.price?.formatted?.price ??
      (product.priceData?.price ? `₹${product.priceData.price}` : "₹0")
    )
  }

  const isInStock = (product: Product): boolean => {
    if (!product.variants || product.variants.length === 0) {
      return product.stock?.inStock ?? true
    }

    const selectedVariantId = selectedVariants[product._id || product.id || ""]
    const visibleVariants = product.variants.filter((variant) => variant.variant.visible)
    const selectedVariant = visibleVariants.find((v) => v._id === selectedVariantId) || visibleVariants[0]
    return selectedVariant?.stock.inStock ?? true
  }

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }))
  }

  const isMadeToOrder = (product: Product): boolean => {
    return product.ribbons?.some((ribbon) => ribbon.text === "Made to Order") || false
  }

  const handleAddToCart = async (product: Product) => {
    try {
      if (!isInStock(product)) throw new Error("Out of stock")

      const productId = product._id || product.id || ""
      const selectedVariantId = selectedVariants[productId]
      const visibleVariants = product.variants?.filter((variant) => variant.variant.visible) || []
      const selectedVariant = visibleVariants.find((v) => v._id === selectedVariantId) || visibleVariants[0]

      // Build options array for hook
      const optionsArray = selectedVariant
        ? Object.entries(selectedVariant.choices).map(([name, value]) => ({
            name,
            value,
          }))
        : []

      await add(productId, 1, optionsArray, selectedVariantId)

      const weightText = selectedVariant ? ` (${Object.values(selectedVariant.choices).join(", ")})` : ""
      toast.success("Added to cart", {
        description: `${product.name}${weightText}`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Add to cart failed"
      toast.error(message)
    }
  }
  return (
    <div className="min-h-screen bg-primary/5">
      <Navigation />

      {/* Hero Section - Gen Z Vibes */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://static.wixstatic.com/media/e7c120_1ee1c0b437b94cf9a07e89f845073a2e~mv2.jpg')",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/40" />

        {/* Floating spice elements (toned down for new bg) */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-[#DD9627]/20 rounded-full blur-xl float-animation" />
        <div
          className="absolute bottom-32 right-16 w-24 h-24 bg-[#FED649]/20 rounded-full blur-xl float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-12 h-12 bg-[#EDCC32]/30 rounded-full blur-lg float-animation"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          {/* Trending Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
            <TrendingUp className="h-4 w-4 text-[#FED649]" />
            <span className="text-sm font-medium text-[#FED649]">#1 Trending Spice Brand</span>
          </div>

          <h1 className="font-black text-6xl md:text-8xl lg:text-9xl mb-6 text-balance bg-gradient-to-r from-[#FED649] via-[#DD9627] to-[#B47B2B] bg-clip-text text-transparent leading-tight">
            KoKoFresh
          </h1>

          <p className="text-2xl md:text-3xl mb-4 text-balance font-bold text-white">
            Where Heritage Meets <span className="text-[#FED649]">Hustle</span> 🔥
          </p>

          <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Small batch. Slow grind. 100% real. The spices your grandma would approve of, but your insta feed will
            obsess over.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-[#DD9627] hover:bg-[#B47B2B] text-white font-bold text-lg px-8 py-4 pulse-glow"
            >
              Shop the Hype
              <Flame className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#FED649] text-[#FED649] hover:bg-[#FED649] hover:text-black font-bold text-lg px-8 py-4 bg-transparent"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#FED649] fill-[#FED649]" />
              <span>4.9★ (10K+ reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#FED649]" />
              <span>100K+ Gen Z customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#FED649]" />
              <span>100% Authentic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Banner */}
      <section className="bg-[#DD9627] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
            <Sparkles className="h-4 w-4 text-[#FED649]" />
            <span>NEW DROP: Limited Edition Diwali Collection - Only 500 boxes left!</span>
            <Sparkles className="h-4 w-4 text-[#FED649]" />
          </div>
        </div>
      </section>

      {/* USP Section - Why We're Different */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Not Your Average <span className="text-[#DD9627]">Masala</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're the spice brand that gets it. Authentic flavors, modern convenience, and the kind of quality that
              makes your food pics go viral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-12 w-12 text-[#DD9627]" />,
                title: "Fresh AF",
                description: "Ground weekly, not yearly. Our spices are fresher than your latest playlist.",
                stat: "< 7 days old",
              },
              {
                icon: <Shield className="h-12 w-12 text-[#DD9627]" />,
                title: "Zero BS",
                description: "No fillers, no artificial colors, no cap. Just pure, authentic Indian spices.",
                stat: "100% Pure",
              },
              {
                icon: <Zap className="h-12 w-12 text-[#DD9627]" />,
                title: "Instant Glow-Up",
                description: "Transform your basic meals into main character energy with one sprinkle.",
                stat: "5-min meals",
              },
            ].map((usp, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 border-[#EDCC32] hover:border-[#DD9627] bg-card"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{usp.icon}</div>
                  <h3 className="font-bold text-2xl mb-4 text-card-foreground">{usp.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{usp.description}</p>
                  <div className="inline-block bg-[#FED649] text-[#B47B2B] font-bold px-4 py-2 rounded-full text-sm">
                    {usp.stat}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories - Dynamic Data */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Pick Your <span className="text-[#DD9627]">Main Character</span> Era
            </h2>
            <p className="text-xl text-muted-foreground">Every spice tells a story. What's yours?</p>
          </div>

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg font-medium">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-64 bg-muted animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => {
                const currentPrice = getCurrentPrice(product)
                const productId = product._id || product.id || ""
                const selectedVariantId = selectedVariants[productId]
                const visibleVariants = product.variants?.filter((variant) => variant.variant.visible) || []
                const selectedVariant = visibleVariants.find((v) => v._id === selectedVariantId) || visibleVariants[0]

                const pid = product.slug || product._id || product.id || ""

                return (
                  <Link key={productId} href={`/product?id=${pid}`}>
                    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white rounded-xl hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                        <img
  src={getProductImage(product) || "/placeholder.svg"}
  alt={product.name}
  className="object-contain w-full aspect-square bg-white group-hover:scale-105 transition-all duration-500"
/>


                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.bestseller && (
                              <Badge className="bg-[#DD9627] text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                ✨ Bestseller
                              </Badge>
                            )}
                            {product.limitedEdition && (
                              <Badge className="bg-[#B47B2B] text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                🔥 Limited
                              </Badge>
                            )}
                            {isMadeToOrder(product) && (
                              <Badge className="bg-[#FED649] text-black text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                👨‍🍳 Made to Order
                              </Badge>
                            )}
                            {!isInStock(product) && (
                              <Badge className="bg-gray-900/90 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          <button className="absolute top-2 right-2 p-2 bg-white/95 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg">
                            <Heart className="h-3 w-3 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>
                        </div>

                        <div className="p-3 sm:p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-1 sm:mb-2 lg:mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-1 lg:mb-2 line-clamp-2 leading-tight group-hover:text-[#DD9627] transition-colors duration-200">
                                {product.name}
                              </h3>
                            </div>
                            {typeof product.rating === "number" && (
                              <div className="flex items-center gap-1 bg-[#FFF6CC] px-2 lg:px-3 py-1 lg:py-2 rounded-full ml-2 lg:ml-3 flex-shrink-0 border border-[#FED649]/40">
                                <Star className="h-3 w-3 lg:h-4 lg:w-4 fill-[#FED649] text-[#FED649]" />
                                <span className="text-xs lg:text-sm font-semibold text-[#B47B2B]">
                                  {product.rating}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 lg:gap-2 mb-2 lg:mb-4">
                            {product.region && (
                              <span className="text-xs lg:text-sm text-[#B47B2B] font-semibold bg-[#FFF6CC] px-2 lg:px-3 py-1 lg:py-2 rounded-full border border-[#DD9627]">
                                📍 {product.region}
                              </span>
                            )}
                            {product.category && (
                              <span className="text-xs lg:text-sm text-gray-600 font-medium bg-gray-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                                {product.category}
                              </span>
                            )}
                          </div>

                          {product.variants && product.variants.length > 0 && (
                            <div className="mb-2 sm:mb-3 lg:mb-4 space-y-2 lg:space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs lg:text-sm font-medium text-gray-700">Weight:</span>
                                <select
                                  value={selectedVariantId || ""}
                                  onChange={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleVariantChange(productId, e.target.value)
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }}
                                  className="px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DD9627] focus:border-transparent bg-white"
                                >
                                  {product.variants
                                    .filter((variant) => variant.variant.visible)
                                    .map((variant) => (
                                      <option key={variant._id} value={variant._id}>
                                        {variant.choices.weight}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-base sm:text-lg lg:text-xl font-bold text-[#B47B2B]">
                                  {selectedVariant?.variant.priceData.formatted.price || `₹${currentPrice}`}
                                </span>
                              </div>
                            </div>
                          )}

                          {(!product.variants || product.variants.length === 0) && (
                            <div className="mb-2 sm:mb-3 lg:mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-base sm:text-lg lg:text-xl font-bold text-[#B47B2B]">
                                  ₹{currentPrice}
                                </span>
                              </div>
                            </div>
                          )}

                          <Button
                            className="w-full bg-[#DD9627] hover:bg-[#B47B2B] text-white font-semibold py-2 lg:py-3 text-sm lg:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-0"
                            onClick={async (e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              try {
                                if (!isInStock(product)) throw new Error("Out of stock")
                                const exportProductId = product._id || product.id || ""
                                const selectedVariantId = selectedVariant?._id

                                // Build options array for hook
                                const optionsArray = selectedVariant
                                  ? Object.entries(selectedVariant.choices).map(([name, value]) => ({
                                      name,
                                      value,
                                    }))
                                  : []

                                await add(exportProductId, 1, optionsArray, selectedVariantId)

                                const weightText = selectedVariant ? ` (${selectedVariant.choices.weight})` : ""
                                toast.success("Added to cart", { description: `${product.name}${weightText}` })
                              } catch (err) {
                                const message = err instanceof Error ? err.message : "Add to cart failed"
                                toast.error(message)
                              }
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-[#DD9627] hover:bg-[#B47B2B] text-white font-bold px-8 py-4">
              <Link href="/shop">
                Shop All Spices
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#DD9627] mb-2">100K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#DD9627] mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#DD9627] mb-2">50M+</div>
              <div className="text-sm text-muted-foreground">insta Views</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#DD9627] mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Flavor Support</div>
            </div>
          </div>
        </div>
      </section>

      <ManufacturingProcess />
      {/* UGC Section - Social Media Native */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              The <span className="text-[#DD9627]">#FlavourzChallenge</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our community is serving looks AND flavors. Join the movement.
            </p>

            {/* ✅ Social Buttons with Real Links */}
            {/* ✅ Social Buttons with Responsive Centering & Wrapping */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-8">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#DD9627] text-[#DD9627] hover:bg-[#DD9627] hover:text-white bg-transparent whitespace-nowrap"
              >
                <a
                  href="https://www.instagram.com/koko_fresh_india?igsh=dHltYm0waWVtZTdu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Instagram className="mr-2 h-4 w-4" />
                  Follow @kokofresh
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#DD9627] text-[#DD9627] hover:bg-[#DD9627] hover:text-white bg-transparent whitespace-nowrap"
              >
                <a
                  href="https://x.com/KOKOFresh_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Tweet #FlavourzChallenge
                </a>
              </Button>
            </div>
          </div>

          {/* Reels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="rounded-lg shadow-lg p-2 bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="relative w-full overflow-hidden rounded-lg">
                  <iframe
                    src={`${reel.url}embed`}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="rounded-lg w-full min-h-[450px] md:min-h-[500px] scale-[1.01] origin-top"
                    style={{
                      transformOrigin: "top center",
                    }}
                  />
                </div>

                {/* <h3 className="mt-2 text-lg font-semibold text-danger">{reel.title}</h3>
      {reel.thumbnail && (
        <p className="text-gray-300 text-sm">{reel.thumbnail}</p>
      )} */}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to join the flavor revolution? Tag us and get featured!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#DD9627] hover:bg-[#B47B2B] text-white font-bold">
                <a
                  href="https://www.instagram.com/koko_fresh_india?igsh=dHltYm0waWVtZTdu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="mr-2 h-5 w-5" />
                  Post Your Creation
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[#DD9627] text-[#DD9627] hover:bg-[#DD9627] hover:text-white font-bold bg-transparent"
              >
                <a href="https://www.youtube.com/@kokofresh" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  Watch Tutorials
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-[#B47B2B] text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">Ready to Level Up Your Kitchen Game?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join 100K+ Gen Z food lovers who've already upgraded their spice game. Your taste buds (and your followers)
            will thank you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-[#DD9627] hover:bg-white/90 font-bold text-lg px-8 py-4">
              Shop Now - Free Shipping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#DD9627] font-bold text-lg px-8 py-4 bg-transparent"
            >
              Get Recipe Inspo
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">✨ Use code GENZ20 for 20% off your first order ✨</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
