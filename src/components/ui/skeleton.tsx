import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect" | "card";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded-md",
    circle: "rounded-full",
    rect: "rounded-md",
    card: "rounded-xl",
  };

  const appliedStyle = {
    ...style,
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height && { height: typeof height === "number" ? `${height}px` : height }),
  };

  return (
    <div
      className={cn("animate-pulse bg-slate-200 dark:bg-slate-800", variants[variant], className)}
      style={appliedStyle}
      {...props}
    />
  );
}

export { Skeleton };
