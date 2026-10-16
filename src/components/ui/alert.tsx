import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  title?: string;
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, icon, children, onDismiss, ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-800 border-slate-200",
      success: "bg-success-50 text-success-800 border-success-200",
      warning: "bg-warning-50 text-warning-800 border-warning-200",
      danger: "bg-danger-50 text-danger-800 border-danger-200",
      info: "bg-info-50 text-info-800 border-info-200",
    };

    const DefaultIcons = {
      default: null,
      success: (
        <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      danger: (
        <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5 text-info-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };

    const activeIcon = icon || DefaultIcons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          variants[variant],
          activeIcon && "pl-11",
          className
        )}
        role="alert"
        {...props}
      >
        {activeIcon && <div className="absolute left-4 top-4">{activeIcon}</div>}
        
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        
        <div className="text-sm [&_p]:leading-relaxed opacity-90">{children}</div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };
