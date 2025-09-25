"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import NavUser from "./NavUser";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const totalQuantity =
    cart?.lineItems?.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0
    ) || 0;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-primary">
              Flavourz
            </span>
            <span className="text-xl font-medium text-foreground">of India</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {["Shop", "Recipes", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                {item}
              </Link>
            ))}

            {/* User login / profile */}
            <NavUser />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-xs rounded-full h-5 w-5 flex items-center justify-center text-primary-foreground shadow">
                    {totalQuantity}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slideDown">
            <div className="flex flex-col space-y-4">
              {["Shop", "Recipes", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground hover:text-primary font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
              <NavUser />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
