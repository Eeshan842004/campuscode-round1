// Buttons lean a few pixels toward the cursor while it is over them, then spring back.
// Put the returned ref on the button and add the class "magnet".
import { useEffect, useRef } from "react";
import { clamp, finePointer, prefersReducedMotion } from "./env";

export function useMagnetic<T extends HTMLElement>(strength = 0.25, max = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = clamp((e.clientX - (r.left + r.width / 2)) * strength, max);
      const y = clamp((e.clientY - (r.top + r.height / 2)) * strength, max);
      el.style.setProperty("--mgx", `${x}px`);
      el.style.setProperty("--mgy", `${y}px`);
    };
    const leave = () => {
      el.style.setProperty("--mgx", "0px");
      el.style.setProperty("--mgy", "0px");
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength, max]);

  return ref;
}
