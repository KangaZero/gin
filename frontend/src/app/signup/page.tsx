"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MiddleLayout from "@/components/layout/MiddleLayout";
import { useState, useEffect } from "react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser } from "./api";
import { useSession } from "next-auth/react";
import { isLoggedIn } from "@/lib/isLoggedIn";

const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    userName: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain a number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain a special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    userName?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { isLoggedIn: userIsLoggedIn } = await isLoggedIn();
      if (userIsLoggedIn || session) {
        router.push("/");
      }
    };
    checkAuth();
  }, [session, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors((prev) => ({
      ...prev,
      [e.target.id]: undefined,
      general: undefined,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Omit confirmPassword from credentials sent to API
    const { confirmPassword, ...credentials } = form; // eslint-disable-line @typescript-eslint/no-unused-vars
    const response = await signupUser(credentials);

    if (response.error) {
      setErrors({ general: response.error });
      setIsLoading(false);
      return;
    }

    // If signup was successful, redirect to login page
    router.push("/login?registered=true");
  }

  return (
    <MiddleLayout>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {errors.general && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                  {errors.general}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="johndoe"
                  value={form.userName}
                  onChange={handleChange}
                  required
                />
                {errors.userName && (
                  <span className="text-red-500 text-xs">
                    {errors.userName}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </MiddleLayout>
  );
}
