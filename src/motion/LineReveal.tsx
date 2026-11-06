// Big headings: each line slides up from behind an invisible mask, one after another.
// Same words, same size, same place as the live site. Only the entrance is animated.
import type { ReactNode } from "react";
import { useInView } from "./useInView";

type Props = {
  lines: ReactNode[];                 // e.g. ["BUILD", <InkWord>COMPETE</InkWord>, "SHIP."]
  as?: "h1" | "h2" | "strong";
  className?: string;                 // keep the page's existing heading class here
  delay?: number;                     // ms before the first line starts
};

export function LineReveal({ lines, as = "h2", className = "", delay = 0 }: Props) {
  const { ref, seen } = useInView<HTMLHeadingElement>(0.3);
  const Tag = as;
  return (
    <Tag ref={ref} className={`lr ${seen ? "in" : ""} ${className}`}>
      {lines.map((line, i) => (
        <span className="lr-mask" key={i}>
          <span className="lr-line" style={{ transitionDelay: `${delay + i * 90}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
