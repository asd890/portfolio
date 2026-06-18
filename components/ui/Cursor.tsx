"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

type CursorLabel = "View →" | "Open ↗" | null;

const LABEL_MAP: Record<string, CursorLabel> = {
  view: "View →",
  open: "Open ↗",
};

export default function Cursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const [label, setLabel] = useState<CursorLabel>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Dot tracks exactly
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 60 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 60 });

  // Ring lags behind
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 26 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 26 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const cursorEl = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      setLabel(cursorEl ? (LABEL_MAP[cursorEl.dataset.cursor ?? ""] ?? null) : null);

      const clickable = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      setHovering(!!clickable);
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

  return (
    <>
      {/* Dot — exact position, hidden when label is showing */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible && !isLabel ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0a0a] mix-blend-difference"
          animate={{ width: hovering ? 8 : 5, height: hovering ? 8 : 5 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </motion.div>

      {/* Ring + label — lagged position */}
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
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase px-4 py-2 rounded-full whitespace-nowrap"
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
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0a0a0a]/35 mix-blend-difference"
              style={{
                width: hovering ? 52 : 36,
                height: hovering ? 52 : 36,
                transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
