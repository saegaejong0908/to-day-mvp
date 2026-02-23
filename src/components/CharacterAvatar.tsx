"use client";

import Image from "next/image";
import { useState } from "react";

type CharacterAvatarProps = {
  imageSrc: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  sizePx?: number;
  fallbackText: string;
  className?: string;
};

const sizeClassMap = {
  sm: "h-6 w-6 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-base",
  xl: "h-[220px] w-[220px] text-4xl",
} as const;

export default function CharacterAvatar({
  imageSrc,
  alt,
  size = "md",
  sizePx,
  fallbackText,
  className = "",
}: CharacterAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const inlineSizeStyle = sizePx ? { width: `${sizePx}px`, height: `${sizePx}px` } : undefined;

  return (
    <div
      className={[
        "relative inline-flex items-center justify-center overflow-visible rounded-full border border-gray-300 bg-gray-100 font-bold text-gray-600",
        sizeClassMap[size],
        className,
      ].join(" ")}
      style={inlineSizeStyle}
    >
      {!imageFailed ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizePx ? `${sizePx}px` : size === "xl" ? "220px" : "64px"}
          className="object-contain p-1"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{fallbackText}</span>
      )}
    </div>
  );
}
