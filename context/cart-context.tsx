"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

const BASE_URL = "https://www.wixapis.com/ecom/v1";
const APP_ID = "1380b703-ce81-ff05-f115-39571d94df35";

type VisitorAuth = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

type CartItem = {
  id: string;
  quantity: number;
  catalogReference: any;
};

type Cart = {
  lineItems: CartItem[];
};

type CartContextType = {
  cart: Cart;
  loading: boolean;
  add: (productId: string, qty: number, options?: { name: string; value: string }[], variantId?: string) => Promise<any>;
  updateQuantity: (lineItemId: string, qty: number) => Promise<void>;
  remove: (lineItemId: string) => Promise<void>;
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ lineItems: [] });
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<VisitorAuth | null>(null);

  // Create or refresh visitor tokens and persist them in cookies
  const fetchAndPersistTokens = async (existingRefreshToken?: string): Promise<VisitorAuth> => {
    const res = await fetch("/api/visitor-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingRefreshToken ? { refreshToken: existingRefreshToken } : {}),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to obtain visitor tokens: ${errorText}`);
    }

    const data = await res.json();
    const accessToken = data.access_token as string;
    const refreshToken = (data.refresh_token as string) || existingRefreshToken;
    const expiresIn = (data.expires_in as number) ?? 3600; // seconds

    const expiresAtMs = Date.now() + expiresIn * 1000;

    // Persist in cookies in the shape this file expects
    Cookies.set(
      "accessToken",
      JSON.stringify({ value: accessToken, expiresAt: Math.floor(expiresAtMs / 1000) }),
      { sameSite: "Lax" }
    );
    if (refreshToken) {
      // refresh token usually has long expiry, we still store similarly
      Cookies.set("refreshToken", JSON.stringify({ value: refreshToken }), { sameSite: "Lax" });
    }

    const newAuth: VisitorAuth = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAtMs,
    };
    setAuth(newAuth);
    return newAuth;
  };

const ensureAuth = async (): Promise<VisitorAuth> => {
  if (auth && Date.now() < auth.expires_at) return auth;

  const accessRaw = Cookies.get("accessToken");
  const refreshRaw = Cookies.get("refreshToken");

  let parsedAccess: any = null;
  let parsedRefresh: any = null;

  if (accessRaw) parsedAccess = JSON.parse(accessRaw);
  if (refreshRaw) parsedRefresh = JSON.parse(refreshRaw);

  if (parsedAccess?.value && parsedRefresh?.value) {
    // If access token is near expiry (<= 10s), proactively refresh
    const expiresAtMs = parsedAccess.expiresAt ? parsedAccess.expiresAt * 1000 : Date.now();
    if (Date.now() + 10_000 >= expiresAtMs) {
      return fetchAndPersistTokens(parsedRefresh.value);
    }

    const newAuth: VisitorAuth = {
      access_token: parsedAccess.value,
      refresh_token: parsedRefresh.value,
      expires_at: expiresAtMs,
    };
    setAuth(newAuth);
    return newAuth;
  }

  // No cookies yet → create anonymous visitor tokens
  return fetchAndPersistTokens(parsedRefresh?.value);
};


  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const activeAuth = await ensureAuth();
        await load(activeAuth);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Load cart
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

const add = async (
  productId: string,
  qty: number,
  options?: { name: string; value: string }[],
  variantId?: string
) => {
  const activeAuth = await ensureAuth();

  // Convert array of options into object { weight: "200gms", ... }
  const optionsObj =
    options?.reduce((acc, opt) => ({ ...acc, [opt.name]: opt.value }), {}) || {};

  const payload = {
    lineItems: [
      {
        catalogReference: {
          appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e", // ✅ correct appId
          catalogItemId: productId, // product ID passed from UI
          options: {
            ...(variantId ? { variantId } : {}),
            ...(Object.keys(optionsObj).length ? { options: optionsObj } : {}),
          },
        },
        quantity: qty,
      },
    ],
  };

  const res = await fetch(`${BASE_URL}/carts/current/add-to-cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeAuth.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    // Try refreshing using refreshToken via backend, then retry once
    const refreshRaw = Cookies.get("refreshToken");
    let parsedRefresh: any = null;
    if (refreshRaw) {
      try { parsedRefresh = JSON.parse(refreshRaw); } catch {}
    }
    try {
      await fetchAndPersistTokens(parsedRefresh?.value);
      return add(productId, qty, options, variantId);
    } catch (e) {
      // fallthrough to parse error
    }
  }

  const data = await res.json();
  setCart(data?.cart || { lineItems: [] });
  return data?.cart;
};


  // Update quantity
  const updateQuantity = async (lineItemId: string, qty: number) => {
    const activeAuth = await ensureAuth();

    const res = await fetch(`${BASE_URL}/carts/current/update-line-items-quantity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeAuth.access_token}`,
      },
      body: JSON.stringify({ lineItems: [{ id: lineItemId, quantity: qty }] }),
    });

    const data = await res.json();
    setCart(data?.cart || { lineItems: [] });
  };

  // Remove item
  const remove = async (lineItemId: string) => {
    const activeAuth = await ensureAuth();

    const res = await fetch(`${BASE_URL}/carts/current/remove-line-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeAuth.access_token}`,
      },
      body: JSON.stringify({ lineItemIds: [lineItemId] }),
    });

    const data = await res.json();
    setCart(data?.cart || { lineItems: [] });
  };

const checkout = async () => {
  const activeAuth = await ensureAuth();

  if (!cart?.lineItems?.length) {
    console.error("Cannot checkout, cart is empty");
    return;
  }

  try {
    // 1. Estimate totals (important for shipping/tax)
    const estimateRes = await fetch(`${BASE_URL}/carts/current/estimate-totals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeAuth.access_token}`,
      },
      body: JSON.stringify({
        calculateTax: false,
        calculateShipping: true,
      }),
    });

    if (!estimateRes.ok) {
      const errorText = await estimateRes.text();
      throw new Error(`Estimate totals failed: ${errorText}`);
    }

    // 2. Create checkout session
    const checkoutRes = await fetch(`${BASE_URL}/carts/current/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeAuth.access_token}`,
      },
      body: JSON.stringify({ channelType: "WEB" }),
    });

    if (!checkoutRes.ok) {
      const errorText = await checkoutRes.text();
      throw new Error(`Create checkout failed: ${errorText}`);
    }

    const checkoutData = await checkoutRes.json();

    // 3. Redirect
    if (checkoutData.checkoutUrl) {
      window.location.href = checkoutData.checkoutUrl;
    } else if (checkoutData.checkoutId) {
      // fallback: build URL manually
      window.location.href = `https://www.kokofresh.in/checkout?checkoutId=${checkoutData.checkoutId}`;
    } else {
      throw new Error("No checkout URL returned");
    }
  } catch (err) {
    console.error("Checkout error:", err);
  }
};


  return (
    <CartContext.Provider value={{ cart, loading, add, updateQuantity, remove, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}