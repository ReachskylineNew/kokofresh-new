import { OAuthStrategy,createClient } from "@wix/sdk";

import { NextRequest,NextResponse } from "next/server";


export const middleware = async (req: NextRequest) => {
 const cookies=req.cookies
 const res =NextResponse.next()
 if(cookies.get("refreshToken")){
    return res
 }

 const wixClient=createClient({
    auth: OAuthStrategy({
        clientId:"2656201f-a899-4ec4-8b24-d1132bcf5405"
    
    })
 })

 const tokens=await wixClient.auth.generateVisitorTokens();
 res.cookies.set("refreshToken",JSON.stringify(tokens.refreshToken),{
    maxAge:60 * 60 * 24,
 })
 res.cookies.set("accessToken",JSON.stringify(tokens.accessToken))

 return res
};



