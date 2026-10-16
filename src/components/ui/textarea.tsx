import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, showCount, maxLength, onChange, ...props }, ref) => {
    const id = React.useId();
    const [length, setLength] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLength(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5 relative">
        {label && (
          <label
            htmlFor={props.id || id}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <textarea
          id={props.id || id}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error ? "border-danger focus-visible:ring-danger" : "",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          <div className="flex-1">
            {error && <p className="text-sm text-danger">{error}</p>}
            {!error && helperText && <p className="text-sm text-slate-500">{helperText}</p>}
          </div>
          {showCount && maxLength && (
            <span className="text-xs text-slate-400 ml-2">
              {length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
