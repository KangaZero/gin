"use client";
import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

interface TitleProps {
  text: string;
  size?: "sm" | "md" | "lg";
  variant?: "typed" | "static";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

function Title({ text, size = "md", variant = "static" }: TitleProps) {
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
    return <span ref={typedRef} className={className} />;
  }
  return <span className={className}>{text}</span>;
}

export { Title }