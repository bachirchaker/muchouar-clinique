import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, children, disabled, ...props }, ref) => {
    const id = React.useId();

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
        <select
          id={props.id || id}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger focus:ring-danger" : "",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-sm text-danger mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-sm text-slate-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
