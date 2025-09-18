import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Heart, Users, Award, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20" />
        <img
          src="/women-cooking-brunch-table-editorial.jpg"
          alt="Women cooking at brunch table"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
            Not your grandma's masala. But inspired by her.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-balance font-light">Where heritage meets hustle in every jar</p>
        </div>
      </section>

      {/* Story Flow - Split Panels */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Panel 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <img
                src="/heritage-spice-grinding-sketch.jpg"
                alt="Heritage spice grinding illustration"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-3xl font-bold mb-6 text-balance">Rooted in Tradition</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our story begins in the bustling spice markets of Old Delhi, where our founder's grandmother would
                carefully select each spice by touch, smell, and intuition. These weren't just ingredients – they were
                the foundation of family memories, passed down through generations of home cooks.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We honor these time-tested methods while embracing modern quality standards and sustainable sourcing
                practices.
              </p>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6 text-balance">Crafted for Today</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                But we're not stuck in the past. Today's home cooks need spices that work with their busy lifestyles –
                pre-measured blends that deliver authentic flavors without the guesswork, packaging that keeps spices
                fresh longer, and recipes that fit into modern meal planning.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every product is tested in real kitchens by real people who understand that great food brings people
                together, whether it's a quick weeknight dinner or a weekend feast.
              </p>
            </div>
            <div>
              <img
                src="/modern-kitchen-lifestyle-cooking.jpg"
                alt="Modern kitchen lifestyle"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Panel 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <img
                src="/sustainable-farming-illustration.jpg"
                alt="Sustainable farming practices"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-3xl font-bold mb-6 text-balance">Grown with Care</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We work directly with small-scale farmers across India, ensuring fair prices and sustainable growing
                practices. Our spices are grown without harmful pesticides, harvested at peak flavor, and processed
                within days to lock in freshness.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When you choose Flavourz of India, you're supporting farming communities and preserving traditional
                agricultural knowledge for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="font-serif text-4xl md:text-5xl font-bold mb-8 text-balance leading-tight">
            "We don't sell masala. We bottle stories."
          </blockquote>
          <p className="text-xl text-muted-foreground">
            Every jar contains the passion of farmers, the wisdom of tradition, and the innovation of modern cooking.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-center mb-12 text-balance">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-3">Authenticity</h3>
                <p className="text-muted-foreground">
                  Every recipe is tested by home cooks and approved by grandmothers across India.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-muted-foreground">
                  Supporting eco-friendly farming and packaging that respects our planet.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Building connections between farmers, cooks, and food lovers worldwide.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  Small-batch processing and rigorous testing ensure consistent excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6 text-balance">Ready to Start Your Flavor Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of home cooks who've discovered the difference that authentic, high-quality spices make.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Shop Our Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
