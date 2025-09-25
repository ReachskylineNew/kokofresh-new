// // app/api/register/route.ts
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { email, nickname } = await req.json();

//     if (!email) {
//       return NextResponse.json(
//         { success: false, error: "Email is required" },
//         { status: 400 }
//       );
//     }

//     // === Step 1: Get OAuth token ===
//     const tokenRes = await fetch("https://www.wixapis.com/oauth/access", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" }, // 👈 JSON not urlencoded
//       body: JSON.stringify({
//         grant_type: "client_credentials", // 👈 snake_case
//         client_id: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
//         client_secret: process.env.WIX_CLIENT_SECRET!,
//         scope: "wix.members.manage-members", // 👈 must match permissions
//       }),
//     });

//     const tokenData = await tokenRes.json();
//     console.log("OAuth response:", tokenData);

//     if (!tokenRes.ok || !tokenData.access_token) {
//       return NextResponse.json(
//         { success: false, error: "OAuth token fetch failed", details: tokenData },
//         { status: tokenRes.status }
//       );
//     }

//     const accessToken = tokenData.access_token;

//     // === Step 2: Create member ===
//     const wixRes = await fetch("https://www.wixapis.com/members/v1/members", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({
//         member: {
//           loginEmail: email,
//           profile: {
//             nickname: nickname || email.split("@")[0],
//           },
//           privacyStatus: "PUBLIC",
//         },
//       }),
//     });

//     const wixData = await wixRes.json();
//     console.log("Register response:", wixData);

//     if (!wixRes.ok) {
//       return NextResponse.json(
//         { success: false, error: "Wix member creation failed", details: wixData },
//         { status: wixRes.status }
//       );
//     }

//     // ✅ Success
//     return NextResponse.json({ success: true, member: wixData.member }, { status: 201 });

//   } catch (err: any) {
//     console.error("Server error:", err);
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }
