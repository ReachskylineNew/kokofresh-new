"use client"

import { createClient, OAuthStrategy } from "@wix/sdk"
import { members } from "@wix/members"
import { currentCart } from "@wix/ecom"
import { collections, products } from "@wix/stores"
import { contacts } from "@wix/crm"
import Cookies from "js-cookie"

function safeParseCookie(key: string) {
  const value = Cookies.get(key)
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const accessToken = safeParseCookie("accessToken")
const refreshToken = safeParseCookie("refreshToken")

export const wixClient = createClient({
  modules: { products, collections, currentCart, members, contacts },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    tokens: {
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
    },
  }),
})
