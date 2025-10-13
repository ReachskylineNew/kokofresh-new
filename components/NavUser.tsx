"use client";

import { Button } from "../components/ui/button";
import Link from "next/link";
import { wixClient } from "@/app/utillity/wixclient";
import Cookies from "js-cookie";
import { useUser } from "@/context/user-context";

export default function NavUser() {
  const { profile, contact, loading } = useUser();

  const logout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    window.location.href = logoutUrl;
  };

  const login = async () => {
    const redirectUri = `${window.location.origin}`;
    const loginRequest = wixClient.auth.generateOAuthData(redirectUri);
    localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequest));
    const { authUrl } = await wixClient.auth.getAuthUrl(loginRequest);
    window.location.href = authUrl;
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) return null;

  return wixClient.auth.loggedIn() ? (
    <div className="flex items-center gap-3">
      {/* 👤 Profile Avatar / Image */}
      <Link
        href="/profile"
        className="flex items-center gap-3 hover:opacity-90 transition"
      >
        {profile?.profile?.photo?.url ? (
          <img
            src={`/api/proxy-image?url=${encodeURIComponent(
              profile.profile.photo.url
            )}`}
            alt={profile?.profile?.nickname || "Profile"}
            className="w-8 h-8 rounded-full border-2 border-[#FED649] shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FED649]/30 text-[#DD9627] font-bold border border-[#FED649]/50 shadow-sm">
            {getInitials(profile?.profile?.nickname || "U")}
          </div>
        )}

        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-[#4B3A1F]">
            {profile?.profile?.nickname || "User"}
          </span>
          {/* Optional email display */}
          {/* <span className="text-xs text-[#B47B2B]/70">
            {contact?.primaryInfo?.email}
          </span> */}
        </div>
      </Link>

      {/* 🔓 Logout Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        className="border-2 border-[#DD9627] text-[#DD9627] hover:bg-[#DD9627] hover:text-white font-semibold transition-colors"
      >
        Sign Out
      </Button>
    </div>
  ) : (
    <Button
      size="sm"
      onClick={login}
      className="bg-[#DD9627] hover:bg-[#B47B2B] text-white font-semibold border-0 shadow-sm transition-colors"
    >
      Sign In
    </Button>
  );
}
