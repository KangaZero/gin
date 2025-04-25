"use client";
import React, { useEffect, useState } from "react";
import { Title } from "@/components/ui/title";
import MotionDiv from "./MotionDiv";
import Link from "next/link";
import { getUserInfo } from "@/lib/getUserInfo";

interface HeaderLayoutProps {
  text: string;
}

export default function HeaderLayout({ text }: HeaderLayoutProps) {
  const [user, setUser] = useState<{ userName?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { user: userData } = await getUserInfo();
      setUser(userData);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-4">
      <div className="text-sm">
        {user ? (
          <span>Welcome {user.userName}</span>
        ) : (
          <Link href="/login" className="hover:underline">
            Login to get started
          </Link>
        )}
      </div>
      <MotionDiv
        className="flex justify-center items-center py-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Title text={text} variant="typed" size="lg" />
      </MotionDiv>
      <div className="w-[100px]" /> {/* Spacer to balance the layout */}
    </div>
  );
}
