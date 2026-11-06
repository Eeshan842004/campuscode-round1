// The IDEAS ✦ PEOPLE ✦ … ticker. It drifts slowly, speeds up while the page is scrolled,
// and follows the scroll direction. It pauses on hover and when off screen.
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./env";

type Props = { items: string[]; speed?: number; className?: string }; // speed = px per second at rest

export function VelocityMarquee({ items, speed = 40, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const el = track.current;
    if (!box || !el || prefersReducedMotion()) return;

    let x = 0;
    let lastTime = performance.now();
    let lastY = window.scrollY;
    let scrollSpeed = 0; // smoothed px/s
    let direction = 1;
    let paused = false;
    let visible = true;
    let raf = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy !== 0) direction = dy > 0 ? 1 : -1;
      const target = Math.min(Math.abs(dy) / Math.max(dt, 0.001), 3000);
      scrollSpeed += (target - scrollSpeed) * 0.08; // ease toward the new speed

      if (!paused && visible) {
        x -= direction * (speed + scrollSpeed * 0.15) * dt;
        const half = el.scrollWidth / 2; // the row is printed twice
        if (half > 0) {
          if (x <= -half) x += half;
          if (x > 0) x -= half;
        }
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box);
    const enter = () => (paused = true);
    const leave = () => (paused = false);
    box.addEventListener("pointerenter", enter);
    box.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      box.removeEventListener("pointerenter", enter);
      box.removeEventListener("pointerleave", leave);
    };
  }, [speed]);

  // Same markup as the live ticker: the word, then a purple ✦ glyph.
  // Each row holds the list six times so one row is always wider than the screen (even on wide monitors).
  const row = (hidden: boolean) => (
    <div className="vm-row" aria-hidden={hidden || undefined}>
      {[0, 1, 2, 3, 4, 5].map((n) => items.map((word) => (
        <span className="vm-item" key={`${n}-${word}`}>
          <span>{word}</span><b>✦</b>
        </span>
      )))}
    </div>
  );

  return (
    <div ref={wrap} className={`vm ${className}`} aria-label={items.join(", ")} role="marquee">
      <div ref={track} className="vm-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
