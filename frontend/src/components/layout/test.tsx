"use client";

import {
    LogOut,
    PawPrint,
    Settings,
    Settings2,
    LogIn,
    User,
    UserPlus,
} from "lucide-react"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isLoggedIn } from "@/lib/isLoggedIn"

export default function SettingsToggle() {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const { isLoggedIn: status } = await isLoggedIn();
            setLoggedIn(status);
        };
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:2308/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setLoggedIn(false);
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="reverse"
                    size="icon"
                    aria-label={"Settings"}
                    className="absolute top-4 right-20 z-50">
                    <Settings2 className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{loggedIn ? "My Account" : "Menu"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {loggedIn ? (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <PawPrint className="mr-2 h-4 w-4" />
                                <span>My Pets</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem onClick={handleLogin}>
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Log in</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/register')}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Register</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
