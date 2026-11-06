// DM Mono labels "decode" from random characters into the real text.
// Every DM Mono character has the same width, so nothing around it moves (no layout shift).
// Screen readers always get the real text.
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";
import { prefersReducedMotion } from "./env";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/";

type Props = { text: string; trigger?: "view" | "hover"; className?: string };

export function Scramble({ text, trigger = "view", className }: Props) {
  const [shown, setShown] = useState(text);
  const { ref, seen } = useInView<HTMLSpanElement>(0.6);
  const frame = useRef(0);

  const run = useCallback(() => {
    if (prefersReducedMotion()) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const duration = Math.min(900, 300 + text.length * 30);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const fixedCount = Math.floor(progress * text.length); // letters already "decoded"
      setShown(
        text
          .split("")
          .map((ch, i) =>
            i < fixedCount || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    if (trigger === "view" && seen) run();
  }, [seen, trigger, run]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <span ref={ref} className={className} onMouseEnter={trigger === "hover" ? run : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
