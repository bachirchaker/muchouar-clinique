"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        
        let x = 0;
        let y = 0;
        
        // Estimation for tooltip size, actual positioning might need ResizeObserver for perfect accuracy
        const tooltipOffset = 8;
        
        if (position === "top") {
          x = rect.left + rect.width / 2;
          y = rect.top - tooltipOffset;
        } else if (position === "bottom") {
          x = rect.left + rect.width / 2;
          y = rect.bottom + tooltipOffset;
        } else if (position === "left") {
          x = rect.left - tooltipOffset;
          y = rect.top + rect.height / 2;
        } else if (position === "right") {
          x = rect.right + tooltipOffset;
          y = rect.top + rect.height / 2;
        }
        
        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipElement = isVisible ? (
    <div
      className={cn(
        "fixed z-50 rounded bg-slate-900 px-2 py-1 text-xs text-slate-50 shadow-md animate-fade-in pointer-events-none whitespace-nowrap",
        position === "top" && "-translate-x-1/2 -translate-y-full",
        position === "bottom" && "-translate-x-1/2",
        position === "left" && "-translate-x-full -translate-y-1/2",
        position === "right" && "-translate-y-1/2",
        className
      )}
      style={{ left: coords.x, top: coords.y }}
      role="tooltip"
    >
      {content}
      <div 
        className={cn(
          "absolute w-2 h-2 bg-slate-900 transform rotate-45",
          position === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
          position === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
          position === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
          position === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
        )}
      />
    </div>
  ) : null;

  const child = React.Children.only(children);
  
  return (
    <>
      {React.cloneElement(child as React.ReactElement<any>, {
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })}
      {isVisible && typeof document !== "undefined" && createPortal(tooltipElement, document.body)}
    </>
  );
}
