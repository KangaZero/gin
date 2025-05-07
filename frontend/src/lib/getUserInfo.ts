import { getSession } from "next-auth/react";
import { baseURL } from "@/config";
import { isLoggedIn } from "@/lib/isLoggedIn";

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
    const isLoggedInResponse = await isLoggedIn();
    if (!isLoggedInResponse) {
      return { user: null, error: "User is not logged in" };
    }

    const response = await fetch(`${baseURL}/api/users/me`, {
      credentials: 'include', // This is critical for including cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("response", response);

    // Handle unauthorized or not found responses
    if (response.status === 401) {
      console.log("Unauthorized - No valid session");
      return { user: null, error: "Session expired or invalid" };
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    // Process the successful response
    const data = await response.json();
    const userData = data.data.user;
    console.log("data", userData);

    if (userData) {
      return {
        userInfo: {
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
