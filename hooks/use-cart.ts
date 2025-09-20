"use client";

import { useEffect, useState } from "react";
import { getVisitorTokenFromBackend } from "../lib/getvisitortoken";

const BASE_URL = "https://www.wixapis.com/ecom/v1";
const APP_ID = "1380b703-ce81-ff05-f115-39571d94dfcd";

type VisitorAuth = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export function useCart() {
  const [cart, setCart] = useState<any>({ lineItems: [] });
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<VisitorAuth | null>(null);

  // 🔑 Init visitor token
  useEffect(() => {
    (async () => {
      try {
        let stored: VisitorAuth | null = null;
        const raw = localStorage.getItem("visitorAuth");
        if (raw) stored = JSON.parse(raw);

        if (!stored || Date.now() > stored.expires_at) {
          const tokenData = await getVisitorTokenFromBackend(stored?.refresh_token);
          console.log("refreshed token", tokenData);
          const newAuth: VisitorAuth = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: Date.now() + tokenData.expires_in * 1000,
          };
          localStorage.setItem("visitorAuth", JSON.stringify(newAuth));
          setAuth(newAuth);
          await load(newAuth);
        } else {
          setAuth(stored);
          await load(stored);
        }
      } catch (err) {
        console.error("❌ Failed to init visitor token", err);
      }
    })();
  }, []);

  // ✅ Load cart
  const load = async (authData = auth) => {
    if (!authData) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/carts/current`, {
        headers: { Authorization: `Bearer ${authData.access_token}` },
      });

      if (res.status === 404) {
        setCart({ lineItems: [] });
        return;
      }

      const data = await res.json();
      setCart(data?.cart || { lineItems: [] });
    } catch (err) {
      console.error("Failed to load cart", err);
      setCart({ lineItems: [] });
    } finally {
      setLoading(false);
    }
  };

// ✅ Add to cart with merge logic
const add = async (
  productId: string,
  qty: number,
  options?: { name: string; value: string }[],
  variantId?: string
) => {
  if (!auth) throw new Error("Visitor token not ready");

  // Build options object { weight: "100gms" }
  const optionsObj =
    options?.reduce((acc, opt) => ({ ...acc, [opt.name]: opt.value }), {}) || {};

  // 🔍 Step 1: check if same variant already in cart
  const existingItem = cart?.lineItems?.find((item: any) => {
    const ref = item.catalogReference;
    const refVariantId = ref?.options?.variantId;
    const refOptions = ref?.options?.options || {};
    return (
      ref?.catalogItemId === productId &&
      refVariantId === variantId &&
      JSON.stringify(refOptions) === JSON.stringify(optionsObj)
    );
  });

  if (existingItem) {
    console.log("🔄 Item exists, updating quantity instead of new add");
    return await updateQuantity(existingItem.id, (existingItem.quantity || 0) + qty);
  }

  // 🔄 Step 2: otherwise, do a normal add-to-cart
  const payload = {
    lineItems: [
      {
        catalogReference: {
          appId: APP_ID,
          catalogItemId: productId,
          options: {
            ...(variantId ? { variantId } : {}),
            ...(Object.keys(optionsObj).length ? { options: optionsObj } : {}),
          },
        },
        quantity: qty,
      },
    ],
  };

  console.log("📤 Add-to-cart payload:", JSON.stringify(payload, null, 2));

  const doAdd = async (accessToken: string) => {
    const res = await fetch(`${BASE_URL}/carts/current/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    return res;
  };

  let res = await doAdd(auth.access_token);

  if (res.status === 401) {
    console.warn("⚠️ Token expired, refreshing...");
    const tokenData = await getVisitorTokenFromBackend(auth.refresh_token);
    const newAuth: VisitorAuth = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    };
    localStorage.setItem("visitorAuth", JSON.stringify(newAuth));
    setAuth(newAuth);

    res = await doAdd(newAuth.access_token);
  }

  const text = await res.text();
  console.log("📥 Raw response:", text);

  const data = JSON.parse(text || "{}");
  setCart(data?.cart || { lineItems: [] });
  return data?.cart;
};


// ✅ Update quantity (bulk endpoint)
const updateQuantity = async (lineItemId: string, qty: number) => {
  if (!auth) return;

  try {
    const res = await fetch(
      `${BASE_URL}/carts/current/update-line-items-quantity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify({
          lineItems: [
            {
              id: lineItemId, // 👈 in payload, not in URL
              quantity: qty,
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Update quantity failed:", errorText);
      throw new Error(`Failed with ${res.status}`);
    }

    const data = await res.json();
    setCart(data?.cart || { lineItems: [] });
  } catch (err) {
    console.error("Update quantity error:", err);
  }
};



  // ✅ Remove item
  const remove = async (lineItemId: string) => {
    if (!auth) return;
    const res = await fetch(`${BASE_URL}/carts/current/remove-line-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
      body: JSON.stringify({ lineItemIds: [lineItemId] }),
    });
    const data = await res.json();
    setCart(data?.cart || { lineItems: [] });
  };

// ✅ Checkout flow (frontend safe, wixapis.com)
const checkout = async () => {
  if (!auth) return;
  if (!cart?.lineItems?.length) {
    console.error("❌ Cannot checkout, cart is empty");
    return;
  }

  try {
    // Step 1: Estimate totals (shipping/tax)
    const estimateRes = await fetch(
      "https://www.wixapis.com/ecom/v1/carts/current/estimate-totals",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify({
          calculateTax: false,
          calculateShipping: true,
        }),
      }
    );

    if (!estimateRes.ok) {
      const errorText = await estimateRes.text();
      throw new Error(`Estimate totals failed: ${errorText}`);
    }

    const estimateData = await estimateRes.json();
    console.log("📦 Totals estimated:", estimateData);

    // Step 2: Create checkout
    const checkoutRes = await fetch(
      "https://www.wixapis.com/ecom/v1/carts/current/create-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify({
          channelType: "WEB", // required
        }),
      }
    );

    if (!checkoutRes.ok) {
      const errorText = await checkoutRes.text();
      throw new Error(`Create checkout failed: ${errorText}`);
    }

    const checkoutData = await checkoutRes.json();
    console.log("✅ Checkout created:", checkoutData);

    // Step 3: Redirect user to Wix checkout page
    if (checkoutData.checkoutUrl) {
      window.location.href = checkoutData.checkoutUrl;
    } else if (checkoutData.checkoutId) {
      // If only checkoutId is returned, build fallback URL
      const fallbackUrl = `https://www.kokofresh.in/checkout?checkoutId=${checkoutData.checkoutId}`;
      window.location.href = fallbackUrl;
    } else {
      throw new Error("No checkout URL returned");
    }
  } catch (err) {
    console.error("❌ Checkout error:", err);
  }
};





  return { cart, loading, add, updateQuantity, remove, checkout };
}
