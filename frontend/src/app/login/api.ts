interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  error?: string;
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    // After successful login, redirect to home page
    window.location.href = "/";

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
