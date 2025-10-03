"use client"

import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
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
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"


export default function ContactPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    newsletter: false,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    setFormData({
      ...formData,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // ✅ Map frontend → Wix schema keys
      const submissions: Record<string, any> = {}

      if (formData.first_name) submissions["first_name_7a97"] = formData.first_name
      if (formData.last_name) submissions["last_name_8c5e"] = formData.last_name
      if (formData.email) submissions["email_0b8a"] = formData.email
      if (formData.phone) {
        submissions["phone_6f6c"] = formData.phone.startsWith("+91")
          ? formData.phone
          : `+91${formData.phone}`
      }
      if (formData.topic) submissions["topic"] = formData.topic
      if (formData.message) submissions["message"] = formData.message
      submissions["form_field_4f50"] = formData.newsletter

      const payload = {
        submission: {
          submissions,
          status: "PENDING",
        },
      }

      console.log("📦 Final payload:", payload)

      const res = await fetch("/api/form-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (res.ok && result.success) {
        setSuccess(true)
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          topic: "",
          message: "",
          newsletter: false,
        })
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch (err) {
      console.error(err)
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

 const handlePhoneChange = (value: string) => {
  setFormData((prev) => ({ ...prev, phone: value }))
}

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
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
                action: "@kokofresh",
                highlight: "Most Fun",
              },
              {
                icon: <Mail className="h-12 w-12 text-primary" />,
                title: "Email Us",
                description: "For detailed questions or business inquiries. We reply within 24 hours.",
                action: "hello@kokofresh.com",
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

      {/* Contact Form (Updated with working logic) */}
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-card-foreground mb-2">First Name *</label>
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="What should we call you?"
                      className="border-2 border-muted focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-card-foreground mb-2">Last Name</label>
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="(Optional)"
                      className="border-2 border-muted focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2">Email Address *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="border-2 border-muted focus:border-primary"
                    required
                  />
                </div>

               <div>
                  <label className="block text-sm font-bold mb-2">Phone</label>
                  <PhoneInput
                    country={"in"}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputStyle={{
                      width: "100%",
                      border: "2px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2">What's This About? *</label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-muted focus:border-primary rounded-md bg-background"
                    required
                  >
                    <option value="">Choose your topic...</option>
                    <option value="Product Questions">Product Questions</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Recipe Help">Recipe Help</option>
                    <option value="Business Inquiry">Business Inquiry</option>
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                    <option value="Press & Media">Press & Media</option>
                    <option value="Just Saying Hi!">Just Saying Hi!</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2">Tell Us More *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Spill the tea... or should we say, spill the spices? 🌶️"
                    rows={6}
                    className="border-2 border-muted focus:border-primary resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="rounded border-2 border-muted"
                  />
                  <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                    Yes, I want to receive recipe tips, new product updates, and exclusive offers!
                  </label>
                </div>

                {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                {success && (
                  <p className="text-green-600 text-sm font-bold">✅ Thank you! Your message has been submitted.</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg py-4"
                >
                  {loading ? "Sending..." : "Send Message"}
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
                      CKGFlavorz FoodTech Pvt Ltd
                      <br />
                      112, 17th main road, MIG KHB Colony
                      <br />
                      5th block, Koramangala
                      <br />
                      Bangalore 560095
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
                      General: hello@kokofresh.com
                      <br />
                      Business: business@kokofresh.com
                      <br />
                      Press: press@kokofresh.com
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
                  @kokofresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  @kokofresh
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
  <div className="rounded-2xl shadow-2xl overflow-hidden bg-card border-2 border-primary/20">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.243859362772!2d77.6278958153479!3d12.935432919215295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15d1a6edc6db%3A0xb1d6f26a9a7b6ef4!2sCKGFlavorz%20FoodTech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-96"
      title="CKGFlavorz FoodTech Office Location"
    />
  </div>
  <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
    <div className="text-2xl font-black mb-2">📍</div>
    <div className="text-sm">Find Us Here</div>
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
