"use client";

import { useEffect, useState } from "react";
import { wixClient, initVisitorSession } from "../app/utillity/wixclient";

export function useCart() {
  const [cart, setCart] = useState<any>({ lineItems: [] });
  const [loading, setLoading] = useState(true);

  // Load current cart
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await initVisitorSession();
        const res = await wixClient.currentCart.getCurrentCart();
        setCart(res?.cart || { lineItems: [] });
        console.log("herecartdata",res)
      } catch (err: any) {
        if (err.details?.applicationError?.code === "OWNED_CART_NOT_FOUND") {
          setCart({ lineItems: [] });
        } else {
          console.error("Failed to load cart", err);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

// ✅ Add product or variant to cart
const add = async (
  productId: string, // raw product._id (36 chars)
  qty: number,
  options?: { name: string; value: string }[],
  variantId?: string
) => {
  try {
    await initVisitorSession();

    const payload = {
      lineItems: [
        {
          catalogReference: {
            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
            catalogItemId: productId, // ✅ must be 36-char product._id
          },
          quantity: qty,
          options: options || [],
          ...(variantId ? { variantId } : {}), // ✅ include variant only if selected
        },
      ],
    };

    console.log("ADD PAYLOAD:", JSON.stringify(payload, null, 2));

    const resAdd = await wixClient.currentCart.addToCurrentCart(payload);
    const resCart = await wixClient.currentCart.getCurrentCart();

    setCart(resCart?.cart || { lineItems: [] });
    return resCart?.cart;
  } catch (err: any) {
    console.error("Failed to add to cart", err.details || err);
    throw err;
  }
};



  // Update qty
  const updateQuantity = async (lineItemId: string, qty: number) => {
    await initVisitorSession();
    const res = await wixClient.currentCart.updateCurrentCartLineItemQuantity(lineItemId, qty);
    setCart(res?.cart || { lineItems: [] });
  };

  // Remove
  const remove = async (lineItemId: string) => {
    await initVisitorSession();
    const res = await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
    setCart(res?.cart || { lineItems: [] });
  };

  // Checkout
  const checkout = async () => {
    await initVisitorSession();
    const res = await wixClient.currentCart.createCheckoutFromCurrentCart();
    if (res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
    }
  };

  return { cart, loading, add, updateQuantity, remove, checkout };
}
