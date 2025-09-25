"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ThemeImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  inline?: boolean;
} & Omit<ImageProps, "src" | "alt" | "className" | "width" | "height">;

export function ThemeImage({
  src,
  alt,
  className,
  width = 300,
  height = 200,
  inline = false,
  ...props
}: ThemeImageProps) {
  const { resolvedTheme } = useTheme();

  const getThemeAwareSrc = (originalSrc: string) => {
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    return originalSrc.replace(/\/light\//, `/${theme}/`);
  };

  return (
    <Image
      src={getThemeAwareSrc(src)}
      alt={alt}
      className={cn(
        "rounded-md border",
        inline ? "inline-block ml-4 mb-2" : "mt-6",
        className,
      )}
      width={width}
      height={height}
      {...props}
    />
  );
}

interface StepWithImageProps {
  children: React.ReactNode;
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function StepWithImage({
  children,
  src,
  alt,
  className,
  width = 300,
  height = 200,
}: StepWithImageProps) {
  const { resolvedTheme } = useTheme();

  const getThemeAwareSrc = (originalSrc: string) => {
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    return originalSrc.replace(/\/light\//, `/${theme}/`);
  };

  return (
    <div className={cn("grid grid-cols-1 gap-4 items-start mt-6 md:grid-cols-2", className)}>
      <div className="prose prose-sm max-w-none">{children}</div>
      <div className="flex justify-center md:justify-end">
        <Image
          src={getThemeAwareSrc(src)}
          alt={alt}
          className="rounded-md border"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}


