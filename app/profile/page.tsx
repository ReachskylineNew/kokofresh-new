"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Bell,
  Settings,
  User,
  Edit3,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useUser } from "@/context/user-context"
// ⬅️ add setContact in your user-context
 // ✅ get context

export default function ProfilePage() {

  const router = useRouter()
  const { profile, contact, loading,setContact } = useUser()

  // ----- Orders -----
  const [orders, setOrders] = useState<any[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!contact?._id) return
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactId: contact._id }),
        })

        const data = await res.json()

        // ✅ Fallback safeguard filter on client side
        const filteredOrders = (data.orders || []).filter((o: any) => o.buyerInfo?.contactId === contact._id)

        setOrders(filteredOrders)
        console.log("🛒 Orders (after local filter):", filteredOrders)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      }
    }
    fetchOrders()
  }, [contact])

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id)
  }

  // ----- Edit Contact (NEW) -----
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    subdivision: "",
    postalCode: "",
    country: "",
    countryFullname: "",
  })

  // hydrate form from current contact whenever modal opens or contact changes
  useEffect(() => {
    if (!contact) return
    const addr = contact?.info?.addresses?.items?.[0]?.address || {}
    setForm({
      email: contact?.primaryInfo?.email || "",
      phone: contact?.primaryInfo?.phone || "",
      addressLine1: addr?.addressLine1 || "",
      city: addr?.city || "",
      subdivision: addr?.subdivision || "",
      postalCode: addr?.postalCode || "",
      country: addr?.country || "",
      countryFullname: addr?.countryFullname || "",
    })
  }, [contact, editOpen])




