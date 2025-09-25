"use client"

import { useMemo } from "react"
import {Navigation } from "../../components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, Heart, Shield, Truck, ArrowLeft } from "lucide-react"
import { useCart } from "../../hooks/use-cart"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"


export default function CartPage() {
  const { cart, updateQuantity, remove, checkout, loading } = useCart()

  // ✅ Normalize items (lineItems from API)
  const items = cart?.lineItems || []

  // ✅ Calculate totals
  const subtotal = useMemo(() => {
    return items.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.price?.amount || "0")
      const qty = item.quantity || 0
      return sum + price * qty
    }, 0)
  }, [items])

  const shipping = subtotal >= 999 ? 0 : 0
  const tax = 0
  const total = subtotal + shipping + tax

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              <Link href="/shop" className="hover:text-primary transition-colors">
  Continue shopping
</Link>

            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
              {items.length} {items.length === 1 ? "item" : "items"} in cart
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-normal text-foreground mb-1 md:mb-2">Shopping Cart</h1>
          {items.length > 0 && (
            <p className="text-sm text-muted-foreground hidden md:block">
              Review your items and shipping options below.
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 md:py-20">
  <div className="max-w-md mx-auto">
    <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-muted rounded-full flex items-center justify-center">
      <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground opacity-70" />
    </div>
    <h2 className="text-lg md:text-xl font-medium mb-2">Your cart is empty</h2>
    <p className="text-muted-foreground mb-4 md:mb-6">Add items to get started</p>
    <Link href="/shop">
  <Button size="lg" className="bg-primary hover:bg-primary/90">
    Continue Shopping
  </Button>
</Link>
  </div>
</div>

        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg">
                {items.map((item: any, index: number) => (
                  <div key={item.id}>
                    <div className="p-3 md:p-6">
                      <div className="flex gap-3 md:gap-4">
                        <div className="w-16 h-16 md:w-28 md:h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.image?.url ? (
                            <img
                              src={item.image.url || "/placeholder.svg"}
                              alt={item.productName?.original || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <div className="w-6 h-6 md:w-8 md:h-8 bg-muted-foreground/20 rounded"></div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-4">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm md:text-lg text-foreground mb-1 line-clamp-2">
                                {item.productName?.original || item.name || "Product"}
                              </h3>

                           {item.descriptionLines?.length > 0 && (
  <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">
    {item.descriptionLines.map((d: any) => d.plainText?.original).join(", ")}
  </p>
)}


                              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm mb-2 md:mb-0">
                                <span className="text-green-600 font-medium">In Stock</span>
                                <span className="text-muted-foreground hidden md:inline">
                                  Eligible for FREE Shipping
                                </span>
                              </div>

                              <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3">
                                <div className="flex items-center border border-border rounded-md bg-background">
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                    className="p-1.5 md:p-2 hover:bg-muted transition-colors"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <select
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                                    className="px-2 md:px-3 py-1.5 md:py-2 border-x border-border bg-transparent text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                  >
                                    {[...Array(10)].map((_, i) => (
                                      <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                    className="p-1.5 md:p-2 hover:bg-muted transition-colors"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                <button className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                  <span onClick={() => remove(item.id)} className="hover:underline">
                                    Delete
                                  </span>
                                </button>

                                <button className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                  <Heart className="h-4 w-4" />
                                  <span className="hover:underline">Save for later</span>
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-base md:text-xl font-medium text-foreground">
                                {item.price?.formattedAmount ||
                                  `₹${Number.parseFloat(item.price?.amount || "0").toFixed(2)}`}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                ₹{(Number.parseFloat(item.price?.amount || "0") * item.quantity).toFixed(2)} total
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <div className="mt-3 md:mt-4 p-3 md:p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg">
                    Subtotal ({items.length} {items.length === 1 ? "item" : "items"}):
                  </span>
                  <span className="text-base md:text-lg font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-3 md:p-6 lg:sticky lg:top-24">
                <div className="mb-3 md:mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base md:text-lg">
                      Subtotal ({items.length} {items.length === 1 ? "item" : "items"}):
                    </span>
                  </div>
                  <p className="text-lg md:text-xl font-medium">₹{subtotal.toFixed(2)}</p>
                </div>

                <div className="hidden md:flex items-center gap-2 mb-4 text-sm">
                  <input type="checkbox" id="gift" className="rounded" />
                  <label htmlFor="gift" className="text-muted-foreground">
                    This order contains a gift
                  </label>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 mb-3 md:mb-4 text-sm font-medium py-2"
                  onClick={checkout}
                  disabled={items.length === 0}
                >
                  Proceed to checkout
                </Button>

                <Separator className="my-3 md:my-4" />

                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">Secure transaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-muted-foreground">FREE delivery on orders over ₹999</span>
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
