"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { getPetNameSuggestions } from "@/app/pets/api-client";
import { useDebounce } from "@/lib/hooks";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSelect?: (value: string) => void;
}

export function SearchBar({ className, onSelect, ...props }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length > 0) {
        const results = await getPetNameSuggestions(debouncedValue);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    props.onChange?.(e);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onSelect?.(suggestion);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
        className={cn("w-full", className)}
        {...props}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-background border-2 border-border rounded-base shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-secondary-background cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
