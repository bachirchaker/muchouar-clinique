import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  onRemove?: () => void;
}

function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
    success: "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400",
    warning: "bg-warning-50 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400",
    danger: "bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400",
    info: "bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-400",
    outline: "border border-border text-foreground bg-transparent",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const dotColors = {
    default: "bg-slate-500",
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
    info: "bg-info-500",
    outline: "bg-slate-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "ml-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-current hover:bg-black/10 dark:hover:bg-white/20 focus:bg-black/10 dark:focus:bg-white/20 focus:outline-none"
          )}
        >
          <span className="sr-only">Remove</span>
          <svg viewBox="0 0 14 14" className="h-3 w-3" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l6 6m0-6l-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export { Badge };
