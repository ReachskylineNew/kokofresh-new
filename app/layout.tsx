
import type React from "react"

import type { Metadata } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { CartProvider } from "@/context/cart-context"
import { UserProvider } from "@/context/user-context"
import { WishlistProvider } from "@/context/wishlist-context"
import "./globals.css"




export const metadata: Metadata = {
  title: "Flavourz - Premium Indian Spices",
  description: "Flavourz. Fresh, Fun, Yours. Premium Indian spices for the modern kitchen.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // optional if you make a manifest later
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
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
        </Suspense>
        <Analytics />
         <Toaster richColors position="top-center" />
 <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EPBVY275H2"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EPBVY275H2');
          `}
        </Script>
      </body>
    </html>
  )
}
