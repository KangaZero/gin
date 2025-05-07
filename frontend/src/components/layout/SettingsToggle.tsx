"use client";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PawPrint,
  PlusCircle,
  Settings,
  Settings2,
  User,
  Users,
} from "lucide-react";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isLoggedIn } from "@/lib/isLoggedIn";
import { ShortcutDialog } from "@/components/shortcutDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function SettingsToggle() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { isLoggedIn: status } = await isLoggedIn();
      setLoggedIn(status);
      console.log("login status", status);
    };
    checkLoginStatus();
  }, []);

  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:2308/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setLoggedIn(false);
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const modifier = e.metaKey || e.ctrlKey;

      if (modifier) {
        switch (e.key) {
          case "p":
            if (e.shiftKey) {
              e.preventDefault();
              if (loggedIn) {
                handleNavigation("/profile");
              }
            }
            break;
          case "b":
            e.preventDefault();
            handleNavigation("/billing");
            break;
          case "s":
            e.preventDefault();
            if (loggedIn) {
              handleNavigation("/settings");
            }
            break;
          case "k":
            e.preventDefault();
            document.getElementById("shortcut-dialog-trigger")?.click();
            break;
          case "t":
            e.preventDefault();
            handleNavigation("/team/new");
            break;
          case "h":
            e.preventDefault();
            handleNavigation("/pets");
            break;
          case "u":
            e.preventDefault();
            handleNavigation("/users");
            break;
          case "l":
            e.preventDefault();
            if (loggedIn) {
              handleLogout();
            } else {
              handleLogin();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [loggedIn, handleNavigation, handleLogin, handleLogout]);

  return (
    <TooltipProvider delayDuration={0}>
      <Dialog>
        <Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="reverse"
                  size="icon"
                  aria-label={"Settings"}
                  className="absolute top-4 right-20 z-50"
                >
                  <Settings2 className="w-5 h-5 z-10" />
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loggedIn && (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleNavigation("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⌘⇧P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNavigation("/billing")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNavigation("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                      <DropdownMenuItem id="shortcut-dialog-trigger">
                        <Keyboard className="mr-2 h-4 w-4" />
                        <span>Keyboard shortcuts</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNavigation("/pets")}>
                  <PawPrint className="mr-2 h-4 w-4" />
                  <span>Pets</span>
                  <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Users</span>
                    <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/users/message")}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/users/chat")}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/users")}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => handleNavigation("/team/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Keyboard className="mr-2 h-4 w-4" />
                  <span>Shortcuts</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/support")}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {loggedIn ? (
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleLogin}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log in</span>
                  <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <ShortcutDialog open={undefined} onOpenChange={undefined} />
      </Dialog>
    </TooltipProvider>
  );
}
