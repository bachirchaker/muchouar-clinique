import React, { forwardRef } from "react";
import { cn, getInitials } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, size = "md", status, ...props }, ref) => {
    const sizeClasses = {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-14 w-14 text-base",
      xl: "h-20 w-20 text-lg",
    };

    const statusColors = {
      online: "bg-success-500",
      offline: "bg-slate-400",
      busy: "bg-danger-500",
      away: "bg-warning-500",
    };

    const statusSizes = {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
      lg: "h-3.5 w-3.5",
      xl: "h-5 w-5 border-2",
    };

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <div
          className={cn(
            "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
            sizeClasses[size],
            className
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="aspect-square h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-medium text-slate-600 dark:text-slate-300">
              {fallback ? getInitials(fallback) : ""}
            </div>
          )}
        </div>
        
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-900",
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
