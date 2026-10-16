import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  fullPage?: boolean;
  text?: string;
}

export function Loading({ fullPage, text = "Chargement...", className, ...props }: LoadingProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)} {...props}>
      <div className="relative h-12 w-12">
        <svg
          className="absolute h-full w-full animate-spin text-primary-200"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        </svg>
        <svg
          className="absolute h-full w-full animate-spin text-primary"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          ></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