const handleSave = async () => {
  if (!contact?._id) return

  try {
    setSaving(true)

    // --- Validation ---
    if (form.country.length !== 2) {
      toast.error("❌ Country code must be 2 letters (e.g., IN, US, UK)")
      setSaving(false)
      return
    }

    const digits = form.phone.replace(/\D/g, "")
    if (digits.length < 10) {
      toast.error("❌ Phone number must be at least 10 digits")
      setSaving(false)
      return
    }

    const res = await fetch("/api/update-contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactId: contact._id,
        info: {
          emails: {
            items: [
              {
                email: form.email,
                primary: true,
                tag: "UNTAGGED",
              },
            ],
          },
          phones: {
            items: [
              {
                countryCode: form.country.toUpperCase(),
                phone: digits,
                primary: true,
                tag: "MOBILE",
              },
            ],
          },
          addresses: {
            items: [
              {
                tag: "SHIPPING",
                address: {
                  addressLine1: form.addressLine1,
                  city: form.city,
                  subdivision: form.subdivision,
                  postalCode: form.postalCode,
                  country: form.country.toUpperCase(),
                  countryFullname: form.countryFullname,
                },
              },
            ],
          },
        },
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      // handle duplication or backend errors
      if (res.status === 409) {
        toast.error("⚠️ Phone number already exists for another contact")
      } else {
        toast.error(`❌ ${data.error || "Failed to update"}`)
      }
      throw new Error(data.error || "Failed to update")
    }

    console.log("✅ Contact updated:", data.contact)

    // Update context immediately
    setContact(data.contact)

    setEditOpen(false)
    toast.success("✅ Contact updated successfully!")
  } catch (err: any) {
    console.error("❌ Save failed:", err)
    toast.error(err.message || "Something went wrong")
  } finally {
    setSaving(false)
  }
}





  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pb-6">
        <div className="px-4 pt-4 pb-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 lg:p-8 xl:p-10">
                <div className="flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center gap-4 lg:gap-8">
                  <div className="relative flex-shrink-0">
                    {profile?.profile?.photo?.url ? (
                      <img
                        src={`/api/proxy-image?url=${encodeURIComponent(profile.profile.photo.url)}`}
                        alt={profile?.profile?.nickname || "Profile"}
                        className="w-20 h-20 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-2xl border-4 border-background shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-muted rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
                        <User className="h-8 w-8 sm:h-6 sm:w-6 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full border-3 border-background"></div>
                  </div>

                  <div className="flex-1 text-center sm:text-left lg:text-left space-y-2 lg:space-y-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-3xl font-bold text-foreground tracking-tight">
                      {profile?.profile?.nickname || "Your Account"}
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg lg:text-lg xl:text-lg font-medium">
                      Welcome back! Manage your account and orders
                    </p>
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 lg:px-4 lg:py-2 text-sm lg:text-sm font-semibold">
                      ✓ Verified Customer
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="px-4 space-y-6 lg:px-8 xl:px-12 2xl:px-16 lg:space-y-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              <Card className="shadow-lg border-0 xl:col-span-2">
                <CardHeader className="border-b bg-muted/30 px-4 py-4 lg:px-6 lg:py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg lg:text-xl xl:text-xl font-bold text-foreground flex items-center gap-2 lg:gap-3">
                      <div className="w-1 h-6 lg:h-8 bg-primary rounded-full"></div>
                      Contact Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditOpen(true)}
                      className="text-primary border-primary/20 hover:bg-primary/10 font-semibold px-3 py-2 lg:px-4 lg:py-3 rounded-lg h-9 lg:h-10 lg:text-sm"
                    >
                      <Edit3 className="h-4 w-4 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 space-y-6 lg:space-y-8">
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-muted/20 rounded-xl">
                      <div className="w-10 h-10 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="h-5 w-5 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm lg:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1 lg:mb-2">
                          Primary Email
                        </p>
                        <p className="text-foreground font-semibold text-base lg:text-base break-all">
                          {contact?.primaryInfo?.email || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-muted/20 rounded-xl">
                      <div className="w-10 h-10 lg:w-10 lg:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="h-5 w-5 lg:h-5 lg:w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm lg:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1 lg:mb-2">
                          Primary Phone
                        </p>
                        <p className="text-foreground font-semibold text-base lg:text-base">
                          {contact?.primaryInfo?.phone || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-muted/20 rounded-xl">
                      <div className="w-10 h-10 lg:w-10 lg:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-5 w-5 lg:h-5 lg:w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm lg:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 lg:mb-3">
                          Default Shipping Address
                        </p>
                        {contact?.info?.addresses?.items?.length ? (
                          <div className="bg-background rounded-lg p-3 lg:p-4 border space-y-1 lg:space-y-2">
                            <p className="font-semibold text-foreground lg:text-base">
                              {contact.info.addresses.items[0].address?.addressLine1}
                            </p>
                            <p className="text-muted-foreground text-sm lg:text-sm">
                              {contact.info.addresses.items[0].address?.city},{" "}
                              {contact.info.addresses.items[0].address?.subdivision},{" "}
                              {contact.info.addresses.items[0].address?.postalCode}
                            </p>
                            <p className="text-muted-foreground text-sm lg:text-sm">
                              {contact.info.addresses.items[0].address?.countryFullname ||
                                contact.info.addresses.items[0].address?.country}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 lg:p-4">
                            <p className="text-amber-800 dark:text-amber-200 font-medium text-sm lg:text-sm">
                              No address on file
                            </p>
                            <p className="text-amber-600 dark:text-amber-300 text-xs lg:text-xs mt-1">
                              Add a shipping address to complete your profile
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="border-b bg-muted/30 px-4 py-4 lg:px-6 lg:py-6">
                  <CardTitle className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2 lg:gap-3">
                    <div className="w-1 h-6 lg:h-8 bg-primary rounded-full"></div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 lg:gap-4">
                    <Button
                      variant="outline"
                      className="justify-start text-left bg-background hover:bg-muted border-border hover:border-primary/30 font-semibold py-4 lg:py-5 px-4 lg:px-5 rounded-xl h-auto group"
                    >
                      <div className="w-10 h-10 lg:w-10 lg:h-10 bg-muted group-hover:bg-primary/10 rounded-lg flex items-center justify-center mr-3 lg:mr-4 transition-colors">
                        <Settings className="h-5 w-5 lg:h-5 lg:w-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground lg:text-base">Account Settings</div>
                        <div className="text-xs lg:text-xs text-muted-foreground">Manage preferences</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start text-left bg-background hover:bg-muted border-border hover:border-primary/30 font-semibold py-4 lg:py-5 px-4 lg:px-5 rounded-xl h-auto group"
                    >
                      <div className="w-10 h-10 lg:w-10 lg:h-10 bg-muted group-hover:bg-primary/10 rounded-lg flex items-center justify-center mr-3 lg:mr-4 transition-colors">
                        <ShoppingBag className="h-5 w-5 lg:h-5 lg:w-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground lg:text-base">Track Orders</div>
                        <div className="text-xs lg:text-xs text-muted-foreground">View order status</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start text-left bg-background hover:bg-muted border-border hover:border-primary/30 font-semibold py-4 lg:py-5 px-4 lg:px-5 rounded-xl h-auto group sm:col-span-1"
                    >
                      <div className="w-10 h-10 lg:w-10 lg:h-10 bg-muted group-hover:bg-primary/10 rounded-lg flex items-center justify-center mr-3 lg:mr-4 transition-colors">
                        <Bell className="h-5 w-5 lg:h-5 lg:w-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground lg:text-base">Notifications</div>
                        <div className="text-xs lg:text-xs text-muted-foreground">Manage alerts</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-0 mt-6 lg:mt-8">
              <CardHeader className="border-b bg-muted/30 px-4 py-4 lg:px-6 lg:py-6">
                <CardTitle className="text-lg lg:text-xl xl:text-xl font-bold text-foreground flex items-center gap-2 lg:gap-3">
                  <div className="w-1 h-6 lg:h-8 bg-primary rounded-full"></div>
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div className="text-center py-12 lg:py-16 px-4">
                    <div className="w-16 h-16 lg:w-18 lg:h-18 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                      <ShoppingBag className="h-8 w-8 lg:h-9 lg:w-9 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium text-lg lg:text-lg">No orders found</p>
                    <p className="text-muted-foreground text-sm lg:text-sm mt-1">Your order history will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {orders.map((order, index) => {
                      const isExpanded = expandedOrder === order._id
                      return (
                        <div key={order._id} className="bg-background">
                          <div
                            className="p-4 lg:p-6 cursor-pointer hover:bg-muted/30 transition-all duration-200 active:bg-muted/50"
                            onClick={() => toggleExpand(order._id)}
                          >
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                                  <span className="font-bold text-foreground text-base lg:text-lg xl:text-lg">
                                    #{order.number}
                                  </span>
                                  <Badge className="bg-primary/10 text-primary border-0 text-xs lg:text-xs px-2 py-0.5 lg:px-3 lg:py-1">
                                    Track Order
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm lg:text-sm">
                                  {new Date(order._createdDate).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 lg:gap-4">
                                <div className="text-right">
                                  <p className="font-bold text-foreground text-lg lg:text-lg xl:text-lg">
                                    {order.priceSummary?.total?.formattedAmount || "—"}
                                  </p>
                                </div>
                                <div className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center">
                                  {isExpanded ? (
                                    <ChevronDown className="h-5 w-5 lg:h-5 lg:w-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 lg:h-5 lg:w-5 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="bg-muted/20 px-4 py-4 lg:px-6 lg:py-6 border-t">
                              <div className="space-y-4 lg:space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                  {order.lineItems?.map((item: any, i: number) => (
                                    <div key={i} className="bg-background rounded-xl p-4 lg:p-5 border shadow-sm">
                                      <div className="flex gap-3 lg:gap-4">
                                        {item.image ? (
                                          <img
                                            src={
                                              item.image.replace(
                                                "wix:image://v1/",
                                                "https://static.wixstatic.com/media/",
                                              ) || "/placeholder.svg"
                                            }
                                            alt={item.productName?.original}
                                            className="w-16 h-16 lg:w-18 lg:h-18 object-cover rounded-lg border flex-shrink-0"
                                          />
                                        ) : (
                                          <div className="w-16 h-16 lg:w-18 lg:h-18 bg-muted flex items-center justify-center rounded-lg border flex-shrink-0">
                                            <Package className="h-6 w-6 lg:h-7 lg:w-7 text-muted-foreground" />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-foreground text-base lg:text-base mb-1 lg:mb-2 line-clamp-2">
                                            {item.productName?.original}
                                          </p>
                                          <p className="text-xs lg:text-xs text-muted-foreground mb-2 lg:mb-3">
                                            SKU: {item.physicalProperties?.sku || "—"}
                                          </p>
                                          <div className="flex items-center justify-between">
                                            <div className="space-y-1 lg:space-y-2">
                                              <p className="text-sm lg:text-sm font-semibold text-foreground">
                                                {item.price?.formattedAmount || "—"}
                                              </p>
                                              <p className="text-xs lg:text-xs text-muted-foreground bg-muted px-2 py-1 lg:px-3 lg:py-2 rounded-full w-fit">
                                                Qty: {item.quantity}
                                              </p>
                                            </div>
                                            <p className="font-bold text-foreground text-lg lg:text-lg">
                                              {item.totalPriceAfterTax?.formattedAmount || "—"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="bg-background rounded-xl p-4 lg:p-5 border shadow-sm">
                                  <div className="space-y-2 lg:space-y-3 text-sm lg:text-sm">
                                    <div className="flex justify-between items-center py-1 lg:py-2">
                                      <span className="text-muted-foreground">Subtotal</span>
                                      <span className="font-semibold text-foreground">
                                        {order.priceSummary?.subtotal?.formattedAmount || "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 lg:py-2">
                                      <span className="text-muted-foreground">Shipping</span>
                                      <span className="font-semibold text-foreground">
                                        {order.priceSummary?.shipping?.formattedAmount || "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 lg:py-2">
                                      <span className="text-muted-foreground">Tax</span>
                                      <span className="font-semibold text-foreground">
                                        {order.priceSummary?.tax?.formattedAmount || "—"}
                                      </span>
                                    </div>
                                    <div className="border-t pt-2 lg:pt-3 mt-2 lg:mt-3">
                                      <div className="flex justify-between items-center py-1 lg:py-2">
                                        <span className="font-bold text-foreground lg:text-base">Total</span>
                                        <span className="font-bold text-foreground text-lg lg:text-lg">
                                          {order.priceSummary?.total?.formattedAmount || "—"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 lg:py-2">
                                        <span className="font-bold text-green-600 dark:text-green-400 lg:text-base">
                                          Amount Paid
                                        </span>
                                        <span className="font-bold text-green-600 dark:text-green-400 lg:text-lg">
                                          {order.balanceSummary?.paid?.formattedAmount || "—"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 lg:pb-6">
            <DialogTitle className="text-xl lg:text-xl xl:text-2xl font-bold">Edit Contact Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2 lg:space-y-3">
                <Label htmlFor="email" className="text-sm lg:text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-12 lg:h-12 text-base lg:text-base"
                />
              </div>

              <div className="space-y-2 lg:space-y-3">
                <Label htmlFor="phone" className="text-sm lg:text-sm font-semibold">
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="h-12 lg:h-12 text-base lg:text-base"
                />
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="space-y-2 lg:space-y-3">
                <Label htmlFor="addressLine1" className="text-sm lg:text-sm font-semibold">
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  placeholder="Street, house / flat"
                  value={form.addressLine1}
                  onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                  className="h-12 lg:h-12 text-base lg:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2 lg:space-y-3">
                  <Label htmlFor="city" className="text-sm lg:text-sm font-semibold">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="h-12 lg:h-12 text-base lg:text-base"
                  />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <Label htmlFor="subdivision" className="text-sm lg:text-sm font-semibold">
                    State/Province
                  </Label>
                  <Input
                    id="subdivision"
                    value={form.subdivision}
                    onChange={(e) => setForm((f) => ({ ...f, subdivision: e.target.value }))}
                    className="h-12 lg:h-12 text-base lg:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2 lg:space-y-3">
                  <Label htmlFor="postalCode" className="text-sm lg:text-sm font-semibold">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                    className="h-12 lg:h-12 text-base lg:text-base"
                  />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <Label htmlFor="country" className="text-sm lg:text-sm font-semibold">
                    Country Code
                  </Label>
                  <Input
                    id="country"
                    placeholder="e.g., IN"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value.toUpperCase() }))}
                    className="h-12 lg:h-12 text-base lg:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 lg:space-y-3">
                <Label htmlFor="countryFullname" className="text-sm lg:text-sm font-semibold">
                  Country
                </Label>
                <Input
                  id="countryFullname"
                  placeholder="e.g., India"
                  value={form.countryFullname}
                  onChange={(e) => setForm((f) => ({ ...f, countryFullname: e.target.value }))}
                  className="h-12 lg:h-12 text-base lg:text-base"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 lg:pt-8 gap-3 sm:gap-2 lg:gap-4">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={saving}
              className="flex-1 sm:flex-none h-12 lg:h-12 sm:h-10 lg:text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none h-12 lg:h-12 sm:h-10 lg:text-sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
