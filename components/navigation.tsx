"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/context/wishlist-context"
import NavUser from "./NavUser"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const { wishlist } = useWishlist()

  const totalQuantity = cart?.lineItems?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0
  const wishlistCount = wishlist?.length || 0

  useEffect(() => {
    if (isMenuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMenuOpen(false)
      }
      window.addEventListener("keydown", onKeyDown)
      return () => {
        document.body.style.overflow = original
        window.removeEventListener("keydown", onKeyDown)
      }
    }
  }, [isMenuOpen])

  return (
    <nav
      className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#FED649]/30 shadow-sm"
      role="navigation"
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6 h-16 md:h-24">
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED649]/60 rounded-md"
            aria-label="KOKO FRESH home"
          >
            <div className="relative w-12 h-12 md:w-24 md:h-24">
              <img
                src="https://static.wixstatic.com/media/e7c120_b2c1d7f7d15e4627a23db611e7dc4f12~mv2.png"
                alt="KOKOFRESH Logo"
                sizes="(max-width: 768px) 48px, 96px"
                className="object-contain transition-transform group-hover:scale-105"
              
                
              />
            </div>
            <span className="block font-serif text-lg md:text-3xl lg:text-4xl leading-none font-semibold tracking-tight bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] bg-clip-text text-transparent">
              KOKO FRESH
            </span>
          </Link>

<div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-3">
  {["Home", "Shop", "About", "Contact"].map((item) => (
    <Link
      key={item}
      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
      className="text-white/90 text-lg lg:text-xl font-medium px-3 py-2 rounded-md
                 transition-colors duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED649]/60
                 hover:bg-clip-text hover:text-transparent
                 hover:bg-gradient-to-r hover:from-[#DD9627] hover:via-[#FED649] hover:to-[#B47B2B]"
    >
      {item}
    </Link>
  ))}
</div>



          <div className="flex items-center gap-1.5 md:gap-3">
            <Link href="/wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-[#DD9627] h-11 w-11 md:h-12 md:w-12 focus-visible:ring-2 focus-visible:ring-[#FED649]/60"
              >
                <Heart className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#DD9627] text-[11px] rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center text-white shadow"
                    aria-label={`${wishlistCount} items in wishlist`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart" aria-label={`Cart${totalQuantity ? `, ${totalQuantity} items` : ""}`}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-[#FED649] h-11 w-11 md:h-12 md:w-12 focus-visible:ring-2 focus-visible:ring-[#FED649]/60"
              >
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                {totalQuantity > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#FED649] text-[11px] rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center text-[#B47B2B] font-semibold shadow"
                    aria-label={`${totalQuantity} items in cart`}
                  >
                    {totalQuantity}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden md:block">
              <NavUser fontSize="text-base" />
            </div>

            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden text-white h-11 w-11 inline-flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED649]/60"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden="true"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 top-16 z-50 md:hidden border-t border-[#FED649]/30 bg-black/95 backdrop-blur
                       motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col">
                {["Shop", "Recipes", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/95 text-base font-medium px-2 py-3 rounded-md hover:text-white
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED649]/60"
                  >
                    {item}
                  </Link>
                ))}

                <Link
                  href="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/95 text-base font-medium flex items-center gap-2 px-2 py-3 rounded-md hover:text-white
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED649]/60"
                >
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && <span className="ml-1 text-[#DD9627] font-medium">({wishlistCount})</span>}
                </Link>

                <div className="mt-2">
                  <NavUser fontSize="text-base" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navigation
