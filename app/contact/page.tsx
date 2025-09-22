import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Twitter,
  Youtube,
  Zap,
  Heart,
  Headphones,
  Package,
  Users,
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
        {/* Floating spice elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full blur-xl float-animation" />
        <div
          className="absolute bottom-32 right-16 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl float-animation"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-8">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">We're Here to Help</span>
          </div>

          <h1 className="font-black text-5xl md:text-7xl lg:text-8xl mb-6 text-balance bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
            Let's Talk Spices
          </h1>

          <p className="text-2xl md:text-3xl mb-4 text-balance font-bold">
            Got Questions? We've Got <span className="text-primary">Answers</span> 🌶️
          </p>

          <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Whether you need cooking tips, have feedback, or just want to chat about spices, we're always down for a
            conversation. Hit us up!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Choose Your <span className="text-primary">Vibe</span>
            </h2>
            <p className="text-xl text-muted-foreground">Pick the way you want to connect. We're everywhere you are.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageCircle className="h-12 w-12 text-primary" />,
                title: "Live Chat",
                description: "Instant answers, real humans. Available 9 AM - 9 PM IST.",
                action: "Start Chatting",
                highlight: "Fastest Response",
              },
              {
                icon: <Instagram className="h-12 w-12 text-primary" />,
                title: "Social DMs",
                description: "Slide into our DMs on Instagram or Twitter. We're pretty active.",
                action: "@flavourzindia",
                highlight: "Most Fun",
              },
              {
                icon: <Mail className="h-12 w-12 text-primary" />,
                title: "Email Us",
                description: "For detailed questions or business inquiries. We reply within 24 hours.",
                action: "hello@flavourzindia.com",
                highlight: "Most Detailed",
              },
              {
                icon: <Phone className="h-12 w-12 text-primary" />,
                title: "Call Us",
                description: "Sometimes you just need to talk it out. We get it.",
                action: "+91 98765 43210",
                highlight: "Most Personal",
              },
            ].map((method, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{method.icon}</div>
                  <div className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs mb-4">
                    {method.highlight}
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-card-foreground">{method.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{method.description}</p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Drop Us a <span className="text-primary">Line</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Fill out the form below and we'll get back to you faster than you can say "garam masala"
            </p>
          </div>

          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-card-foreground mb-2">First Name *</label>
                    <Input
                      placeholder="What should we call you?"
                      className="border-2 border-muted focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-card-foreground mb-2">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="border-2 border-muted focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2">What's This About? *</label>
                  <select className="w-full p-3 border-2 border-muted focus:border-primary rounded-md bg-background">
                    <option>Choose your topic...</option>
                    <option>Product Questions</option>
                    <option>Order Support</option>
                    <option>Recipe Help</option>
                    <option>Business Inquiry</option>
                    <option>Feedback & Suggestions</option>
                    <option>Press & Media</option>
                    <option>Just Saying Hi!</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2">Tell Us More *</label>
                  <Textarea
                    placeholder="Spill the tea... or should we say, spill the spices? 🌶️"
                    rows={6}
                    className="border-2 border-muted focus:border-primary resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="newsletter" className="rounded border-2 border-muted" />
                  <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                    Yes, I want to receive recipe tips, new product updates, and exclusive offers! (We promise not to
                    spam - we're too busy grinding spices for that)
                  </label>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg py-4"
                >
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">
              Quick <span className="text-primary">Answers</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              The questions everyone asks (and the answers that'll save you time)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Package className="h-8 w-8 text-primary" />,
                question: "How fresh are your spices really?",
                answer: "Ground within 7 days of shipping. We literally have a 'grind date' on every package. No cap.",
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                question: "How fast do you ship?",
                answer:
                  "2-3 days across India. Free shipping on orders above ₹499. We're faster than your food delivery app.",
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                question: "Are your spices organic?",
                answer:
                  "Most of them, yes! We source from certified organic farms. Check individual product pages for details.",
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                question: "Do you have bulk pricing?",
                answer:
                  "Perfect for restaurants, hostels, or if you're just really into spices. DM us for custom quotes.",
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                question: "Can I return products?",
                answer: "If you're not 100% happy, we'll make it right. 30-day return policy, no questions asked.",
              },
              {
                icon: <Headphones className="h-8 w-8 text-primary" />,
                question: "Do you provide recipe support?",
                answer:
                  "Yes! Our team includes actual chefs. Hit us up for cooking tips, recipe modifications, or flavor pairing advice.",
              },
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{faq.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-card-foreground">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-black text-4xl md:text-5xl mb-6 text-balance">
                Come Say <span className="text-primary">Hi</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Our HQ</h3>
                    <p className="text-muted-foreground">
                      Flavourz India Pvt Ltd
                      <br />
                      Block A, Spice Garden Complex
                      <br />
                      Sector 18, Gurgaon - 122015
                      <br />
                      Haryana, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM IST
                      <br />
                      Saturday: 10:00 AM - 4:00 PM IST
                      <br />
                      Sunday: Closed (we're grinding spices)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Addresses</h3>
                    <p className="text-muted-foreground">
                      General: hello@flavourzindia.com
                      <br />
                      Business: business@flavourzindia.com
                      <br />
                      Press: press@flavourzindia.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Instagram className="mr-2 h-4 w-4" />
                  @flavourzindia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  @flavourzindia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  Flavourz India
                </Button>
              </div>
            </div>

            <div className="relative">
              <img src="/modern-office-space-with-spices-and-young-team-wor.jpg" alt="Flavourz India Office" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
                <div className="text-2xl font-black mb-2">24/7</div>
                <div className="text-sm">Flavor Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-black text-4xl md:text-6xl mb-6 text-balance">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't be shy! We love talking about spices almost as much as we love making them. Reach out and let's start
            a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-4"
            >
              Start Live Chat
              <MessageCircle className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-4 bg-transparent"
            >
              <Instagram className="mr-2 h-5 w-5" />
              DM Us on Instagram
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">✨ Response time: Usually under 2 hours ✨</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
