"use client"
import { Navigation }  from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Star,
  Users,
  Play,
  Heart,
  MessageCircle,
  Share,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Flame,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

type Product = {
  _id?: string
  id?: string
  name: string
  priceData?: {
    price: number
    currency: string
    formatted: {
      price: string
    }
  }
  price?: {
    price: number
    currency: string
    formatted: {
      price: string
    }
  }
  media?: {
    mainMedia?: {
      image?: {
        url: string
      }
    }
    items?: Array<{
      image?: {
        url: string
      }
    }>
  }
  description?: string
  slug?: string
  stock?: {
    inStock: boolean
  }
  variants?: Array<{
    choices: {
      weight: string
    }
    variant: {
      priceData: {
        price: number
        formatted: {
          price: string
        }
      }
    }
    stock: {
      inStock: boolean
    }
    _id: string
  }>
  ribbons?: Array<{
    text: string
  }>
  productType?: string
  region?: string
  category?: string
  rating?: number
  reviews?: number
  bestseller?: boolean
  limitedEdition?: boolean
  ribbon?: string
  additionalInfoSections?: any[]
  productOptions?: any[]
}

type Reel = {
  _id: string
  title: string
  url: string
  thumbnail?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

   const [reels, setReels] = useState<Reel[]>([])

  useEffect(() => {
    const loadReels = async () => {
      try {
        const res = await fetch("/api/reels", { cache: "no-store" })
        const data = await res.json()
        setReels(data.data || [])
      } catch (err) {
        console.error("Failed to load reels:", err)
      }
    }
    loadReels()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load products")
        const data = await res.json()
        const productsData = data.products || []
        console.log("Fetched products for homepage:", productsData)

        // Show first 6 products or filter for featured/bestsellers
        const featuredProducts = productsData.slice(0, 6)
        setProducts(featuredProducts)
      } catch (e: any) {
        setError(e?.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const getProductImage = (product: Product): string => {
    return product.media?.mainMedia?.image?.url || product.media?.items?.[0]?.image?.url || "/placeholder.svg"
  }
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Gen Z Vibes */}
    <section
  className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://static.wixstatic.com/media/e7c120_1ee1c0b437b94cf9a07e89f845073a2e~mv2.jpg')",
  }}
>
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/40" />

  {/* Floating spice elements (toned down for new bg) */}
  <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full blur-xl float-animation" />
  <div
    className="absolute bottom-32 right-16 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl float-animation"
    style={{ animationDelay: "1s" }}
  />
  <div
    className="absolute top-1/3 right-1/4 w-12 h-12 bg-red-500/30 rounded-full blur-lg float-animation"
    style={{ animationDelay: "2s" }}
  />

  <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
    {/* Trending Badge */}
    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
      <TrendingUp className="h-4 w-4 text-yellow-400" />
      <span className="text-sm font-medium text-yellow-400">#1 Trending Spice Brand</span>
    </div>

    <h1 className="font-black text-6xl md:text-8xl lg:text-9xl mb-6 text-balance bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
      Flavourz Of India
    </h1>

    <p className="text-2xl md:text-3xl mb-4 text-balance font-bold text-white">
      Where Heritage Meets <span className="text-yellow-400">Hustle</span> 🔥
    </p>

    <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
      Small batch. Slow grind. 100% real. The spices your grandma would approve of, but your insta feed will
      obsess over.
    </p>

    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
      <Button
        size="lg"
        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-4 pulse-glow"
      >
        Shop the Hype
        <Flame className="ml-2 h-5 w-5" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold text-lg px-8 py-4 bg-transparent"
      >
        <Play className="mr-2 h-5 w-5" />
        Watch Our Story
      </Button>
    </div>

    {/* Social Proof Badges */}
    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-200">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span>4.9★ (10K+ reviews)</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-yellow-400" />
        <span>100K+ Gen Z customers</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-yellow-400" />
        <span>100% Authentic</span>
      </div>
    </div>
  </div>
</section>


      {/* Announcement Banner */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
            <Sparkles className="h-4 w-4" />
            <span>NEW DROP: Limited Edition Diwali Collection - Only 500 boxes left!</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* USP Section - Why We're Different */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Not Your Average <span className="text-primary">Masala</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're the spice brand that gets it. Authentic flavors, modern convenience, and the kind of quality that
              makes your food pics go viral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-12 w-12 text-primary" />,
                title: "Fresh AF",
                description: "Ground weekly, not yearly. Our spices are fresher than your latest playlist.",
                stat: "< 7 days old",
              },
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Zero BS",
                description: "No fillers, no artificial colors, no cap. Just pure, authentic Indian spices.",
                stat: "100% Pure",
              },
              {
                icon: <Zap className="h-12 w-12 text-primary" />,
                title: "Instant Glow-Up",
                description: "Transform your basic meals into main character energy with one sprinkle.",
                stat: "5-min meals",
              },
            ].map((usp, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{usp.icon}</div>
                  <h3 className="font-bold text-2xl mb-4 text-card-foreground">{usp.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{usp.description}</p>
                  <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm">
                    {usp.stat}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories - Dynamic Data */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Pick Your <span className="text-primary">Main Character</span> Era
            </h2>
            <p className="text-xl text-muted-foreground">Every spice tells a story. What's yours?</p>
          </div>

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg font-medium">{error}</p>
            </div>
          )}

       {isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-64 bg-muted animate-pulse" />
        </CardContent>
      </Card>
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product, index) => {
      const pid = product.slug || product._id || product.id || ""
      return (
        <Link key={product._id || product.id || index} href={`/product?id=${pid}`}>
          <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border"
          >
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-xl">{product.name}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )
    })}
  </div>
)}


          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4">
              <Link href="/shop">
                Shop All Spices
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">100K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">50M+</div>
              <div className="text-sm text-muted-foreground">insta Views</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Flavor Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* UGC Section - Social Media Native */}
  <section className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
        The <span className="text-primary">#FlavourzChallenge</span>
      </h2>
      <p className="text-xl text-muted-foreground mb-8">
        Our community is serving looks AND flavors. Join the movement.
      </p>

      {/* ✅ Social Buttons with Real Links */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          <a
            href="https://www.instagram.com/koko_fresh_india?igsh=dHltYm0waWVtZTdu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="mr-2 h-4 w-4" />
            Follow @kokofresh
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          <a
            href="https://x.com/KOKOFresh_IN"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Tweet #FlavourzChallenge
          </a>
        </Button>
      </div>
    </div>

    {/* Reels Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
  {reels.map((reel) => (
    <div
      key={reel._id}
      className="rounded-lg shadow-lg p-2 bg-white/10 backdrop-blur-sm border border-white/20"
    >
      <div className="relative w-full overflow-hidden rounded-lg">
        <iframe
          src={`${reel.url}embed`}
          width="100%"
          height="500"
          frameBorder="0"
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          className="rounded-lg w-full min-h-[450px] md:min-h-[500px] scale-[1.01] origin-top"
          style={{
            transformOrigin: "top center",
          }}
        />
      </div>

      {/* <h3 className="mt-2 text-lg font-semibold text-danger">{reel.title}</h3>
      {reel.thumbnail && (
        <p className="text-gray-300 text-sm">{reel.thumbnail}</p>
      )} */}
    </div>
  ))}
</div>


    {/* CTA Section */}
    <div className="text-center">
      <p className="text-lg text-muted-foreground mb-6">
        Ready to join the flavor revolution? Tag us and get featured!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
        >
          <a
            href="https://www.instagram.com/koko_fresh_india?igsh=dHltYm0waWVtZTdu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="mr-2 h-5 w-5" />
            Post Your Creation
          </a>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold bg-transparent"
        >
          <a
            href="https://www.youtube.com/@kokofresh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube className="mr-2 h-5 w-5" />
            Watch Tutorials
          </a>
        </Button>
      </div>
    </div>
  </div>
</section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">Ready to Level Up Your Kitchen Game?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join 100K+ Gen Z food lovers who've already upgraded their spice game. Your taste buds (and your followers)
            will thank you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-4"
            >
              Shop Now - Free Shipping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-4 bg-transparent"
            >
              Get Recipe Inspo
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">✨ Use code GENZ20 for 20% off your first order ✨</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
