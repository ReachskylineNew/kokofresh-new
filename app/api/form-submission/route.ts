import { NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { submissions } from "@wix/forms";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const wixClient = createClient({
      modules: { submissions },
      auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        accountId: process.env.WIX_ACCOUNT_ID!,
        siteId: process.env.WIX_SITE_ID!,
      }),
    });

    const payload = {
      submission: {
        formId: "1654cfeb-5d1b-4fc0-8589-0ecc2b5b153e",
        submissions: {
          formId: "1654cfeb-5d1b-4fc0-8589-0ecc2b5b153e", // 👈 duplicate inside map
          first_name: body.first_name,
          last_name: body.last_name,
          email_5308: body.email_5308,
          phone_0187: body.phone_0187,
          leave_us_a_message: body.leave_us_a_message,
        },
        status: "PENDING",
      },
    };

    console.log("🚀 Final Payload Sent to Wix:", JSON.stringify(payload, null, 2));

    const result = await wixClient.submissions.createSubmission(payload);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ Form submission failed:", err?.response?.data || err);
    return NextResponse.json(
      { error: err?.response?.data?.message || "Internal Server Error" },
      { status: err?.status || 500 }
    );
  }
}
