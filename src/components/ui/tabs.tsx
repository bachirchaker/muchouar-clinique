"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "line" | "pill";
}

export function Tabs({ tabs, defaultTabId, onChange, className, variant = "line" }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveTabId(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "flex space-x-1",
          variant === "line" ? "border-b border-border" : "p-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              disabled={tab.disabled}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                variant === "line" && cn(
                  "border-b-2 -mb-px",
                  isActive 
                    ? "border-primary text-primary" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                ),
                variant === "pill" && cn(
                  "rounded-md flex-1",
                  isActive 
                    ? "bg-white dark:bg-slate-900 text-foreground shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                )
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 focus-visible:outline-none">
        {tabs.find((tab) => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
}
