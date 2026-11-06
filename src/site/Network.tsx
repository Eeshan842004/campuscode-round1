/* Three dashed curves and five glowing nodes. Same artwork as the live hero, login and register pages. */
const PATHS = [
  "M0 600 C180 450 250 620 420 430 S680 80 900 270 S1150 500 1400 180",
  "M80 130 C280 300 380 80 570 270 S800 620 1080 500 S1250 400 1400 620",
  "M250 800 C400 600 570 650 720 460 S970 180 1160 80",
];
const NODES: [number, number][] = [[420, 430], [900, 270], [1080, 500], [570, 270], [1160, 80]];

/* depth: each node sits in a group that leans toward the cursor by its own amount (needs useCursorParallax on a parent) */
export function Network({ className, r = 4, depth = false }: { className?: string; r?: number; depth?: boolean }) {
  return (
    <div className={`cc-network ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 1400 800" preserveAspectRatio="none">
        {PATHS.map((d) => <path key={d} d={d} />)}
        {NODES.map(([cx, cy], i) => {
          const dot = <circle cx={cx} cy={cy} r={r} />;
          return depth
            ? <g key={`${cx}-${cy}`} className="depth" style={{ ["--d" as string]: 10 + i * 7 }}>{dot}</g>
            : <g key={`${cx}-${cy}`}>{dot}</g>;
        })}
      </svg>
    </div>
  );
}
