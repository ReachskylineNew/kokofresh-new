"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  Share2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "../../../hooks/use-cart";

// ⚡ Use a flexible type for Wix products
type WixProduct = any;

export default function ProductPage() {
  const { add } = useCart();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<WixProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("about");
  const [error, setError] = useState<string | null>(null);

  // variant selection
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        console.log("Full product data:", data);
        setProduct(data.product);

        // init default option if exists
        if (data.product?.productOptions?.length) {
          const defaults: Record<string, string> = {};
          data.product.productOptions.forEach((opt: any) => {
            const firstChoice = opt.choices.find((c: any) => c.inStock);
            if (firstChoice) defaults[opt.name] = firstChoice.value;
          });
          setSelectedOptions(defaults);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load product");
      }
    };
    if (productId) load();
  }, [productId]);

  // 🟢 Find selected variant
  const selectedVariant = product?.variants?.find((v: any) =>
    Object.entries(selectedOptions).every(
      ([name, value]) => v.choices?.[name] === value
    )
  );

  // 🟢 Display values (variant > product fallback)
  const displayPrice =
    selectedVariant?.variant?.priceData?.price ??
    product?.priceData?.price ??
    product?.price?.price;

  const displayPriceFormatted =
    selectedVariant?.variant?.priceData?.formatted?.price ??
    product?.priceData?.formatted?.price ??
    product?.price?.formatted?.price ??
    (displayPrice ? `₹${displayPrice}` : null);

  const inStock =
    selectedVariant?.stock?.inStock ??
    product?.stock?.inStock ??
    true;

  const sku =
    selectedVariant?.variant?.sku ?? product?.sku ?? null;

  // 🟢 Handle add to cart
const handleAddToCart = async () => {
  try {
    if (!inStock) throw new Error("Out of stock");

    const optionArray = Object.entries(selectedOptions).map(
      ([name, value]) => ({ name, value })
    );

    console.log(selectedVariant?._id, "selected variant id");
    await add(
      product._id,            // ✅ always product id
      quantity,
      optionArray,
      selectedVariant?._id    // ✅ pass variant separately
    );

    toast.success("Added to cart", {
      description: `${product.name} × ${quantity}`,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Add to cart failed";
    toast.error(message);
  }
};


  // Error screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Loading screen
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <Link href="/shop">
            <Button variant="outline" className="bg-transparent">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1 inline" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={
                  product.media?.items?.[selectedImage]?.image?.url ||
                  product.media?.mainMedia?.image?.url ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
            </div>

            {/* Image Gallery */}
            <div className="flex gap-2">
              {(product.media?.items?.length
                ? product.media.items.map((m: any) => m.image?.url)
                : [product.media?.mainMedia?.image?.url]
              ).map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-md ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">
                {product.name}
              </h1>
              {sku && <p className="text-sm text-muted-foreground">SKU: {sku}</p>}
              {product.description && (
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {product.description
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {displayPriceFormatted && (
                <span className="font-bold text-2xl">{displayPriceFormatted}</span>
              )}
            </div>

            <div className="space-y-4">
              {/* Variant Options */}
              {product.productOptions?.map((opt: any) => (
                <div key={opt.name}>
                  <label className="text-sm font-medium">{opt.name}:</label>
                  <select
                    value={selectedOptions[opt.name] || ""}
                    onChange={(e) =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [opt.name]: e.target.value,
                      }))
                    }
                    className="border border-border rounded-md px-3 py-2 ml-2"
                  >
                    {opt.choices.map((choice: any) => (
                      <option
                        key={choice.value}
                        value={choice.value}
                        disabled={!choice.inStock}
                      >
                        {choice.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {inStock ? "Add to Bag" : "Out of Stock"}
                </Button>

                <Button size="lg" variant="outline" className="bg-transparent">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "about" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveTab("about")}
            >
              Description
            </button>
          </div>

          {activeTab === "about" && (
            <div className="mt-8 max-w-3xl">
              {product.description ? (
                <div
                  className="text-lg leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-muted-foreground">
                  No description available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
