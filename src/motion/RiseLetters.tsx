// The giant faded footer wordmark "CampusCode": letters rise one by one the first time
// the footer is seen. It is decoration, so screen readers skip it.
import { useInView } from "./useInView";

export function RiseLetters({ text, className = "" }: { text: string; className?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className={`rise ${seen ? "in" : ""} ${className}`} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <span key={i} style={{ transitionDelay: `${i * 45}ms` }}>{ch}</span>
      ))}
    </div>
  );
}
