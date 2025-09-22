
import type React from "react"

import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { CartProvider } from "@/context/cart-context"
import "./globals.css"



export const metadata: Metadata = {
  title: "Flavourz of India - Premium Indian Spices",
  description: "Flavourz of India. Fresh, Fun, Yours. Premium Indian spices for the modern kitchen.",
  generator: "v0.app",
}




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <CartProvider>
            {children}
          </CartProvider>
        </Suspense>
        <Analytics />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  )
}
