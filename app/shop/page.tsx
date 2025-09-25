"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Grid3X3, List, Search, SlidersHorizontal, X } from "lucide-react"
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

type WeightOption = {
  weight: string
  price: number
  originalPrice?: number
}

const getWeightOptions = (basePrice: number): WeightOption[] => [
  { weight: "100g", price: Math.round(basePrice * 0.6) },
  { weight: "250g", price: basePrice },
  { weight: "500g", price: Math.round(basePrice * 1.8) },
  { weight: "1kg", price: Math.round(basePrice * 3.4) },
]

export default function ShopPage() {
  const { add } = useCart()
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showBestsellers, setShowBestsellers] = useState(false)
  const [showLimitedEdition, setShowLimitedEdition] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  // Renamed from selectedWeights to selectedVariants
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [hoveredProducts, setHoveredProducts] = useState<Record<string, number>>({})

useEffect(() => {
  const load = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/products", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load products")
      const data = await res.json()
      const productsData = (data.products || []).map((p: Product) => {
        // ✅ derive category
        let category = "Masala"
        if (p.name?.toLowerCase().includes("chutney powder")) {
          category = "Chutney"
        }
        return { ...p, category }
      })

      console.log("Fetched products with category:", productsData)
      setProducts(productsData)

      // set default variants
      const defaultVariants: Record<string, string> = {}
      productsData.forEach((product: Product) => {
        const productId = product._id || product.id || ""
        if (product.variants && product.variants.length > 0) {
          defaultVariants[productId] = product.variants[0]._id
        }
      })
      setSelectedVariants(defaultVariants)
    } catch (e: any) {
      setError(e?.message || "Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }
  load()
}, [])


  const getCurrentPrice = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) {
      return product.priceData?.price ?? product.price?.price ?? 0
    }

    const selectedVariantId = selectedVariants[product._id || product.id || ""]
    const selectedVariant = product.variants.find((v) => v._id === selectedVariantId) || product.variants[0]
    return selectedVariant.variant.priceData.price
  }

  const getCurrentImage = (product: Product): string => {
    const productId = product._id || product.id || ""
    const hoverIndex = hoveredProducts[productId] || 0

    if (product.media?.items && product.media.items.length > 1) {
      const imageIndex = hoverIndex % product.media.items.length
      return product.media.items[imageIndex]?.image?.url || "/placeholder.svg"
    }

    return getProductImage(product)
  }

  const getProductImage = (product: Product): string => {
    return product.media?.mainMedia?.image?.url || product.media?.items?.[0]?.image?.url || "/placeholder.svg"
  }

  const getProductPrice = (product: Product): number => {
    return product.priceData?.price ?? product.price?.price ?? 0
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
    const selectedVariant = product.variants.find((v) => v._id === selectedVariantId) || product.variants[0]
    return selectedVariant.stock.inStock
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

  const handleMouseEnter = (productId: string) => {
    const product = products.find((p) => (p._id || p.id) === productId)
    if (product?.media?.items && product.media.items.length > 1) {
      const interval = setInterval(() => {
        setHoveredProducts((prev) => ({
          ...prev,
          [productId]: ((prev[productId] || 0) + 1) % product.media.items!.length,
        }))
      }, 800)

      // Store interval ID for cleanup
      ;(window as any)[`interval_${productId}`] = interval
    }
  }

  const handleMouseLeave = (productId: string) => {
    const interval = (window as any)[`interval_${productId}`]
    if (interval) {
      clearInterval(interval)
      delete (window as any)[`interval_${productId}`]
    }
    setHoveredProducts((prev) => ({
      ...prev,
      [productId]: 0,
    }))
  }

  const regions = [
    "all",
    "Andhra Pradesh",
    "Kerala",
    "Maharashtra",
    "Rajasthan",
    "West Bengal",
    "Punjab",
    "Tamil Nadu",
    "Gujarat",
  ]
  const categories = ["all", "Masala", "Chutney", "Instant"]

  const filteredProducts = products
    .filter((product) => {
      if (selectedRegion !== "all" && product.region !== selectedRegion) return false
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false
      if (showBestsellers && !product.bestseller) return false
      if (showLimitedEdition && !product.limitedEdition) return false
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return getCurrentPrice(a) - getCurrentPrice(b)
        case "price-high":
          return getCurrentPrice(b) - getCurrentPrice(a)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const clearAllFilters = () => {
    setSelectedRegion("all")
    setSelectedCategory("all")
    setShowBestsellers(false)
    setShowLimitedEdition(false)
    setSearchQuery("")
    setSortBy("featured")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Restored original desktop spacing and typography while keeping mobile optimizations */}
      <section
        className="relative bg-cover bg-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-28"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('https://static.wixstatic.com/media/e7c120_1ee1c0b437b94cf9a07e89f845073a2e~mv2.jpg')",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-3 sm:mb-4 lg:mb-6 bg-white/10 text-yellow-400 border-yellow-500/30 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base font-medium">
              Premium Collection
            </Badge>

            <h1 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-3 sm:mb-4 lg:mb-6 text-balance bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
              Authentic Indian Spices
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0">
              Discover handpicked spices from every corner of India, crafted with tradition and perfected for the modern
              kitchen.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center px-2 sm:px-0">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold w-full sm:w-auto"
              >
                Shop Collection
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold bg-transparent w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Restored original desktop spacing while keeping mobile optimizations */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {/* Search and Controls - Restored desktop spacing */}
          <div className="flex flex-col gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search spices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 sm:items-center sm:justify-end">
              <div className="flex items-center gap-2 lg:gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm lg:text-base"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>

                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden w-full sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Active Filters - Mobile-First */}
          {(selectedRegion !== "all" ||
            selectedCategory !== "all" ||
            showBestsellers ||
            showLimitedEdition ||
            searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedRegion !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedRegion}
                  <button onClick={() => setSelectedRegion("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {showBestsellers && (
                <Badge variant="secondary" className="gap-1">
                  Bestsellers
                  <button onClick={() => setShowBestsellers(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {showLimitedEdition && (
                <Badge variant="secondary" className="gap-1">
                  Limited Edition
                  <button onClick={() => setShowLimitedEdition(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              {/* Filter Panel - Restored original desktop spacing */}
              <div className={`space-y-3 sm:space-y-4 lg:space-y-6 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
              

                <Card className="p-3 sm:p-4 lg:p-6 shadow-sm border-border/50">
                  <h3 className="font-sans text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 lg:mb-4 text-card-foreground">
                    Category
                  </h3>
                  <div className="space-y-1 sm:space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg text-sm transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {category === "all" ? "All Categories" : category}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-3 sm:p-4 lg:p-6 shadow-sm border-border/50">
                  <h3 className="font-sans text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 lg:mb-4 text-card-foreground">
                    Special Collections
                  </h3>
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showBestsellers}
                        onChange={(e) => setShowBestsellers(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">Bestsellers</span>
                    </label>
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showLimitedEdition}
                        onChange={(e) => setShowLimitedEdition(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">Limited Edition</span>
                    </label>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Product Grid - Restored original desktop spacing and layout */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
              <p className="text-sm lg:text-base text-muted-foreground font-medium">
                {isLoading
                  ? "Loading products..."
                  : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
            </div>

            {error && (
              <Card className="p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 border-destructive/20 bg-destructive/5">
                <p className="text-sm lg:text-base text-destructive font-medium">{error}</p>
              </Card>
            )}

            <div
              className={`grid gap-3 sm:gap-4 lg:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" : "grid-cols-1"}`}
            >
              {filteredProducts.map((product) => {
                const currentPrice = getCurrentPrice(product)
                const productId = product._id || product.id || ""
                const selectedVariantId = selectedVariants[productId]
                const selectedVariant =
                  product.variants?.find((v) => v._id === selectedVariantId) || product.variants?.[0]

                return (
                  <Link key={productId} href={`/product?id=${product.slug || productId}`}>
                    <Card
                      className={`group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white rounded-xl hover:-translate-y-1 ${
                        viewMode === "list" ? "flex flex-row max-w-4xl mx-auto" : ""
                      }`}
                      onMouseEnter={() => handleMouseEnter(productId)}
                      onMouseLeave={() => handleMouseLeave(productId)}
                    >
                      <CardContent className="p-0 flex-1">
                        {viewMode === "list" ? (
                          // List View - Restored original desktop spacing
                          <div className="flex flex-col sm:flex-row h-full">
                            <div className="w-full sm:w-64 md:w-80 lg:w-96 flex-shrink-0 relative overflow-hidden">
                              <img
                                src={getCurrentImage(product) || "/placeholder.svg"}
                                alt={product.name}
                                className="object-cover w-full h-40 sm:h-full group-hover:scale-110 transition-all duration-700"
                              />

                              <div className="absolute top-2 left-2 flex flex-col gap-1 lg:gap-2">
                                {product.bestseller && (
                                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                    ✨ Bestseller
                                  </Badge>
                                )}
                                {product.limitedEdition && (
                                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                    🔥 Limited
                                  </Badge>
                                )}
                                {isMadeToOrder(product) && (
                                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
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

                            <div className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 mb-1 sm:mb-2 lg:mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors duration-200">
                                      {product.name}
                                    </h3>
                                  </div>
                                  {typeof product.rating === "number" && (
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 sm:px-3 lg:px-4 py-1 lg:py-2 rounded-full ml-2 sm:ml-3 lg:ml-4 flex-shrink-0">
                                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs sm:text-sm lg:text-base font-semibold text-yellow-700">
                                        {product.rating}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-4 mb-2 sm:mb-3 lg:mb-6">
                                  {product.region && (
                                    <span className="text-xs sm:text-sm lg:text-base text-orange-700 font-semibold bg-orange-50 px-2 sm:px-3 lg:px-4 py-1 lg:py-2 rounded-full border border-orange-100">
                                      📍 {product.region}
                                    </span>
                                  )}
                                  {product.category && (
                                    <span className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium bg-gray-50 px-2 sm:px-3 lg:px-4 py-1 lg:py-2 rounded-full">
                                      {product.category}
                                    </span>
                                  )}
                                </div>

                                {product.variants && product.variants.length > 0 && (
                                  <div className="mb-2 sm:mb-3 lg:mb-6 space-y-2 lg:space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 lg:gap-4">
                                      <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-700">
                                        Weight:
                                      </span>
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
                                        className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-24 lg:min-w-32"
                                      >
                                        {product.variants.map((variant) => (
                                          <option key={variant._id} value={variant._id}>
                                            {variant.choices.weight}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-orange-600">
                                        {selectedVariant?.variant.priceData.formatted.price || `₹${currentPrice}`}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {(!product.variants || product.variants.length === 0) && (
                                  <div className="mb-2 sm:mb-3 lg:mb-6">
                                    <div className="flex items-center justify-between">
                                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-orange-600">
                                        ₹{currentPrice}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <Button
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-2 lg:py-3 text-sm lg:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-0"
                                onClick={async (e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  try {
                                    console.log("Adding to cart:", product)
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

                                    // ✅ Pass productId, qty, optionsArray, and variantId separately
                                    await add(exportProductId, 1, optionsArray, selectedVariantId)

                                    const weightText = selectedVariant
                                      ? ` (${Object.values(selectedVariant.choices).join(", ")})`
                                      : ""
                                    toast.success("Added to cart", {
                                      description: `${product.name}${weightText}`,
                                    })
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
                          </div>
                        ) : (
                          // Grid View - Restored original desktop spacing
                          <>
                            <div className="relative overflow-hidden">
                              <img
                                src={getCurrentImage(product) || "/placeholder.svg"}
                                alt={product.name}
                                className="object-cover w-full h-40 sm:h-48 lg:h-64 group-hover:scale-110 transition-all duration-700"
                              />

                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {product.bestseller && (
                                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                    ✨ Bestseller
                                  </Badge>
                                )}
                                {product.limitedEdition && (
                                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
                                    🔥 Limited
                                  </Badge>
                                )}
                                {isMadeToOrder(product) && (
                                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg border-0 font-medium">
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
                                  <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-1 lg:mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors duration-200">
                                    {product.name}
                                  </h3>
                                </div>
                                {typeof product.rating === "number" && (
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full ml-2 lg:ml-3 flex-shrink-0">
                                    <Star className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs lg:text-sm font-semibold text-yellow-700">
                                      {product.rating}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 lg:gap-2 mb-2 lg:mb-4">
                                {product.region && (
                                  <span className="text-xs lg:text-sm text-orange-700 font-semibold bg-orange-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full border border-orange-100">
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
                                      className="px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                    >
                                      {product.variants.map((variant) => (
                                        <option key={variant._id} value={variant._id}>
                                          {variant.choices.weight}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="text-base sm:text-lg lg:text-xl font-bold text-orange-600">
                                      {selectedVariant?.variant.priceData.formatted.price || `₹${currentPrice}`}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {(!product.variants || product.variants.length === 0) && (
                                <div className="mb-2 sm:mb-3 lg:mb-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-base sm:text-lg lg:text-xl font-bold text-orange-600">
                                      ₹{currentPrice}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <Button
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-2 lg:py-3 text-sm lg:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-0"
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
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {filteredProducts.length === 0 && !isLoading && (
              <Card className="text-center py-12 lg:py-16 border-dashed border-2 border-border">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-sans text-lg lg:text-xl font-bold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4 lg:mb-6 text-sm lg:text-base">
                    We couldn't find any products matching your current filters. Try adjusting your search criteria.
                  </p>
                  <Button onClick={clearAllFilters} className="bg-primary hover:bg-primary/90">
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full h-48 lg:h-64 bg-muted animate-pulse"></div>
                    <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                      <div className="h-4 lg:h-5 bg-muted rounded animate-pulse"></div>
                      <div className="h-5 lg:h-7 bg-muted rounded animate-pulse w-3/4"></div>
                      <div className="h-4 lg:h-5 bg-muted rounded animate-pulse w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


  {/* <Card className="p-3 sm:p-4 lg:p-6 shadow-sm border-border/50">
                  <h3 className="font-sans text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 lg:mb-4 text-card-foreground">
                    Shop by Region
                  </h3>
                  <div className="space-y-1 sm:space-y-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`block w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg text-sm transition-all duration-200 ${
                          selectedRegion === region
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {region === "all" ? "All Regions" : region}
                      </button>
                    ))}
                  </div>
                </Card> */}