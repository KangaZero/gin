import { rest } from "msw";

export const handlers = [
  // Auth endpoints
  rest.post("http://localhost:2308/api/login", (req, res, ctx) => {
    const { username, password } = req.body as any;

    if (username === "testuser" && password === "password123") {
      return res(
        ctx.status(200),
        ctx.json({
          message: "Login successful",
          data: {
            id: "1",
            email: "test@example.com",
            userName: "testuser",
          },
        })
      );
    }

    return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
  }),

  rest.post("http://localhost:2308/api/users", (req, res, ctx) => {
    const { email, userName, password } = req.body as any;

    if (email === "exists@example.com") {
      return res(
        ctx.status(409),
        ctx.json({ error: "User with this email already exists" })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        message: "User created successfully",
        data: { id: "1", email, userName },
      })
    );
  }),

  // User endpoints
  rest.get("http://localhost:2308/api/users/me", (req, res, ctx) => {
    const hasValidSession = req.headers
      .get("Cookie")
      ?.includes("session_token");

    if (!hasValidSession) {
      return res(ctx.status(401), ctx.json({ error: "Not authenticated" }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        data: {
          id: "1",
          email: "test@example.com",
          userName: "testuser",
          pets: [],
        },
      })
    );
  }),

  // OAuth endpoints
  rest.post("http://localhost:2308/api/users/oauth", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          id: "1",
          email: "oauth@example.com",
          userName: "oauthuser",
        },
        token: "mock_session_token",
      })
    );
  }),
];
