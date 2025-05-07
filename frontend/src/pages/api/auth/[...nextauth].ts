import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { baseURL } from "@/config";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth Credentials");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const res = await fetch(`${baseURL}/api/login`, {
            method: "POST",
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            return null;
          }

          const user = await res.json();

          if (res.ok && user) {
            // Store both the user data and the authorization token
            return {
              id: user.data.id,
              email: user.data.email,
              name: user.data.userName,
              backendToken: user.token, // Store the token from your backend
            };
          }
          return null;
        } catch (e) {
          console.error("Login error:", e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true; // Skip for credentials provider as it's already handled
      }

      try {
        // Send OAuth user data to backend
        const response = await fetch(`${baseURL}/api/users/oauth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          // Add backend user data to the NextAuth user object
          user.id = userData.data.id;
          user.backendToken = userData.token; // Store the token from your backend
          return true;
        }

        // If we get a 404 or other error, we'll create the user in the getUserInfo flow
        return true;
      } catch (error) {
        console.error("Error syncing with backend:", error);
        // Continue the sign-in process even if backend sync fails
        // We'll handle user creation in the getUserInfo flow
        return true;
      }
    },
    async session({ session, token }) {
      // Add user ID and token to the session
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.backendToken) {
        session.backendToken = token.backendToken;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Store the backend token in the JWT
        if (user.backendToken) {
          token.backendToken = user.backendToken;
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects more robustly
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour
  },
  debug: process.env.NODE_ENV === "development",
});

export default handler;
