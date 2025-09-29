"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { wixClient } from "@/app/utillity/wixclient";

type Profile = any;
type Contact = any;

type UserContextType = {
  profile: Profile | null;
  contact: Contact | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setContact: (contact: Contact | null) => void; // ✅ add this
};


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  // ---- Helpers ----
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

  async function getContactDetails(contactId: string) {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        body: JSON.stringify({ contactId }),
      });
      if (!res.ok) throw new Error("Failed to fetch contact");
      const data = await res.json();
      return data.contact || null;
    } catch (err) {
      console.error("Failed to fetch contact:", err);
      return null;
    }
  }

  // ---- Verify OAuth Redirect ----
  async function verifyLogin() {
    const data = JSON.parse(localStorage.getItem("oAuthRedirectData") || "null");
    try {
      const { code, state } = wixClient.auth.parseFromUrl();
      if (!code || !state || !data) return;

      const tokens = await wixClient.auth.getMemberTokens(code, state, data);
      Cookies.set("accessToken", JSON.stringify(tokens.accessToken));
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken));

      await refreshUser();

      localStorage.removeItem("oAuthRedirectData");
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error("verifyLogin error:", err);
    }
  }

  // ---- Refresh User ----
  const refreshUser = async () => {
    setLoading(true);
    try {
      const userProfile = await getProfile();
      setProfile(userProfile);

      if (userProfile?.contactId) {
        const contactDetails = await getContactDetails(userProfile.contactId);
        setContact(contactDetails);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await verifyLogin(); // ✅ catch redirect first
      await refreshUser();
    })();
  }, []);

  return (
    <UserContext.Provider value={{ profile, contact, loading, refreshUser,setContact }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
