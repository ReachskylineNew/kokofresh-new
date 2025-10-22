"use client"

import { useMemo, useState } from "react"
import { Navigation } from "../../components/navigation"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Minus,
  Trash2,
  Heart,
  Shield,
  Truck,
  ArrowLeft,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useCart } from "../../hooks/use-cart"
import { useWishlist } from "../../context/wishlist-context"
import { useUser } from "../../context/user-context"
import Link from "next/link"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 5

export default function CartPage() {
  const { cart, updateQuantity, remove, checkout, loading } = useCart()
  const { addToWishlist } = useWishlist()
  const { contact } = useUser()
  const [currentPage, setCurrentPage] = useState(1)

  const handleSaveForLater = async (item: any) => {
    if (!contact) {
      toast.error("Please sign in to save items for later")
      return
    }

    try {
      const success = await addToWishlist(item)
      if (success) {
        await remove(item.id)
        toast.success("Item saved for later!")
      } else {
        toast.error("Failed to save item for later.")
      }
    } catch (error) {
      console.error("❌ Error saving for later:", error)
      toast.error("Error saving item. Please try again.")
    }
  }

  const items = cart?.lineItems || []

  const subtotal = useMemo(() => {
    return items.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.price?.amount || "0")
      const qty = item.quantity || 0
      return sum + price * qty
    }, 0)
  }, [items])

  const total = subtotal

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = items.slice(startIndex, endIndex)

  useMemo(() => {
    setCurrentPage(1)
  }, [items.length])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DD9627] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 mt-16 md:mt-24">
      <Navigation />

      {/* Header bar */}
      <div className="bg-[#FFF8E1] border-b border-[#DD9627]/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ArrowLeft className="h-4 w-4" />
            <Link href="/shop" className="hover:text-[#DD9627] transition-colors">
              Continue Shopping
            </Link>
          </div>
          <div className="text-sm text-gray-600 hidden sm:block">
            {items.length} {items.length === 1 ? "item" : "items"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#B47B2B] mb-4">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 mx-auto mb-5 bg-[#FFF8E1] rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-[#B47B2B]" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add items to get started with your flavor journey!</p>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] text-black font-bold px-8 py-4 hover:brightness-90 transition-all duration-300">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-3 space-y-4">
              {paginatedItems.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 bg-[#FED649]/50 text-black rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white border border-[#DD9627]/30 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image?.url ? (
                        <img
                          src={item.image.url || "/placeholder.svg"}
                          alt={item.productName?.original || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                        {item.productName?.original || item.name}
                      </h3>
                      {item.descriptionLines?.length > 0 && (
                        <p className="text-xs sm:text-sm text-gray-700 mb-1 line-clamp-2">
                          {item.descriptionLines.map((d: any) => d.plainText?.original).join(", ")}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-green-700 font-medium">
                        In Stock <span className="text-gray-700 hidden sm:inline">• FREE Shipping</span>
                      </p>

                      {/* Quantity and actions */}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center border border-black/20 rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            className="p-2 hover:bg-[#FED649]/70 transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                            className="px-2 py-1 border-x border-black/10 bg-transparent text-sm focus:outline-none"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="p-2 hover:bg-[#FED649]/70 transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => remove(item.id)}
                          className="flex items-center gap-1 text-sm text-gray-800 hover:text-[#B47B2B] transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="flex items-center gap-1 text-sm text-gray-800 hover:text-[#B47B2B] transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-left sm:w-28">
                    <p className="text-base sm:text-lg font-bold text-black">
                      {item.price?.formattedAmount || `₹${Number.parseFloat(item.price?.amount || "0").toFixed(2)}`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      ₹{(Number.parseFloat(item.price?.amount || "0") * item.quantity).toFixed(2)} total
                    </p>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#DD9627]/30 text-gray-700 hover:bg-[#FFF8E1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-[#DD9627] text-white"
                            : "border border-[#DD9627]/30 text-gray-700 hover:bg-[#FFF8E1]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#DD9627]/30 text-gray-700 hover:bg-[#FFF8E1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-6 h-fit">
              <div className="bg-white border border-[#DD9627]/20 rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span className="font-medium text-green-700">Free</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold text-base mb-4">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] text-black font-bold text-base py-3 hover:brightness-90 transition-all duration-300"
                  onClick={checkout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    Secure transaction
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    FREE delivery on orders over ₹999
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

