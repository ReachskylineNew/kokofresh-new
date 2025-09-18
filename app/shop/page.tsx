"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, Star, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

type Product = {
  id: string
  exportProductId?: string
  name: string
  price: number | null
  image: string
  description?: string
  slug?: string
  isInStock?: boolean
  hasVariants?: boolean
  originalPrice?: number | null
  tagline?: string
  region?: string
  category?: string
  rating?: number
  reviews?: number
  bestseller?: boolean
  limitedEdition?: boolean
}

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

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load products")
        const data = await res.json()
        setProducts(data.products || [])
      } catch (e: any) {
        setError(e?.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

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

  const filteredProducts = products.filter((product) => {
    if (selectedRegion !== "all" && product.region !== selectedRegion) return false
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false
    if (showBestsellers && !product.bestseller) return false
    if (showLimitedEdition && !product.limitedEdition) return false
    return true
  })

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">Premium Spice Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover authentic flavors from every corner of India, crafted for the modern kitchen
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden w-full mb-4 bg-transparent"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Filter Panel */}
              <div className={`space-y-6 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
                <Card className="p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-semibold mb-4">Shop by Region</h3>
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedRegion === region
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {region === "all" ? "All Regions" : region}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-semibold mb-4">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {category === "all" ? "All Categories" : category}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-semibold mb-4">Special Collections</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showBestsellers}
                        onChange={(e) => setShowBestsellers(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Bestsellers</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLimitedEdition}
                        onChange={(e) => setShowLimitedEdition(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Limited Edition</span>
                    </label>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                {isLoading ? "Loading products..." : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product) => (
                <Link key={product.id || product.slug} href={`/product/${product.slug || product.id}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.bestseller && (
                            <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
                          )}
                          {product.limitedEdition && <Badge variant="secondary">Limited Edition</Badge>}
                        </div>

                        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                          <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                        </button>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                          <div className="p-6 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={async (e) => {
                                e.preventDefault()
                                try {
                                  if (product.isInStock === false) throw new Error("Out of stock")
                                  add({ id: product.exportProductId || `product_${product.id}`, name: product.name, price: product.price ?? undefined, image: product.image }, 1)
                                  toast.success("Added to cart", { description: product.name })
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
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {typeof product.rating === "number" && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground ml-1">
                                {product.rating}
                                {typeof product.reviews === "number" ? ` (${product.reviews})` : ""}
                              </span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        {product.tagline && (
                          <p className="text-sm text-accent font-medium mb-3 italic">{product.tagline}</p>
                        )}

                        {product.region && (
                          <p className="text-sm text-muted-foreground mb-4">From {product.region}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.price !== null && <span className="font-bold text-lg">${product.price}</span>}
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSelectedRegion("all")
                    setSelectedCategory("all")
                    setShowBestsellers(false)
                    setShowLimitedEdition(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
