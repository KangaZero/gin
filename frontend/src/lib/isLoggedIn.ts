import { getSession } from "next-auth/react";

interface LoginStatus {
  isLoggedIn: boolean;
  error?: string;
}

export async function isLoggedIn(): Promise<LoginStatus> {
  try {
    // First check NextAuth session
    const session = await getSession();
    if (session) {
      return { isLoggedIn: true };
    }

    // If no NextAuth session, check backend session
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("session_token=")
    );

    if (!sessionCookie) {
      return { isLoggedIn: false };
    }

    // Validate backend session
    const response = await fetch("http://localhost:2308/api/users", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return { isLoggedIn: true };
    } else if (response.status === 401) {
      return { isLoggedIn: false, error: "Session expired" };
    }

    return { isLoggedIn: false, error: "Invalid session" };
  } catch (error) {
    console.error("Error validating session:", error);
    return {
      isLoggedIn: false,
      error: "Connection error",
    };
  }
}
