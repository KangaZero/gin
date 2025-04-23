"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      let dark = false;
      if (storedTheme === "dark") {
        dark = true;
      } else if (storedTheme === "light") {
        dark = false;
      } else {
        // Use system preference
        dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (html.classList.contains("dark")) {
        html.classList.remove("dark");
        setIsDark(false);
        localStorage.setItem("theme", "light");
      } else {
        html.classList.add("dark");
        setIsDark(true);
        localStorage.setItem("theme", "dark");
      }
    }
  };

  return (
    <Button
      variant="reverse"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="absolute top-4 right-4 z-50"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}

export default ThemeToggle;