import { signupUser } from "./api";

describe("Signup API", () => {
  it("should signup successfully with valid data", async () => {
    const response = await signupUser({
      email: "new@example.com",
      userName: "newuser",
      password: "password123",
    });

    expect(response.error).toBeUndefined();
    expect(response.data?.userName).toBe("newuser");
    expect(response.message).toBe("User created successfully");
  });

  it("should return error for existing email", async () => {
    const response = await signupUser({
      email: "exists@example.com",
      userName: "existinguser",
      password: "password123",
    });

    expect(response.error).toBeDefined();
    expect(response.error).toContain("already exists");
  });

  it("should handle network errors gracefully", async () => {
    global.fetch = jest.fn(() => Promise.reject("Network error"));

    const response = await signupUser({
      email: "test@example.com",
      userName: "testuser",
      password: "password123",
    });

    expect(response.error).toBeDefined();
  });
});
