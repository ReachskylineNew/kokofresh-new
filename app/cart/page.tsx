"use client";

import { useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Minus,
  X,
  Shield,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../../hooks/use-cart";

export default function CartPage() {
  const { cart, updateQuantity, remove, checkout, loading } = useCart();

  // ✅ Normalize items
  const items =
    cart?.lineItems || cart?.lineItemsV2?.items || [];

  // ✅ Calculate totals
  const subtotal = useMemo(() => {
    return items.reduce((sum: number, item: any) => {
      const price = item.priceData?.price || item.price?.amount || 0;
      const qty = item.quantity || 0;
      return sum + price * qty;
    }, 0);
  }, [items]);

  const shipping = subtotal >= 999 ? 0 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your cart…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-6">
              Your cart is empty
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item: any) => (
                <Card key={item._id || item.id} className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                      {item.media?.[0]?.url ||
                      item.image ||
                      item.thumbnailUrl ? (
                        <img
                          src={
                            item.media?.[0]?.url ||
                            item.image ||
                            item.thumbnailUrl
                          }
                          alt={item.productName || item.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold mb-1">
                        {item.productName || item.name || "Product"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Quantity: {item.quantity}
                      </p>
                      {typeof item.priceData?.price === "number" ||
                      item.price?.amount ? (
                        <p className="text-sm font-medium">
                          ₹
                          {(
                            item.priceData?.price || item.price?.amount || 0
                          ).toFixed(2)}
                        </p>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id || item.id,
                              Math.max(1, (item.quantity || 1) - 1)
                            )
                          }
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id || item.id,
                              (item.quantity || 1) + 1
                            )
                          }
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item._id || item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{subtotal >= 999 ? "Free" : "₹0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 mb-4"
                  onClick={checkout}
                  disabled={items.length === 0}
                >
                  Secure Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Fast, reliable shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-purple-600" />
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
  );
}
