"use client";

import { createClient, OAuthStrategy, ApiKeyStrategy } from "@wix/sdk";
import { members } from "@wix/members";
import { currentCart,orders } from "@wix/ecom";
import { collections, products, } from "@wix/stores";
import { contacts } from "@wix/crm";

import Cookies from "js-cookie";

// helper to safely parse cookies
function safeParseCookie(key: string) {
  const value = Cookies.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

const accessToken = safeParseCookie("accessToken");
const refreshToken = safeParseCookie("refreshToken");

// 👤 For logged-in members (OAuth flow)
export const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    members,
    contacts,
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!, // <-- use env var
    tokens: {
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
    },
  }),
});


export function getWixAdminClient() {
  return createClient({
    modules: { products, collections, contacts,orders },
    auth: ApiKeyStrategy({
      apiKey: process.env.WIX_API_KEY!,
      accountId: process.env.WIX_ACCOUNT_ID!,
      siteId: process.env.WIX_SITE_ID!,
    }),
  });
}
