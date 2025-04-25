import { loginUser, logoutUser } from "./api";

describe("Login API", () => {
  it("should login successfully with valid credentials", async () => {
    const response = await loginUser({
      email: "testuser",
      password: "password123",
    });

    expect(response.error).toBeUndefined();
    expect(response.user?.userName).toBe("testuser");
  });

  it("should return error with invalid credentials", async () => {
    const response = await loginUser({
      email: "testuser",
      password: "wrongpassword",
    });

    expect(response.error).toBeDefined();
    expect(response.user).toBeUndefined();
  });

  it("should handle network errors gracefully", async () => {
    // Temporarily disable network to simulate error
    global.fetch = jest.fn(() => Promise.reject("Network error"));

    const response = await loginUser({
      email: "testuser",
      password: "password123",
    });

    expect(response.error).toBeDefined();
    expect(response.user).toBeUndefined();
  });
});
