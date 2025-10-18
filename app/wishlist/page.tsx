"use client"

import { useMemo } from "react"
import { Navigation } from "../../components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Minus,
  Trash2,
  Heart,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react"
import { useWishlist } from "../../context/wishlist-context"
import { useCart } from "../../hooks/use-cart"
import Link from "next/link"
import { useUser } from "../../context/user-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart, loading } = useWishlist()
  const { add: addToCart } = useCart()
  const { contact } = useUser()

  const totalValue = useMemo(() => {
    return wishlist.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.price?.amount || "0")
      const qty = item.quantity || 1
      return sum + price * qty
    }, 0)
  }, [wishlist])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DD9627] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-20 text-center">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 bg-[#FED649]/40 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 md:w-12 md:h-12 text-[#DD9627]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Please log in to view your wishlist</h2>
          <p className="text-gray-600 mb-6">Sign in to save items for later</p>
          <Link href="/profile">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] text-black font-bold px-8 py-4 hover:brightness-90 transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      {/* Top Bar */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              <Link
                href="/shop"
                className="hover:text-[#DD9627] transition-colors"
              >
                Continue shopping
              </Link>
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in wishlist
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-[#B47B2B] mb-1">
            My Wishlist
          </h1>
          {wishlist.length > 0 && (
            <p className="text-sm text-gray-600">
              Items you've saved for later. Add them to your cart when you're ready to buy.
            </p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#FED649]/40 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-[#DD9627]" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Save items from your cart or shop to add them here.
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] text-black font-bold px-8 py-4 hover:brightness-90 transition-all duration-300"
                >
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Wishlist Items */}
            <div className="lg:col-span-3">
              <div className="border border-border rounded-lg overflow-hidden">
                {wishlist.map((item: any, index: number) => (
                  <div
                    key={item._id}
                    className="p-4 md:p-6 bg-[#FED649]/60 text-black"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-[#DD9627]/30">
                        {item.image?.url ? (
                          <img
                            src={item.image.url || "/placeholder.svg"}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm md:text-lg mb-1">
                              {item.productName || "Product"}
                            </h3>

                            <div className="flex items-center gap-2 text-xs md:text-sm mb-2">
                              <span className="text-green-700 font-medium">
                                Available
                              </span>
                              <span className="text-gray-700 hidden md:inline">
                                Saved on{" "}
                                {new Date(
                                  item.addedDate
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => removeFromWishlist(item._id)}
                                className="flex items-center gap-1 text-xs md:text-sm text-gray-800 hover:text-[#DD9627] transition-colors"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                <span className="hover:underline">Remove</span>
                              </button>

                              <button
                                onClick={() => moveToCart(item)}
                                className="flex items-center gap-1 text-xs md:text-sm text-gray-800 hover:text-[#DD9627] transition-colors"
                              >
                                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                                <span className="hover:underline">
                                  Move to Cart
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-base md:text-xl font-semibold text-black">
                              {item.price?.formattedAmount ||
                                `₹${Number.parseFloat(
                                  item.price?.amount || "0"
                                ).toFixed(2)}`}
                            </p>
                            <p className="text-xs md:text-sm text-gray-700">
                              ₹
                              {(
                                Number.parseFloat(item.price?.amount || "0") *
                                item.quantity
                              ).toFixed(2)}{" "}
                              total
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < wishlist.length - 1 && <Separator className="opacity-0" />}
                  </div>
                ))}
              </div>

          
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 lg:sticky lg:top-24">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-[#B47B2B]">
                    Wishlist Summary
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
                  </p>
                  <p className="text-xl font-bold text-black">
                    ₹{totalValue.toFixed(2)} total value
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] text-black font-bold text-base py-3 hover:brightness-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  onClick={() => {
                    wishlist.forEach((item) => moveToCart(item))
                  }}
                  disabled={wishlist.length === 0}
                >
                  Move All to Cart
                </Button>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[#DD9627]" />
                    <span>Saved items persist across devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-[#B47B2B]" />
                    <span>Move to cart when ready to buy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
