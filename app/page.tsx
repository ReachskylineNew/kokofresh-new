import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star, Users, Award, Play, Heart, MessageCircle, Share } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
        <div className="absolute inset-0">
          <img
            src="/indian-woman-pouring-spices-over-avocado-toast-in-.jpg"
            alt="Gen Z woman pouring spices over avocado toast"
            className="w-full h-full object-cover"
          />
          {/* Video play overlay to simulate muted video loop */}
          <div className="absolute top-6 left-6">
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
              <Play className="h-4 w-4 text-white fill-white" />
              <span className="text-white text-sm">Live</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance drop-shadow-lg">
            Flavourz of India
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-balance font-light drop-shadow-md">Fresh, Fun, Yours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-foreground bg-black/20 backdrop-blur-sm font-semibold"
            >
              Explore Recipes
            </Button>
          </div>
        </div>
      </section>

      {/* Luxury Panels */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6 text-balance">Small batch. Slow grind. 100% real.</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Every spice in our collection is carefully sourced from family farms across India, ground in small
                batches to preserve maximum flavor and freshness.
              </p>
              <Button className="bg-primary hover:bg-primary/90">Learn Our Process</Button>
            </div>
            <div className="relative">
              <img
                src="/flatlay-of-colorful-indian-spices-on-white-marble-.jpg"
                alt="Spices on marble"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Shop Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-center mb-12 text-balance">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Masala",
                description: "Authentic spice blends",
                image: "/colorful-masala-spice-blend-in-wooden-bowl.jpg",
              },
              {
                title: "Chutney",
                description: "Fresh & tangy condiments",
                image: "/green-mint-chutney-in-glass-jar-with-fresh-herbs.jpg",
              },
              {
                title: "Instant",
                description: "Quick meal solutions",
                image: "/instant-spice-mix-packets-arranged-aesthetically.jpg",
              },
            ].map((category, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-2xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Strip */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6 text-balance">Where heritage meets hustle</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from generations of culinary wisdom, crafted for the modern kitchen. We're bridging the gap between
            traditional Indian flavors and contemporary cooking.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2">4.9/5 Rating</h3>
              <p className="text-muted-foreground">From 2,500+ happy customers</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2">50K+ Community</h3>
              <p className="text-muted-foreground">Food lovers sharing recipes</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2">Award Winning</h3>
              <p className="text-muted-foreground">Best Spice Brand 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* UGC Reel Wall section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 text-balance">#FlavourzOfIndia</h2>
            <p className="text-lg text-muted-foreground">See how our community is cooking up magic</p>
          </div>

          {/* UGC Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                image: "/ugc-dosa-hack-video-thumbnail.jpg",
                username: "@priyaskitchen",
                caption: "3 min Maggi Glow-up with Flavourz masala! 🔥",
                likes: "2.4k",
                isVideo: true,
              },
              {
                image: "/ugc-sambhar-aesthetic-photo.jpg",
                username: "@foodie_gen_z",
                caption: "Her sambhar, but make it aesthetic ✨",
                likes: "1.8k",
                isVideo: false,
              },
              {
                image: "/ugc-date-night-dosa-video.jpg",
                username: "@couples_cook",
                caption: "Date Night Dosa Hack that actually works!",
                likes: "3.2k",
                isVideo: true,
              },
              {
                image: "/ugc-spice-flatlay-photo.jpg",
                username: "@spice_stories",
                caption: "Every spice tells a story 📖",
                likes: "956",
                isVideo: false,
              },
              {
                image: "/ugc-cooking-process-video.jpg",
                username: "@modern_masala",
                caption: "Small batch. Slow grind. 100% real vibes",
                likes: "4.1k",
                isVideo: true,
              },
              {
                image: "/ugc-breakfast-bowl-photo.jpg",
                username: "@healthy_hustle",
                caption: "Morning mood with coconut chutney 🥥",
                likes: "1.5k",
                isVideo: false,
              },
              {
                image: "/ugc-family-cooking-video.jpg",
                username: "@heritage_kitchen",
                caption: "Teaching grandma our new tricks 👵",
                likes: "5.7k",
                isVideo: true,
              },
              {
                image: "/ugc-spice-art-photo.jpg",
                username: "@art_of_spices",
                caption: "When your spice rack is also your art 🎨",
                likes: "2.9k",
                isVideo: false,
              },
            ].map((post, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0 relative">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={`UGC post by ${post.username}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.isVideo && (
                      <div className="absolute top-2 right-2">
                        <Play className="h-4 w-4 text-white fill-white drop-shadow-lg" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                      <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Heart className="h-4 w-4" />
                            <MessageCircle className="h-4 w-4" />
                            <Share className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Post info */}
                  <div className="p-3">
                    <p className="font-medium text-sm mb-1">{post.username}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{post.caption}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">Your kitchen. Your flex. Tag us to feature.</p>
            <Button variant="outline" size="lg" className="font-semibold bg-transparent">
              Upload Your Creation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
