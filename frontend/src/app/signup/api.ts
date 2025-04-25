interface SignUpCredentials {
  email: string;
  userName: string;
  password: string;
}

interface SignUpResponse {
  data?: {
    id: string;
    email: string;
    userName: string;
    createdAt: string;
  };
  message?: string;
  error?: string;
}

export async function signupUser(
  credentials: SignUpCredentials
): Promise<SignUpResponse> {
  try {
    const response = await fetch("http://localhost:2308/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    // After successful registration, return the response data
    return data;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
