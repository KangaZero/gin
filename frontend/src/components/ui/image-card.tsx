import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  caption?: string;
  aspectRatio?: "square" | "video" | "wide";
  width?: number;
  height?: number;
  fill?: boolean;
  alt?: string;
}

function ImageCard({
  imageUrl,
  caption,
  aspectRatio = "square",
  width,
  height,
  fill = true,
  alt = "Image",
  className,
  ...props
}: ImageCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-base border-2 border-border bg-background",
        {
          "aspect-square": aspectRatio === "square",
          "aspect-video": aspectRatio === "video",
          "aspect-[21/9]": aspectRatio === "wide",
        },
        className
      )}
      {...props}
    >
      <div className="relative h-full w-full">
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className="object-cover transition-all"
        />
        {caption && (
          <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2">
            <p className="text-center text-sm text-white">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
