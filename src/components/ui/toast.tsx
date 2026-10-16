"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  title,
  message,
  variant = "default",
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingProgress = Math.max(0, 100 - (elapsedTime / duration) * 100);
      setProgress(remainingProgress);

      if (elapsedTime < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        handleClose();
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for exit animation
  };

  const variants = {
    default: "bg-white dark:bg-slate-800 border-slate-200 text-slate-800 dark:text-slate-100",
    success: "bg-success-50 dark:bg-success-900/40 border-success-200 dark:border-success-800 text-success-800 dark:text-success-300",
    error: "bg-danger-50 dark:bg-danger-900/40 border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-300",
    warning: "bg-warning-50 dark:bg-warning-900/40 border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-300",
    info: "bg-info-50 dark:bg-info-900/40 border-info-200 dark:border-info-800 text-info-800 dark:text-info-300",
  };

  const progressColors = {
    default: "bg-slate-300 dark:bg-slate-600",
    success: "bg-success-400 dark:bg-success-600",
    error: "bg-danger-400 dark:bg-danger-600",
    warning: "bg-warning-400 dark:bg-warning-600",
    info: "bg-info-400 dark:bg-info-600",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-lg border shadow-lg transition-all",
        variants[variant],
        isClosing ? "animate-out fade-out slide-out-to-right-full" : "animate-in slide-in-from-right-full"
      )}
    >
      <div className="flex items-start gap-4 p-4">
        <div className="flex-1">
          {title && <h3 className="font-semibold text-sm">{title}</h3>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div 
        className={cn("h-1 w-full", progressColors[variant])}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
