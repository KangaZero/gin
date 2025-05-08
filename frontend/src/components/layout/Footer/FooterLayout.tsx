"use client";

import Link from "next/link";
import { Github, Discord, Twitter, Youtube } from "lucide-react";
import { CookiePolicy } from "./CookiePolicy";
import { GDPR } from "./GDPR";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsOfService } from "./TermsOfService";

export default function FooterLayout() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto w-full max-w-[1400px] border-t border-dashed px-4 py-9 min-[1400px]:border-x sm:px-8 sm:py-16">
        <div className="grid grid-cols-5 gap-6 sm:gap-8">
          {/* Column 1: Logo and Description */}
          <div className="col-span-full flex flex-col items-start gap-4 lg:col-span-2">
            <Link href="/">
              <div className="flex items-center">
                <svg width="1em" height="1em" viewBox="0 0 324 323" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-8.5 dark:invert">
                  <rect x="0.5" width="323" height="323" rx="161.5" fill="var(--main)" />
                  <rect x="88.1023" y="144.792" width="151.802" height="36.5788" rx="18.2894" transform="rotate(-38.5799 88.1023 144.792)" fill="white" />
                  <rect x="85.3459" y="244.537" width="151.802" height="36.5788" rx="18.2894" transform="rotate(-38.5799 85.3459 244.537)" fill="white" />
                </svg>
                <span className="ms-2.5 text-xl font-semibold">Gin</span>
              </div>
            </Link>
            <p>A modern pet adoption platform helping you find your perfect companion. Browse pets, connect with owners, and make a difference in an animal's life.</p>
            <div className="flex items-center gap-4">
              <a target="_blank" rel="noopener noreferrer" href="https://github.com">
                <Github className="size-6" />
                <span className="sr-only">Github</span>
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com">
                <Twitter className="size-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://youtube.com">
                <Youtube className="size-6" />
                <span className="sr-only">Youtube</span>
              </a>
            </div>
            <p className="text-muted-foreground text-sm">This project is built with Next.js, Go, and powered by a passion for pets.</p>
          </div>

          {/* Columns 2-4: Links */}
          <div className="col-span-full grid gap-6 min-[450px]:grid-cols-2 sm:grid-cols-3 lg:col-span-3 lg:gap-8">
            {/* Column 2: Features */}
            <div className="flex flex-col gap-5">
              <div className="text-lg font-semibold">Features</div>
              <ul className="space-y-3">
                <li><Link href="/pets">Browse Pets</Link></li>
                <li><Link href="/profile">User Profiles</Link></li>
                <li><Link href="#">Adoption Process</Link></li>
                <li><Link href="#">Pet Stories</Link></li>
                <li><Link href="#">Community Forum</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="flex flex-col gap-5">
              <div className="text-lg font-semibold">Resources</div>
              <ul className="space-y-3">
                <li><Link href="#">Pet Care Guide</Link></li>
                <li><Link href="#">Adoption FAQ</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">API Documentation</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            {/* <div className="flex flex-col gap-5">
              <div className="text-lg font-semibold">Legal</div>
              <ul className="space-y-3">
                <li><Link href="#">Privacy Policy</Link></li>
                <li><Link href="#">Terms of Service</Link></li>
                <li><Link href="#">Cookie Policy</Link></li>
                <li><Link href="#">GDPR</Link></li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom footer section */}
      <div className="w-full border-t border-dashed">
        <div className="text-muted-foreground mx-auto flex w-full max-w-[1400px] items-center justify-between gap-5 border-dashed px-8 py-6 text-center max-lg:flex-col min-[1400px]:border-x">
          <p>©{new Date().getFullYear()} <Link className="text-foreground font-medium" href="/">KangaZero</Link>, All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <PrivacyPolicy />
            <TermsOfService />
            <CookiePolicy />
            <GDPR />
          </div>
          <p>Built with <span className="text-rose-500">♥</span> by the Gin team</p>
        </div>
      </div>
    </footer>
  );
}