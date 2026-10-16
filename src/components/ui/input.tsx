import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      addonLeft,
      addonRight,
      inputSize = "md",
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    
    const sizeClasses = {
      sm: "h-9 text-sm",
      md: "h-11 text-sm",
      lg: "h-14 text-base",
    };

    const hasAddonOrIconLeft = !!addonLeft || !!leftIcon;
    const hasAddonOrIconRight = !!addonRight || !!rightIcon;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={props.id || id}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {addonLeft && (
            <span className="flex items-center justify-center h-full px-3 text-slate-500 bg-slate-50 border border-r-0 border-border rounded-l-md">
              {addonLeft}
            </span>
          )}
          {leftIcon && !addonLeft && (
            <div className="absolute left-3 flex items-center justify-center text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            id={props.id || id}
            type={type}
            className={cn(
              "flex w-full rounded-md border border-input bg-transparent px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[inputSize],
              addonLeft ? "rounded-l-none" : "",
              addonRight ? "rounded-r-none" : "",
              leftIcon && !addonLeft ? "pl-10" : "",
              rightIcon && !addonRight ? "pr-10" : "",
              error ? "border-danger focus-visible:ring-danger" : "",
              className
            )}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />
          
          {rightIcon && !addonRight && (
            <div className="absolute right-3 flex items-center justify-center text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
          {addonRight && (
            <span className="flex items-center justify-center h-full px-3 text-slate-500 bg-slate-50 border border-l-0 border-border rounded-r-md">
              {addonRight}
            </span>
          )}
        </div>
        
        {error && <p className="text-sm text-danger mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-sm text-slate-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
