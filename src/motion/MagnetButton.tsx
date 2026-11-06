// A <button> that leans toward the cursor (uses useMagnetic). Added so pages can use the hook on many buttons.
import type { ButtonHTMLAttributes } from "react";
import { useMagnetic } from "./useMagnetic";

export function MagnetButton({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>();
  return <button ref={ref} className={`magnet ${className}`} {...rest} />;
}
