"use client";

import React, { useEffect, useState } from "react";

export default function LuxuryCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<"default" | "hover" | "view">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    // Disable on mobile, touch devices, and reduced-motion users
    if (typeof window !== "undefined") {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isTouch || prefersReducedMotion) {
        setIsDisabled(true);
        return;
      }
      setIsDisabled(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const productCard =
        target.closest("[data-cursor='view']") ||
        target.closest(".product-card-hover");
      if (productCard) {
        setCursorType("view");
        return;
      }

      const interactive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("[role='button']");
      if (interactive) {
        setCursorType("hover");
        return;
      }

      setCursorType("default");
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Smooth lerp trailing dot
  useEffect(() => {
    if (isDisabled) return;
    let animationFrameId: number;

    const lerp = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isDisabled]);

  if (isDisabled || !isVisible) return null;

  return (
    <>
      {/* Primary Small Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`rounded-full bg-gold-500 transition-all duration-300 ${
            cursorType === "view"
              ? "opacity-0 scale-0"
              : cursorType === "hover"
              ? "w-2 h-2 opacity-80"
              : "w-1.5 h-1.5 opacity-100"
          }`}
        />
      </div>

      {/* Trailing Outer Ring / View Badge */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {cursorType === "view" ? (
          <div className="w-14 h-14 rounded-full bg-forest-900/95 border border-gold-500/80 shadow-gold-glow flex items-center justify-center text-[10px] tracking-[0.2em] font-sans font-semibold text-gold-400 uppercase transition-all duration-200 scale-100">
            VIEW
          </div>
        ) : (
          <div
            className={`rounded-full border border-gold-500/50 transition-all duration-300 ease-out ${
              cursorType === "hover"
                ? "w-10 h-10 bg-gold-500/10 scale-110 border-gold-500"
                : "w-7 h-7 scale-100"
            }`}
          />
        )}
      </div>
    </>
  );
}
