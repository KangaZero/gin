"use client";
import React, { useEffect, useState } from "react";
import { Title } from "@/components/ui/title";
import MotionDiv from "./MotionDiv";
import Link from "next/link";
import { getUserInfo } from "@/lib/getUserInfo";

interface HeaderLayoutProps {
  text: string;
  link?: string;
}

export default function HeaderLayout({ text, link }: HeaderLayoutProps) {
  const [user, setUser] = useState<{ userName?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { userInfo } = await getUserInfo();
      setUser(userInfo);
      console.log("User data:", userInfo);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-4">
      <div className="text-md">
        {user ? (
          <span>Welcome {user.userName || user.name}</span>
        ) : (
          <>
          <Link href="/login" className="hover:underline text-blue-500">
            Login
          </Link>
          <span> OR </span>
          <Link href="/signup" className="hover:underline text-blue-500">
            Sign Up
          </Link>
          </>
        )}
      </div>
      <MotionDiv
        className="flex justify-center items-center py-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Title text={text} link={link} variant="typed" size="lg" />
      </MotionDiv>
      <div className="w-[100px]" /> {/* Spacer to balance the layout */}
    </div>
  );
}
