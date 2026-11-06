// Numbers like "01 / 05" and "00:30": when the value changes, the new digits roll up into place.
export function Roll({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span key={value} className="roll-in">{value}</span>
    </span>
  );
}
