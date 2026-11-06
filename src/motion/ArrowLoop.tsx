// The ↗ arrow on buttons and links. On hover it flies out top-right and a copy flies in
// from bottom-left. Same arrow, same colour, same place: it just loops.
export function ArrowLoop({ glyph = "↗" }: { glyph?: string }) {
  return (
    <span className="arrow-loop" aria-hidden="true">
      <span>{glyph}</span>
      <span>{glyph}</span>
    </span>
  );
}
