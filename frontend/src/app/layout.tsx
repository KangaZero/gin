import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/layout/ThemeToggle";
import SettingsToggle from "@/components/layout/SettingsToggle";
import HeaderLayout from "@/components/layout/HeaderLayout";
import Providers from "@/components/Providers";

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
        <Providers>
          <ThemeToggle />
          <SettingsToggle />
          <HeaderLayout text="Pet Meets" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
