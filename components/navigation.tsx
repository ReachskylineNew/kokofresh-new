"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/wishlist-context";
import NavUser from "./NavUser";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const totalQuantity =
    cart?.lineItems?.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0
    ) || 0;

  const wishlistCount = wishlist?.length || 0;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#FED649]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 🔰 Brand Logo + Name */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10">
              <Image
                src="https://static.wixstatic.com/media/e7c120_b2c1d7f7d15e4627a23db611e7dc4f12~mv2.png"
                alt="KOKOFRESH Logo"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <span className="font-serif text-2xl font-bold tracking-wide bg-gradient-to-r from-[#DD9627] via-[#FED649] to-[#B47B2B] bg-clip-text text-transparent">
              KOKOFRESH
            </span>
          </Link>

          {/* 🖥️ Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {["Shop", "Recipes", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[#4B3A1F] hover:text-[#DD9627] font-medium transition-colors"
              >
                {item}
              </Link>
            ))}

            {/* User login / profile */}
            <NavUser />
          </div>

          {/* 🛒 Right Side Buttons */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:text-[#DD9627]"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DD9627] text-xs rounded-full h-5 w-5 flex items-center justify-center text-white shadow">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:text-[#DD9627]"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FED649] text-xs rounded-full h-5 w-5 flex items-center justify-center text-[#B47B2B] font-semibold shadow">
                    {totalQuantity}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#4B3A1F] hover:text-[#DD9627]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* 📱 Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#FED649]/40 animate-slideDown bg-white/95 backdrop-blur">
            <div className="flex flex-col space-y-4">
              {["Shop", "Recipes", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4B3A1F] hover:text-[#DD9627] font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#4B3A1F] hover:text-[#DD9627] font-medium transition-colors flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Wishlist{" "}
                {wishlistCount > 0 && (
                  <span className="text-[#DD9627] font-semibold">
                    ({wishlistCount})
                  </span>
                )}
              </Link>
              <NavUser />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
