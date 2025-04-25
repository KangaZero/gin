import { getUserInfo } from "./getUserInfo";
import { getSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}));

describe("getUserInfo", () => {
  beforeEach(() => {
    (getSession as jest.Mock).mockReset();
  });

  it("should get user info with NextAuth session", async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    const { user, error } = await getUserInfo();

    expect(error).toBeUndefined();
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
  });

  it("should get user info with backend session", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    document.cookie = "session_token=test_token";
    const { user, error } = await getUserInfo();

    expect(error).toBeUndefined();
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
  });

  it("should handle no session", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    document.cookie = "";

    const { user, error } = await getUserInfo();

    expect(user).toBeNull();
    expect(error).toBeUndefined();
  });

  it("should handle session expiry", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    document.cookie = "session_token=expired_token";

    // Mock fetch to simulate 401 response
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Session expired" }),
      })
    );

    const { user, error } = await getUserInfo();

    expect(user).toBeNull();
    expect(error).toBe("Session expired");
  });
});
