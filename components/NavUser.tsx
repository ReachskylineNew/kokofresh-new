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

  const linkClasses =
    "text-white/90 text-sm lg:text-base font-semibold px-3 py-2 rounded-md transition-colors duration-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-[#DD9627] hover:via-[#FED649] hover:to-[#B47B2B]";

  return wixClient.auth.loggedIn() ? (
    <div className="flex items-center gap-3">
      {/* 👤 Profile Avatar / Image */}
      <Link
        href="/profile"
        className={`flex items-center gap-2 ${linkClasses}`}
      >
        {profile?.profile?.photo?.url ? (

         <img
  src={profile.profile.photo.url}
  alt={profile?.profile?.nickname || "Profile"}
  loading="lazy"
  decoding="async"
  onError={(e) => {
    // fallback if Wix image fails to load
    (e.target as HTMLImageElement).src = "/fallback-avatar.png";
  }}
  className="w-8 h-8 rounded-full border-2 border-[#FED649] shadow-sm"
/>

        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FED649]/30 text-[#DD9627] font-bold border border-[#FED649]/50 shadow-sm">
            {getInitials(profile?.profile?.nickname || "U")}
          </div>
        )}
        <span>{profile?.profile?.nickname || "User"}</span>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className={`${linkClasses} border border-[#DD9627]`}
      >
        Sign Out
      </Button>
    </div>
  ) : (
    <Button
      size="sm"
      onClick={login}
      className={`${linkClasses} bg-[#DD9627] border-0`}
    >
      Sign In
    </Button>
  );
}
