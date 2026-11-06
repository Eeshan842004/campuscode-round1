// Background pieces (hero dots, orbit rings) drift a few pixels toward the cursor, each by
// its own depth. Sets --px and --py (-1 to 1) on the section; CSS does the moving.
import { useEffect, useRef } from "react";
import { finePointer, prefersReducedMotion } from "./env";

export function useCursorParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;

    let targetX = 0, targetY = 0, x = 0, y = 0, raf = 0;

    const tick = () => {
      x += (targetX - x) * 0.08; // follow softly, never snap
      y += (targetY - y) * 0.08;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      const settled = Math.abs(targetX - x) < 0.001 && Math.abs(targetY - y) < 0.001;
      raf = settled ? 0 : requestAnimationFrame(tick); // stop the loop when nothing moves
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width) * 2 - 1;
      targetY = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return ref;
}
