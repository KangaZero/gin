import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/layout/ThemeToggle";

const comicSans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pet Meets",
  description: "Your go-to generic pet adoption website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicSans.variable} antialiased bg-background text-foreground`}
      >
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
