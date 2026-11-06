// The live site already shows a purple glow on hovered cards and rows.
// This makes the glow follow the cursor, and lights the 1px border near the cursor.
// Usage: <div className="spot" onPointerMove={spotlight}>…</div>
import type { PointerEvent } from "react";

export function spotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
}
