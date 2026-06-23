"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

type CursorLabel = "View →" | "Open ↗" | null;

const LABEL_MAP: Record<string, CursorLabel> = {
  view: "View →",
  open: "Open ↗",
};

function getBgColor(el: Element | null): string {
  let node = el;
  while (node && node !== document.documentElement) {
    const bg = window.getComputedStyle(node as HTMLElement).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
    node = node.parentElement;
  }
  return "rgb(245, 244, 240)"; // page default
}

function luminance(r: number, g: number, b: number) {
  return [r, g, b]
    .map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; })
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}

function isDarkBg(color: string): boolean {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return false;
  return luminance(+m[1], +m[2], +m[3]) < 0.18;
}

export default function Cursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const [label, setLabel] = useState<CursorLabel>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [dark, setDark] = useState(false);

  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 60 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 60 });
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 26 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 26 });

  const posRef = useRef({ x: -200, y: -200 });

  // rAF loop — re-samples background colour every frame so the cursor
  // updates instantly during CSS transitions (e.g. the email hover fill)
  // even when the mouse is stationary.
  useEffect(() => {
    let rafId: number;
    const sample = () => {
      const { x, y } = posRef.current;
      if (x > 0 && y > 0) {
        const el = document.elementFromPoint(x, y);
        setDark(isDarkBg(getBgColor(el)));
      }
      rafId = requestAnimationFrame(sample);
    };
    rafId = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel(cursorEl ? (LABEL_MAP[cursorEl.dataset.cursor ?? ""] ?? null) : null);
      setHovering(!!target.closest("a, button, [data-cursor]"));
    };

    const hide = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [mouseX, mouseY]);

  const isLabel = label !== null;
  const dotColor = dark ? "#f5f4f0" : "#0a0a0a";
  const ringBorder = dark ? "rgba(245,244,240,0.55)" : "rgba(10,10,10,0.35)";

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible && !isLabel ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ width: hovering ? 8 : 5, height: hovering ? 8 : 5, backgroundColor: dotColor }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </motion.div>

      {/* Ring + label */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {isLabel ? (
            <motion.div
              key="label"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -translate-x-1/2 -translate-y-1/2 font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase px-4 py-2 rounded-full whitespace-nowrap"
              style={{ backgroundColor: dotColor, color: dark ? "#0a0a0a" : "#f5f4f0" }}
            >
              {label}
            </motion.div>
          ) : (
            <motion.div
              key="ring"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: hovering ? 52 : 36,
                height: hovering ? 52 : 36,
                borderColor: ringBorder,
                transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
