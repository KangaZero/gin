"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MiddleLayout from "@/components/layout/middle"
import { useState } from "react"
import { z } from "zod"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaFacebook } from "react-icons/fa"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export default function CardDemo() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {}
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as "email" | "password"] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    // TODO: submit login
  }

  return (
    <MiddleLayout>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                 variant="floating"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                 variant="floating"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="neutral" className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-200 hover:bg-gray-50">
            <FcGoogle size={20} /> Login with Google
          </Button>
          <Button variant="neutral" className="w-full flex items-center justify-center gap-2 bg-[#24292f] text-white hover:bg-[#1b1f23]">
            <FaGithub size={20} /> Login with GitHub
          </Button>
          <Button variant="neutral" className="w-full flex items-center justify-center gap-2 bg-[#1877f3] text-white hover:bg-[#145db2]">
            <FaFacebook size={20} /> Login with Facebook
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </MiddleLayout>
  )
}