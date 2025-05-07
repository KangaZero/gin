"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function OAuthSessionHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    // Check if we have a session with a token from the backend
    if (session && (session as any).backendToken) {
      // Set the backend token as a cookie that can be used by the backend
      document.cookie = `session_token=${
        (session as any).backendToken
      }; path=/; max-age=3600; SameSite=Lax`;
    }

    // Also check if we've just completed OAuth and have a token in the URL or session storage
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || sessionStorage.getItem("backendToken");

    if (token) {
      // Set the token as a cookie
      document.cookie = `session_token=${token}; path=/; max-age=3600; SameSite=Lax`;

      // Clean up
      sessionStorage.removeItem("backendToken");

      // Remove the token from URL if it's there
      if (params.has("token")) {
        params.delete("token");
        const newUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [session]);

  return null; // This component doesn't render anything
}
