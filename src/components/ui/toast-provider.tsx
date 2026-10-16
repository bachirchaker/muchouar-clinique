"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastProps, ToastVariant } from "./toast";
import { generateId } from "@/lib/utils";
import { createPortal } from "react-dom";

interface ToastContextType {
  toast: (options: Omit<ToastProps, "id" | "onClose">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((options: Omit<ToastProps, "id" | "onClose">) => {
    const id = generateId();
    setToasts((prev) => [...prev, { ...options, id, onClose: removeToast }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => {
    addToast({ message, title, variant: "success" });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ message, title, variant: "error" });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error }}>
      {children}
      {typeof document !== "undefined" && createPortal(
        <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2 pointer-events-none">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
