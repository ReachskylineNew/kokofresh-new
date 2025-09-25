"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Heart, Sparkles, TrendingUp, Flame, Award, Target, Zap, Instagram } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/40" />

        {/* Floating spice elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full blur-xl float-animation" />
        <div
          className="absolute bottom-32 right-16 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl float-animation"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
            <Heart className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Our Story Since 2020</span>
          </div>

          <h1 className="font-black text-5xl md:text-7xl lg:text-8xl mb-6 text-balance bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
            More Than Just Spices
          </h1>

          <p className="text-2xl md:text-3xl mb-4 text-balance font-bold text-white">
            We're Building a <span className="text-yellow-400">Flavor Revolution</span> 🌶️
          </p>

          <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            From a small kitchen experiment to India's most loved Gen Z spice brand. This is how we're changing the
            game, one masala at a time.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-bold">The Origin Story</span>
              </div>

              <h2 className="font-black text-4xl md:text-5xl mb-6 text-balance">
                Started in a <span className="text-primary">College Dorm</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  It all started when our founder Priya couldn't find decent spices that didn't taste like cardboard.
                  Living away from home, missing her mom's cooking, she decided to do something about it.
                </p>
                <p>
                  What began as grinding spices in her tiny dorm kitchen for friends quickly became the talk of the
                  campus. Students were literally lining up for her "magic masalas" that made their instant noodles
                  taste like home.
                </p>
                <p>
                  Fast forward 4 years, and we're now the spice brand that gets Gen Z. We understand that you want
                  authentic flavors without the hassle, quality without the lecture, and results that are actually
                  Instagram-worthy.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-primary/10 text-primary rounded-full px-4 py-2">
                  <span className="font-bold text-sm">Founded by Gen Z</span>
                </div>
                <div className="bg-primary/10 text-primary rounded-full px-4 py-2">
                  <span className="font-bold text-sm">Made for Gen Z</span>
                </div>
                <div className="bg-primary/10 text-primary rounded-full px-4 py-2">
                  <span className="font-bold text-sm">Loved by Gen Z</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img src="/young-indian-woman-grinding-spices-in-modern-kitch.jpg" alt="Founder grinding spices" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-black mb-2">100K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              What We <span className="text-primary">Stand For</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our values aren't just pretty words on a wall. They're the reason we get up every morning and grind
              (literally).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-12 w-12 text-primary" />,
                title: "Authenticity First",
                description:
                  "No shortcuts, no compromises. Every blend is tested by real Indian grandmas (seriously, we have a panel).",
                stat: "100% Authentic",
              },
              {
                icon: <Zap className="h-12 w-12 text-primary" />,
                title: "Innovation Always",
                description:
                  "We respect tradition but aren't afraid to shake things up. Ancient recipes meet modern convenience.",
                stat: "Always Evolving",
              },
              {
                icon: <Users className="h-12 w-12 text-primary" />,
                title: "Community Driven",
                description:
                  "Our customers aren't just buyers, they're co-creators. Every product is shaped by your feedback.",
                stat: "By the People",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{value.icon}</div>
                  <h3 className="font-bold text-2xl mb-4 text-card-foreground">{value.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{value.description}</p>
                  <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm">
                    {value.stat}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Meet the <span className="text-primary">Spice Squad</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              The humans behind the hustle. We're young, we're passionate, and we're slightly obsessed with spices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Founder & Chief Spice Officer",
                image: "/young-indian-woman-entrepreneur-smiling.jpg",
                bio: "Started this journey in her dorm room. Now she's the spice queen of Gen Z India.",
                social: "@priya.spices",
              },
              {
                name: "Arjun Patel",
                role: "Head of Product & Taste",
                image: "/young-indian-man-chef-tasting-spices.jpg",
                bio: "Former chef turned spice scientist. If it doesn't taste amazing, it doesn't leave the lab.",
                social: "@arjun.tastes",
              },
              {
                name: "Sneha Gupta",
                role: "Community & Content Lead",
                image: "/young-indian-woman-content-creator-with-spices.jpg",
                bio: "The voice behind our viral content. She makes spices cool (and TikTok famous).",
                social: "@sneha.spices",
              },
            ].map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-xs opacity-90 mb-2">{member.bio}</p>
                      <p className="text-xs font-bold">{member.social}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              We're Kind of a <span className="text-primary">Big Deal</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it. Here's what the world is saying about us.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                award: "Best New Brand 2023",
                org: "Food & Beverage Awards",
                icon: <Award className="h-8 w-8 text-primary" />,
              },
              {
                award: "Gen Z Choice Award",
                org: "Youth Marketing Awards",
                icon: <TrendingUp className="h-8 w-8 text-primary" />,
              },
              {
                award: "Startup of the Year",
                org: "Indian Food Tech",
                icon: <Flame className="h-8 w-8 text-primary" />,
              },
              {
                award: "Social Impact Award",
                org: "Sustainable Business",
                icon: <Heart className="h-8 w-8 text-primary" />,
              },
            ].map((recognition, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{recognition.icon}</div>
                <h3 className="font-bold text-lg mb-2">{recognition.award}</h3>
                <p className="text-sm text-muted-foreground">{recognition.org}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">Ready to Join Our Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Every customer becomes part of our journey. Let's write the next chapter together, one delicious meal at a
            time.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-4"
            >
              Start Your Flavor Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-4 bg-transparent"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow Our Journey
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">✨ Use code STORY20 for 20% off your first order ✨</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
