"use client";

import { useEffect, useState } from "react";
import { wixClient } from "../app/utillity/wixclient";
import { Button } from "../components/ui/button";
import Cookies from "js-cookie";

export default function NavUser() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // ✅ Ensure we only run Wix code in the browser
  useEffect(() => {
    setIsClient(true);
    verifyLogin();
    if (wixClient.auth.loggedIn()) {
      getProfile().then(setProfile);
    }
  }, []);

  // ---------- Auth helpers ----------
  async function getProfile() {
    try {
      const token = Cookies.get("accessToken");
      const refresh = Cookies.get("refreshToken");
      if (!token || !refresh) return null;

      wixClient.auth.setTokens({
        accessToken: JSON.parse(token),
        refreshToken: JSON.parse(refresh),
      });

      const result = await wixClient.members.getCurrentMember();
      return result?.member || null;
    } catch {
      return null;
    }
  }

  async function verifyLogin() {
    const data = JSON.parse(localStorage.getItem("oAuthRedirectData") || "null");
    try {
      const { code, state } = wixClient.auth.parseFromUrl();
      if (!code || !state || !data) return;

      const tokens = await wixClient.auth.getMemberTokens(code, state, data);
      Cookies.set("accessToken", JSON.stringify(tokens.accessToken));
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken));

      const userProfile = await getProfile();
      setProfile(userProfile);

      localStorage.removeItem("oAuthRedirectData");
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error("verifyLogin error:", err);
    }
  }

const login = async () => {
  setLoading(true);

  // 👇 Use current origin (localhost in dev, real domain in prod)
  const redirectUri = `${window.location.origin}`;

  const loginRequest = wixClient.auth.generateOAuthData(redirectUri);
  localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequest));

  const { authUrl } = await wixClient.auth.getAuthUrl(loginRequest);
  window.location.href = authUrl;
};

  const logout = async () => {
    setLoading(true);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    window.location.href = logoutUrl;
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // ---------- Render ----------
  if (!isClient) {
    // ⛔ Prevents `role` crash during build/SSR
    return null;
  }

  return wixClient.auth.loggedIn() ? (
    <div className="flex items-center gap-3">
      {profile?.profile?.photo?.url ? (
        <img
          src={`/api/proxy-image?url=${encodeURIComponent(profile.profile.photo.url)}`}
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
        {profile?.loginEmail && (
          <span className="text-xs text-muted-foreground">{profile.loginEmail}</span>
        )}
      </div>

      <Button variant="outline" size="sm" onClick={logout} disabled={loading}>
        Sign Out
      </Button>
    </div>
  ) : (
    <Button size="sm" variant="default" onClick={login} disabled={loading}>
      {loading ? "Signing in..." : "Sign In"}
    </Button>
  );
}
