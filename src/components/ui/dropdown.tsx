"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "left", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-md bg-white dark:bg-slate-900 shadow-dropdown border border-border animate-fade-in",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            className
          )}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => {
              if (item.separator) {
                return <div key={`sep-${index}`} className="h-px bg-border my-1" />;
              }

              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  className={cn(
                    "flex w-full items-center px-4 py-2 text-sm text-left transition-colors",
                    item.disabled
                      ? "opacity-50 cursor-not-allowed text-slate-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800",
                    item.danger
                      ? "text-danger hover:text-danger-600"
                      : "text-slate-700 dark:text-slate-200",
                  )}
                  role="menuitem"
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
