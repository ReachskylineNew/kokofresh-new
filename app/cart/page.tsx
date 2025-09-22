"use client"

import { useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, X, Shield, Truck, CreditCard, ArrowRight } from "lucide-react"
import { useCart } from "../../hooks/use-cart"

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your cart…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 lg:py-12">
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold mb-4 lg:mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-8 lg:py-16">
            <p className="text-base lg:text-lg text-muted-foreground mb-4 lg:mb-6">Your cart is empty</p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 lg:space-y-6">
              {items.map((item: any) => (
                <Card key={item.id} className="p-3 lg:p-6">
                  <div className="flex items-start sm:items-center gap-3 lg:gap-6">
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.image?.url ? (
                        <img
                          src={item.image.url || "/placeholder.svg"}
                          alt={item.productName?.original || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-sm sm:text-base lg:text-lg font-semibold mb-1 line-clamp-2">
                        {item.productName?.original || item.name || "Product"}
                      </h3>

                      {/* Variant description line (e.g. weight) */}
                      {item.descriptionLines?.length > 0 && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 lg:mb-2 line-clamp-1">
                          {item.descriptionLines.map((d: any) => d.plainText?.original).join(", ")}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">Quantity: {item.quantity}</p>

                        <p className="text-sm lg:text-base font-medium">
                          {item.price?.formattedAmount || `₹${Number.parseFloat(item.price?.amount || "0").toFixed(2)}`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 lg:gap-3">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="p-1.5 lg:p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
                        </button>
                        <span className="px-2 lg:px-4 py-1.5 lg:py-2 border-x border-border text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1.5 lg:p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="p-1.5 lg:p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3 lg:h-4 lg:w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-4 lg:p-6 lg:sticky lg:top-24">
                <h2 className="font-serif text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Order Summary</h2>

                <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                  <div className="flex justify-between text-sm lg:text-base">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm lg:text-base">
                    <span>Shipping</span>
                    <span>{subtotal >= 999 ? "Free" : "₹0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm lg:text-base">
                    <span>Tax</span>
                    <span>₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base lg:text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 mb-3 lg:mb-4 text-sm lg:text-base"
                  onClick={checkout}
                  disabled={items.length === 0}
                >
                  Secure Checkout
                  <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                </Button>

                <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Shield className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 flex-shrink-0" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Truck className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600 flex-shrink-0" />
                    <span>Fast, reliable shipping</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <CreditCard className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600 flex-shrink-0" />
                    <span>Multiple payment options</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
