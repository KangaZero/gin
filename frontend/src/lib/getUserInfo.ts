import { getSession } from "next-auth/react";

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  createdAt?: string;
  pets?: Array<{
    id: string;
    name: string;
    species: string;
  }>;
}

export async function getUserInfo(): Promise<{
  user: UserInfo | null;
  error?: string;
}> {
  try {
    // First try to get NextAuth session
    const session = await getSession();

    if (session?.user) {
      // If we have a NextAuth session, fetch additional user details from backend
      const response = await fetch(`http://localhost:2308/api/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { user: null, error: "Session expired" };
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      const userData = data.data;

      if (userData) {
        return {
          user: {
            id: userData.id,
            email: userData.email,
            userName: userData.userName,
            createdAt: userData.createdAt,
            pets: userData.pets,
          },
        };
      }
    }

    // If no NextAuth session, try getting user from backend session directly
    const response = await fetch("http://localhost:2308/api/users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { user: null, error: "Session expired" };
      }
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    const userData = data.data;

    if (userData) {
      return {
        user: {
          id: userData.id,
          email: userData.email,
          userName: userData.userName,
          createdAt: userData.createdAt,
          pets: userData.pets,
        },
      };
    }

    return { user: null };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      user: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch user information",
    };
  }
}
