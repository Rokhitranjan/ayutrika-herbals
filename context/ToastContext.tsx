"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Floating Luxury Toasts Container */}
      <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-luxury border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up ${
              t.type === "success"
                ? "bg-forest-950/95 border-gold-500/60 text-ivory-100"
                : t.type === "error"
                ? "bg-charcoal-950/95 border-red-500/60 text-ivory-100"
                : "bg-forest-900/95 border-forest-750 text-ivory-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              {t.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
              )}
              {t.type === "error" && (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              {t.type === "info" && (
                <Info className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span className="text-xs font-sans font-medium tracking-wide">
                {t.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ivory-400 hover:text-ivory-100 ml-3 p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
