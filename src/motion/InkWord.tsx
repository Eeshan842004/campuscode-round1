// The outlined words (COMPETE, BUILD., ARENA., PROJECT, PEOPLE., NEED BUILDERS.).
// 1) Inside a LineReveal, the outline is "drawn" left to right after its line rises.
// 2) On hover, the outline fills with ink, then empties when the pointer leaves.
export function InkWord({ children }: { children: string }) {
  return (
    <span className="ink-clip">
      <span className="ink">{children}</span>
    </span>
  );
}
