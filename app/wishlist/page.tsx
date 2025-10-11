"use client"

import { useMemo } from "react"
import { Navigation } from "../../components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { useWishlist } from "../../context/wishlist-context"
import { useCart } from "../../hooks/use-cart"
import Link from "next/link"
import { useUser } from "../../context/user-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart, loading } = useWishlist()
  const { add: addToCart } = useCart()
  const { contact } = useUser()

  // Calculate total value (for display purposes)
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!contact) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-20">
          <div className="text-center">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground opacity-70" />
            </div>
            <h2 className="text-lg md:text-xl font-medium mb-2">Please log in to view your wishlist</h2>
            <p className="text-muted-foreground mb-4 md:mb-6">Sign in to save items for later</p>
            <Link href="/profile">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
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
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in wishlist
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-normal text-foreground mb-1 md:mb-2">My Wishlist</h1>
          {wishlist.length > 0 && (
            <p className="text-sm text-muted-foreground hidden md:block">
              Items you've saved for later. Add them to your cart when you're ready to buy.
            </p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-8 md:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-muted rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground opacity-70" />
              </div>
              <h2 className="text-lg md:text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-4 md:mb-6">Save items from your cart or shop to add them here</p>
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg">
                {wishlist.map((item: any, index: number) => (
                  <div key={item._id}>
                    <div className="p-3 md:p-6">
                      <div className="flex gap-3 md:gap-4">
                        <div className="w-16 h-16 md:w-28 md:h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.image?.url ? (
                            <img
                              src={item.image.url || "/placeholder.svg"}
                              alt={item.productName || "Product"}
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
                                {item.productName || "Product"}
                              </h3>

                              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm mb-2 md:mb-0">
                                <span className="text-green-600 font-medium">Available</span>
                                <span className="text-muted-foreground hidden md:inline">
                                  Saved on {new Date(item.addedDate).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3">
                                <div className="flex items-center border border-border rounded-md bg-background">
                                  <span className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground">
                                    Qty: {item.quantity}
                                  </span>
                                </div>

                                <button 
                                  onClick={() => removeFromWishlist(item._id)}
                                  className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                  <span className="hover:underline">
                                    Remove
                                  </span>
                                </button>

                                <button 
                                  onClick={() => moveToCart(item)}
                                  className="flex items-center gap-1 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                  <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                                  <span className="hover:underline">
                                    Move to cart
                                  </span>
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
                    {index < wishlist.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <div className="mt-3 md:mt-4 p-3 md:p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg">
                    Total value ({wishlist.length} {wishlist.length === 1 ? "item" : "items"}):
                  </span>
                  <span className="text-base md:text-lg font-medium">₹{totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-3 md:p-6 lg:sticky lg:top-24">
                <div className="mb-3 md:mb-4">
                  <h3 className="text-base md:text-lg font-medium mb-2">Wishlist Summary</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
                  </p>
                  <p className="text-lg md:text-xl font-medium">₹{totalValue.toFixed(2)} total value</p>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 mb-3 md:mb-4 text-sm font-medium py-2"
                  onClick={() => {
                    // Move all items to cart
                    wishlist.forEach(item => moveToCart(item));
                  }}
                  disabled={wishlist.length === 0}
                >
                  Move all to cart
                </Button>

                <Separator className="my-3 md:my-4" />

                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-500 flex-shrink-0" />
                    <span className="text-muted-foreground">Saved items persist across devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-muted-foreground">Move to cart when ready to buy</span>
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
