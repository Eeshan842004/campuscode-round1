import { useCallback, useMemo, useRef, useState } from "react";
import { animateCaptchaRefresh } from "../../motion/auth";

/* A mock captcha: five coloured digits with a strike line, drawn as inline SVG.
   It looks like the live one (box + "↻ NEW") but it only checks against the code held in the page. */
const COLOURS = ["#22b8c9", "#e0443e", "#f0a020", "#7665ff", "#2fbf71"];
const newCode = () => String(Math.floor(10000 + Math.random() * 90000));
const pick = (n: number) => Math.floor(Math.random() * n);

function Picture({ code }: { code: string }) {
  return (
    <svg width="150" height="50" viewBox="0 0 150 50" role="img" aria-label={`Captcha code: ${code.split("").join(" ")}`}>
      <path d={`M4 ${14 + pick(6)} C40 ${pick(12)}, 90 ${30 + pick(14)}, 146 ${8 + pick(8)}`} stroke="#d96ad0" strokeWidth="1.3" fill="none" opacity=".8" />
      {code.split("").map((d, i) => (
        <text key={i} x={14 + i * 26} y={34 + pick(4)} fontSize="28" fontWeight="700" fill={COLOURS[(i + pick(5)) % 5]}
          transform={`rotate(${pick(30) - 15} ${14 + i * 26} 28)`} fontFamily="Inter, sans-serif">{d}</text>
      ))}
      <path d={`M2 ${22 + pick(10)} L148 ${22 + pick(10)}`} stroke="#3a56a8" strokeWidth="1.5" fill="none" opacity=".75" />
    </svg>
  );
}

/** Holds the current code. `check` compares what the user typed, `refresh` draws a new one. */
export function useCaptcha() {
  const [code, setCode] = useState(newCode);
  const refresh = useCallback(() => setCode(newCode()), []);
  const check = (typed: string) => typed.trim() === code;
  return { code, refresh, check };
}

export function CaptchaPicture({ code, className }: { code: string; className: string }) {
  // Built once per code, so the random wobble does not change on every keystroke
  const picture = useMemo(() => <Picture code={code} />, [code]);
  return <span className={className}>{picture}</span>;
}

/** The "↻ NEW" button: the icon spins once and the new picture drops in. */
export function NewCode({ onNew, className, disabled }: { onNew: () => void; className: string; disabled?: boolean }) {
  const btn = useRef<HTMLButtonElement>(null);
  const click = () => {
    const b = btn.current;
    animateCaptchaRefresh(b?.querySelector<HTMLElement>(".cap-i") ?? null, b?.closest(".au-field")?.querySelector<HTMLElement>(".au-captcha-img") ?? null);
    onNew();
  };
  return (
    <button ref={btn} type="button" className={className} onClick={click} disabled={disabled} aria-label="New captcha">
      <span className="cap-i" aria-hidden="true" style={{ display: "inline-block" }}>↻</span>{" "}NEW
    </button>
  );
}
