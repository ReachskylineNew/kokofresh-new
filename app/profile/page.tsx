"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useUser } from "@/context/user-context" // ✅ get context

export default function ProfilePage() {
  const { profile, contact, loading } = useUser()
  const [orders, setOrders] = useState<any[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // Fetch orders
useEffect(() => {
  const fetchOrders = async () => {
    if (!contact?._id) return
    try {
     const res = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",   // 👈 added this
  },
  body: JSON.stringify({ contactId: contact._id }),
})

      const data = await res.json()
      setOrders(data.orders || [])
      console.log("🛒 Ordersnew:", data.orders)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    }
  }
  fetchOrders()
}, [contact])


  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 pointer-events-none"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {profile?.profile?.photo?.url ? (
                    <div className="relative">
                      <img
                        src={`/api/proxy-image?url=${encodeURIComponent(profile.profile.photo.url)}`}
                        alt={profile?.profile?.nickname || "Profile"}
                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="h-8 w-8 text-slate-500" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {profile?.profile?.nickname || "Your Account"}
                    </h1>
                    <p className="text-slate-600 text-lg font-medium">Welcome back! Manage your account and orders</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                  ✓ Verified Customer
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      Contact Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-white font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        Primary Email
                      </div>
                      <p className="text-slate-900 font-semibold text-lg pl-11">{contact?.primaryInfo?.email || "—"}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        Primary Phone
                      </div>
                      <p className="text-slate-900 font-semibold text-lg pl-11">{contact?.primaryInfo?.phone || "—"}</p>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        Default Shipping Address
                      </div>
                      <div className="text-slate-900 pl-11 space-y-1">
                        {contact?.info?.addresses?.items?.length ? (
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="font-semibold">{contact.info.addresses.items[0].address?.addressLine1}</p>
                            <p className="text-slate-600">
                              {contact.info.addresses.items[0].address?.city},{" "}
                              {contact.info.addresses.items[0].address?.subdivision},{" "}
                              {contact.info.addresses.items[0].address?.postalCode}
                            </p>
                            <p className="text-slate-600">{contact.info.addresses.items[0].address?.countryFullname}</p>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-amber-800 font-medium">No address on file</p>
                            <p className="text-amber-600 text-sm">Add a shipping address to complete your profile</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50 px-8 py-6">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-4 font-bold text-slate-700 text-sm px-8 py-4 bg-slate-50 border-b border-slate-100">
                    <span>Order Date</span>
                    <span>Order Number</span>
                    <span>Status</span>
                    <span className="text-right">Total Amount</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium text-lg">No orders found</p>
                      <p className="text-slate-400 text-sm">Your order history will appear here</p>
                    </div>
                  ) : (
                    orders.map((order, index) => {
                      const isExpanded = expandedOrder === order._id
                      return (
                        <div
                          key={order._id}
                          className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                        >
                          <div
                            className="grid grid-cols-4 items-center px-8 py-6 cursor-pointer hover:bg-blue-50/50 transition-all duration-200 group"
                            onClick={() => toggleExpand(order._id)}
                          >
                            <span className="font-medium text-slate-700">
                              {new Date(order._createdDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="font-bold text-slate-900">#{order.number}</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 w-fit">
                              Track Order
                            </span>
                            <div className="text-right flex items-center justify-end gap-3">
                              <span className="font-bold text-slate-900 text-lg">
                                {order.priceSummary?.total?.formattedAmount || "—"}
                              </span>
                              <div className="w-6 h-6 flex items-center justify-center">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                )}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-50/50 px-8 py-6 border-t border-slate-200">
                              <div className="space-y-6">
                                {order.lineItems?.map((item: any, i: number) => (
                                  <div
                                    key={i}
                                    className="flex items-start justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                                  >
                                    <div className="flex gap-4">
                                      {item.image ? (
                                        <img
                                          src={
                                            item.image.replace(
                                              "wix:image://v1/",
                                              "https://static.wixstatic.com/media/",
                                            ) || "/placeholder.svg"
                                          }
                                          alt={item.productName?.original}
                                          className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200 shadow-sm"
                                        />
                                      ) : (
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-xl border-2 border-slate-200">
                                          <Package className="h-8 w-8 text-slate-500" />
                                        </div>
                                      )}
                                      <div className="space-y-2">
                                        <p className="font-bold text-slate-900 text-lg">{item.productName?.original}</p>
                                        <p className="text-sm text-slate-500 font-medium">
                                          SKU: {item.physicalProperties?.sku || "—"}
                                        </p>
                                        {item.descriptionLines?.map((desc: any, j: number) => (
                                          <p key={j} className="text-sm text-slate-600">
                                            <span className="font-semibold">{desc.name?.original}:</span>{" "}
                                            {desc.plainText?.original}
                                          </p>
                                        ))}
                                        <p className="text-sm font-semibold text-slate-700">
                                          Unit Price: {item.price?.formattedAmount || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                      <p className="font-bold text-slate-900 text-xl">
                                        {item.totalPriceAfterTax?.formattedAmount || "—"}
                                      </p>
                                      <p className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                ))}

                                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                                  <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center py-2">
                                      <span className="text-slate-600 font-medium">Subtotal</span>
                                      <span className="font-semibold text-slate-900">
                                        {order.priceSummary?.subtotal?.formattedAmount || "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                      <span className="text-slate-600 font-medium">Shipping</span>
                                      <span className="font-semibold text-slate-900">
                                        {order.priceSummary?.shipping?.formattedAmount || "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                      <span className="text-slate-600 font-medium">Tax</span>
                                      <span className="font-semibold text-slate-900">
                                        {order.priceSummary?.tax?.formattedAmount || "—"}
                                      </span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-3">
                                      <div className="flex justify-between items-center py-2">
                                        <span className="font-bold text-slate-900 text-lg">Total</span>
                                        <span className="font-bold text-slate-900 text-xl">
                                          {order.priceSummary?.total?.formattedAmount || "—"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center py-2">
                                        <span className="font-bold text-emerald-700">Amount Paid</span>
                                        <span className="font-bold text-emerald-700 text-lg">
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
                    })
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden sticky top-8">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50 px-6 py-5">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-slate-100 group-hover:bg-slate-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                      <Settings className="h-4 w-4 text-slate-600" />
                    </div>
                    Account Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </div>
                    Track Orders
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-amber-100 group-hover:bg-amber-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                      <Bell className="h-4 w-4 text-amber-600" />
                    </div>
                    Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
