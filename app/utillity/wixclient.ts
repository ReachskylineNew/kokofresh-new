"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { members } from "@wix/members";
import { currentCart } from "@wix/ecom";
import { collections, products } from "@wix/stores";
import Cookies from "js-cookie";

// helper to safely parse cookies
function safeParseCookie(key: string) {
  const value = Cookies.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value; // fallback if it was stored as plain string
  }
}

const accessToken = safeParseCookie("accessToken");
const refreshToken = safeParseCookie("refreshToken");

export const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    members,
  },
  auth: OAuthStrategy({
    clientId: "2656201f-a899-4ec4-8b24-d1132bcf5405",
    tokens: {
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
    },
  }),
});
