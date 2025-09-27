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
            className="w-8 h-8 rounded-full border shadow"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shadow">
            {getInitials(profile?.profile?.nickname || "U")}
          </div>
        )}

        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {profile?.profile?.nickname || "User"}
          </span>
          {/* ✅ contact is already in context if you want to show */}
          {/* <span className="text-xs text-muted-foreground">
            {contact?.primaryInfo?.email}
          </span> */}
        </div>
      </Link>

      <Button variant="outline" size="sm" onClick={logout}>
        Sign Out
      </Button>
    </div>
  ) : (
    <Button size="sm" variant="default" onClick={login}>
      Sign In
    </Button>
  );
}
