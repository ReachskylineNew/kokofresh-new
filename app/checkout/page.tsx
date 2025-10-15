"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutRedirect() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkoutId");
  const currency = searchParams.get("currency") || "INR";

  useEffect(() => {
    if (!checkoutId) return;

    // 👇 Construct the real Wix checkout URL
    const wixCheckoutUrl = `https://www.kokofresh.in/checkout?checkoutId=${checkoutId}&currency=${currency}`;

    console.log("🔁 Redirecting to Wix checkout:", wixCheckoutUrl);

    // Redirect after a brief pause (optional UX delay)
    const timer = setTimeout(() => {
      window.location.href = wixCheckoutUrl;
    }, 500);

    return () => clearTimeout(timer);
  }, [checkoutId, currency]);

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-xl font-semibold">Redirecting to secure checkout...</h1>
      <p className="text-sm text-gray-500 mt-2">
        Please wait while we connect to payment gateway.
      </p>
    </main>
  );
}
