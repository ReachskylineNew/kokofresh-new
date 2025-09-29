
import type React from "react"

import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { CartProvider } from "@/context/cart-context"
import { UserProvider } from "@/context/user-context"
import "./globals.css"



export const metadata: Metadata = {
  title: "Flavourz - Premium Indian Spices",
  description: "Flavourz. Fresh, Fun, Yours. Premium Indian spices for the modern kitchen.",
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
           {/* Google reCAPTCHA script */}
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        ></script>
      </head>

      <body className="font-sans antialiased">
      
        <Suspense fallback={<div>Loading...</div>}>
        <UserProvider>

    
          <CartProvider>
            {children}
          </CartProvider>
              </UserProvider>
        </Suspense>
        <Analytics />
         <Toaster richColors position="top-center" />

      </body>
    </html>
  )
}
