"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Truck,
  CreditCard,
  ChevronRight,
} from "lucide-react"

// ✅ Import Navigation + Footer like ShopPage
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  const orderData = {
    orderNumber: "10035",
    status: { payment: "PAID", fulfillment: "FULFILLED" },
    placedOn: "Sep 2, 2025, 7:25 PM",
    items: [
      {
        name: "Curry Leaves Chutney Powder",
        sku: "KOKO038",
        weight: "100gms",
        price: 70.0,
        quantity: 1,
        total: 70.0,
        status: "Fulfilled",
        trackingId: "7D118392452",
      },
    ],
    pricing: {
      items: 70.0,
      shipping: 0.0,
      tax: 0.0,
      total: 70.0,
      customerPaid: 70.0,
    },
    customer: {
      name: "Rajesh T",
      email: "rajesh.thangapandim@gmail.com",
      phone: "9626899770",
    },
    delivery: {
      method: "Standard Shipping",
      timeframe: "2-3 Business working days",
    },
    address: {
      name: "Rajesh T",
      street: "794, karpaga nagar 3rd Street, k.pudur",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625007",
      country: "India",
      phone: "9626899770",
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Navigation */}
      <Navigation />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Your Account</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  Verified Customer
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Contact Information */}
              <Card className="shadow-sm border">
                <CardHeader className="border-b bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="h-4 w-4" />
                        Primary Email
                      </div>
                      <p className="text-gray-900 font-medium">rajesh.thangapandim@gmail.com</p>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                        SUBSCRIBED
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="h-4 w-4" />
                        Primary Phone
                      </div>
                      <p className="text-gray-900 font-medium">+91 9626899770</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4" />
                        Default Shipping Address
                      </div>
                      <div className="text-gray-900">
                        <p>794, Karpaga Nagar 3rd Street, K.Pudur</p>
                        <p>Madurai, Tamil Nadu 625007, India</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase History */}
              <Card className="shadow-sm border">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-lg font-semibold text-gray-900">Purchase History</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">1</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">₹70.00</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">30</div>
                      <div className="text-sm text-gray-600">Days Period</div>
                    </div>
                  </div>

                  {/* Order modal */}
                  <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        View Order History
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-xl font-semibold">Order #{orderData.orderNumber}</DialogTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className="bg-green-100 text-green-800">{orderData.status.payment}</Badge>
                          <Badge className="bg-blue-100 text-blue-800">{orderData.status.fulfillment}</Badge>
                          <span className="text-sm text-gray-600">Placed on {orderData.placedOn}</span>
                        </div>
                      </DialogHeader>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Order items */}
                        <div className="lg:col-span-2 space-y-4">
                          <Card className="shadow-sm">
                            <CardHeader className="bg-gray-50 border-b">
                              <CardTitle className="text-base">Items (1)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="bg-blue-50 p-3 rounded mb-4">
                                <h4 className="font-medium text-sm text-blue-900">Products to Ship</h4>
                              </div>

                              {orderData.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 p-4 border rounded-lg bg-white"
                                >
                                  <div className="w-12 h-12 bg-orange-100 rounded flex items-center justify-center">
                                    <Package className="h-6 w-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                                    <p className="text-sm text-gray-600">Weight: {item.weight}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">₹{item.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-center">
                                    <Badge className="bg-green-100 text-green-800 mb-2">{item.status}</Badge>
                                    <p className="text-xs text-blue-600">{item.trackingId}</p>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          {/* Payment summary */}
                          <Card className="shadow-sm">
                            <CardHeader className="bg-gray-50 border-b">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Payment Summary
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Items</span>
                                  <span>₹{orderData.pricing.items.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Shipping</span>
                                  <span>₹{orderData.pricing.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Tax</span>
                                  <span>₹{orderData.pricing.tax.toFixed(2)}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>₹{orderData.pricing.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                          <Card className="shadow-sm">
                            <CardHeader className="bg-gray-50 border-b">
                              <CardTitle className="text-base">Order Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Customer</h4>
                                <p className="text-sm font-medium">{orderData.customer.name}</p>
                                <p className="text-sm text-gray-600">{orderData.customer.email}</p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                                  <Truck className="h-4 w-4" />
                                  Delivery
                                </h4>
                                <p className="text-sm">{orderData.delivery.method}</p>
                                <p className="text-sm text-gray-600">{orderData.delivery.timeframe}</p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Shipping Address
                                </h4>
                                <div className="text-sm space-y-1">
                                  <p>{orderData.address.name}</p>
                                  <p>{orderData.address.street}</p>
                                  <p>
                                    {orderData.address.city}, {orderData.address.state}{" "}
                                    {orderData.address.pincode}
                                  </p>
                                  <p>{orderData.address.country}</p>
                                  <p>{orderData.address.phone}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="shadow-sm border">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-lg font-semibold text-gray-900">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">Email Notifications</span>
                          <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                            SUBSCRIBED
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive updates about your orders and account
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">Marketing Emails</h3>
                          <p className="text-sm text-gray-600">
                            Get updates about new products and offers
                          </p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                      >
                        Manage All Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border sticky top-6">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    Track Orders
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Payment Methods
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  )
}
