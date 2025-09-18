
// lib/wixClient.ts
import { createClient, OAuthStrategy } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { products } from "@wix/stores";

export const wixClient = createClient({
  modules: { currentCart, products },
  auth: OAuthStrategy({
    clientId: "9d6c0efd-5a3a-46f5-b3de-4cde8ded7c57",
  }),
});

let isVisitorInit = false;

export async function initVisitorSession() {
  if (typeof window === "undefined" || isVisitorInit) return;
  isVisitorInit = true;

  const stored = localStorage.getItem("wixVisitorTokens");

  if (stored) {
    try {
      wixClient.auth.setTokens(JSON.parse(stored));
      return;
    } catch (err) {
      console.error("Invalid stored visitor tokens", err);
    }
  }

  try {
    const tokens = await wixClient.auth.generateVisitorTokens();
    wixClient.auth.setTokens(tokens);
    localStorage.setItem("wixVisitorTokens", JSON.stringify(tokens));
  } catch (err) {
    console.error("Failed to generate visitor tokens", err);
  }
}
