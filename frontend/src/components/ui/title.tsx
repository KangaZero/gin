"use client";
import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Link from "next/link";

interface TitleProps {
  text: string;
  link?: string; // Optional link prop
  size?: "sm" | "md" | "lg";
  variant?: "typed" | "static";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

function Title({ text, link, size = "md", variant = "static" }: TitleProps) {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (variant === "typed" && typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: [text],
        typeSpeed: 50,
        showCursor: false,
      });
      return () => {
        typed.destroy();
      };
    }
  }, [text, variant]);

  const className = sizeMap[size];

  if (variant === "typed") {
    if (link) {
      return (
        <Link href={link} className="hover:none">
          <span ref={typedRef} className={className} />
        </Link>
      );
    }
    return <span ref={typedRef} className={className} />;
  }

  if (link) {
    return (
      <Link href={link} className="hover:none">
        <span className={className}>{text}</span>
      </Link>
    );
  }
  return <span className={className}>{text}</span>;
}

export { Title };
