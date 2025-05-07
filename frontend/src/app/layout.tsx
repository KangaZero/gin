import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/layout/ThemeToggle";
import SettingsToggle from "@/components/layout/SettingsToggle";
import HeaderLayout from "@/components/layout/HeaderLayout";
import FooterLayout from "@/components/layout/footer/FooterLayout";
import Providers from "@/components/Providers";
import OAuthSessionHandler from "@/components/OAuthSessionHandler";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";

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
        className={`${comicSans.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <Providers>
          <OAuthSessionHandler />
          <ThemeToggle />
          <SettingsToggle />
          <HeaderLayout text="Pet Meets" link="./" />
          <main className="flex-grow">
            <ScrollArea className="h-full" type="hover">
              {children}
            </ScrollArea>
          </main>
          <FooterLayout />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
