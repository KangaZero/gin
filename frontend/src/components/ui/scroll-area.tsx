"use client"

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  type?: "auto" | "always" | "hover" | "scroll" | "none"
}

function ScrollArea({
  className,
  children,
  type = "auto",
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full font-base">
        {children}
      </ScrollAreaPrimitive.Viewport>
      {type !== "none" && <ScrollBar type={type} />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

interface ScrollBarProps extends React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  type?: "auto" | "always" | "hover" | "scroll" | "none"
}

function ScrollBar({
  className,
  orientation = "vertical",
  type = "auto",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        type === "hover" && "opacity-0 data-[state=visible]:opacity-100 transition-opacity duration-200",
        type === "none" && "hidden",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
