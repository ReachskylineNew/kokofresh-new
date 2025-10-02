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

  /** 🔑 Bootstrap anonymous visitor auth if missing */
  const initAuth = async (): Promise<VisitorAuth> => {
    const res = await fetch("https://www.wixapis.com/oauth/visitor/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: APP_ID,
        grantType: "anonymousVisitor",
      }),
    });

    const data = await res.json();

    if (data.access_token && data.refresh_token) {
      const newAuth: VisitorAuth = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: (data.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000,
      };

      Cookies.set("accessToken", JSON.stringify({ value: newAuth.access_token, expiresAt: data.expires_at }), { expires: 1 });
      Cookies.set("refreshToken", JSON.stringify({ value: newAuth.refresh_token }), { expires: 7 });

      setAuth(newAuth);
      return newAuth;
    }

    throw new Error("Failed to initialize visitor auth");
  };

  /** ✅ Ensure we have valid auth tokens */
  const ensureAuth = async (): Promise<VisitorAuth> => {
    if (auth && Date.now() < auth.expires_at) return auth;

    const accessRaw = Cookies.get("accessToken");
    const refreshRaw = Cookies.get("refreshToken");

    let parsedAccess: any = null;
    let parsedRefresh: any = null;

    if (accessRaw) parsedAccess = JSON.parse(accessRaw);
    if (refreshRaw) parsedRefresh = JSON.parse(refreshRaw);

    if (parsedAccess?.value && parsedRefresh?.value) {
      const newAuth: VisitorAuth = {
        access_token: parsedAccess.value,
        refresh_token: parsedRefresh.value,
        expires_at: parsedAccess.expiresAt
          ? parsedAccess.expiresAt * 1000
          : Date.now() + 3600 * 1000,
      };
      setAuth(newAuth);
      return newAuth;
    }

    // 🔄 fallback: bootstrap new auth
    return await initAuth();
  };

  /** Load cart */
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

  /** Add item */
  const add = async (
    productId: string,
    qty: number,
    options?: { name: string; value: string }[],
    variantId?: string
  ) => {
    const activeAuth = await ensureAuth();

    const optionsObj =
      options?.reduce((acc, opt) => ({ ...acc, [opt.name]: opt.value }), {}) || {};

    const payload = {
      lineItems: [
        {
          catalogReference: {
            appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e", // ✅ Wix Stores appId
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

    const res = await fetch(`${BASE_URL}/carts/current/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeAuth.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      const refreshed = await initAuth();
      return add(productId, qty, options, variantId);
    }

    const data = await res.json();
    setCart(data?.cart || { lineItems: [] });
    return data?.cart;
  };

  /** Update item quantity */
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

  /** Remove item */
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

  /** Checkout */
  const checkout = async () => {
    const activeAuth = await ensureAuth();

    if (!cart?.lineItems?.length) {
      console.error("Cannot checkout, cart is empty");
      return;
    }

    try {
      await fetch(`${BASE_URL}/carts/current/estimate-totals`, {
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

      const checkoutRes = await fetch(`${BASE_URL}/carts/current/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeAuth.access_token}`,
        },
        body: JSON.stringify({ channelType: "WEB" }),
      });

      const checkoutData = await checkoutRes.json();

      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else if (checkoutData.checkoutId) {
        window.location.href = `https://www.kokofresh.in/checkout?checkoutId=${checkoutData.checkoutId}`;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  /** 🔄 Init on mount */
  useEffect(() => {
    (async () => {
      try {
        const activeAuth = await ensureAuth();
        await load(activeAuth);
      } catch (e) {
        console.error("Cart init failed", e);
      }
    })();
  }, []);

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
