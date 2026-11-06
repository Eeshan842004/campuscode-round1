// Small shared pieces of the student dashboard. Each one is a plain copy of how the live portal builds it.
import type { ReactNode } from "react";
import type { BannerKind } from "./mock";

/** First value that is not empty, else an em dash (same helper the live portal uses). */
export const pick = (...values: unknown[]): string => String(values.find((v) => v != null && v !== "") ?? "—");

/** Short date like "Nov 06, 2026" (uses the visitor's own language settings, like the live portal). */
export function fmtDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

/** The three-slash CampusCode mark, drawn with CSS. */
export function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`cc-mark ${small ? "cc-mark-small" : ""}`} aria-label="CampusCode logo">
      <span /><span /><span />
    </span>
  );
}

/** Logo + name block at the top of the sidebar (and in the phone top bar). */
export function Brand({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "student-mobile-brand" : "student-brand"}>
      <Mark small={mobile} />
      <div><strong>CAMPUSCODE</strong><span>HACKATHON ARENA</span></div>
    </div>
  );
}

// ── Round event avatar (RE, FQ ...): initials on a gradient picked from the title ──
const MARK_COLORS = [["#a7f37a", "#4c7a12"], ["#7c5cff", "#2e1a8f"], ["#141414", "#4a4a4a"], ["#9ed41f", "#1d6f5f"], ["#b8e62e", "#7c5cff"], ["#ffcf5c", "#e07b39"]];
const initials = (title: string) => {
  const words = String(title || "?").trim().split(/\s+/).filter((w) => /^[A-Za-z]/.test(w));
  if (!words.length) return "?";
  return words.length === 1 ? words[0].slice(0, 2).toUpperCase() : (words[0][0] + words[1][0]).toUpperCase();
};
const hash = (s: string) => { let h = 0; for (const ch of String(s || "?")) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

export function EventMark({ title, size = 54 }: { title: string; size?: number }) {
  const [a, b] = MARK_COLORS[hash(title) % MARK_COLORS.length];
  return (
    <span className="hack-mark" aria-hidden="true" style={{ width: size, height: size, fontSize: Math.max(13, Math.round(size * 0.34)), background: `linear-gradient(135deg, ${a}, ${b})` }}>
      {initials(title)}
    </span>
  );
}

// ── The student's cartoon avatar, drawn from the name (same drawing code as the live portal) ──
const SKIN = ["#ffd9b3", "#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
const HAIR = ["#1c1c1c", "#4a3221", "#8a5a2b", "#d9a441", "#9a9a9a", "#7c5cff"];
const BACK = ["#e8f5d6", "#e3e0ff", "#ffe8d6", "#d6f0ff", "#f3e8ff", "#dff5e1"];

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const n = hash(name), skin = SKIN[n % SKIN.length], hair = HAIR[(n >> 3) % HAIR.length], back = BACK[(n >> 6) % BACK.length];
  const style = n % 3, smile = n % 2 === 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="student-avatar" aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill={back} />
      <circle cx="50" cy="46" r="26" fill={skin} />
      {style === 0 && <path d="M20 38 Q20 14 50 14 Q80 14 80 38 Q72 26 60 28 Q52 18 40 26 Q28 24 20 38Z" fill={hair} />}
      {style === 1 && (
        <g fill={hair}>
          <path d="M20 40 Q18 12 50 12 Q82 12 80 40 L74 34 Q70 22 50 22 Q30 22 26 34Z" />
          <rect x="20" y="30" width="8" height="18" rx="4" /><rect x="72" y="30" width="8" height="18" rx="4" />
        </g>
      )}
      {style === 2 && (
        <g fill={hair}>
          <path d="M22 36 Q24 10 50 10 Q76 10 78 36 Q60 24 50 30 Q40 24 22 36Z" /><circle cx="50" cy="12" r="7" />
        </g>
      )}
      <circle cx="41" cy="46" r="3.4" fill="#1c1c1c" /><circle cx="59" cy="46" r="3.4" fill="#1c1c1c" />
      <circle cx="42" cy="45" r="1.1" fill="#fff" /><circle cx="60" cy="45" r="1.1" fill="#fff" />
      <path d={smile ? "M44 56 Q50 61 56 56" : "M44 56 Q50 58 56 56"} stroke="#1c1c1c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="53" rx="4" ry="2.6" fill="#ff9d9d" opacity=".55" /><ellipse cx="65" cy="53" rx="4" ry="2.6" fill="#ff9d9d" opacity=".55" />
      <path d="M34 78 Q50 70 66 78 L64 100 L36 100Z" fill="#7c5cff" />
    </svg>
  );
}

/** Page heading: green mono kicker, huge title, one line of text, and the count on the right. */
export function PageHeading({ eyebrow, title, text, count }: { eyebrow: string; title: ReactNode; text?: string; count?: number }) {
  return (
    <div className="student-page-heading">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {count !== undefined && (
        <div className="student-counter"><strong>{String(count).padStart(2, "0")}</strong><span>LIVE DATA</span></div>
      )}
    </div>
  );
}

/** Dashed empty box with the small logo. */
export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="student-empty">
      <Mark small />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

/** The three bars that charge up while a page loads. */
export function Loader({ label = "" }: { label?: string }) {
  return (
    <div className="student-loading-shell">
      <div className="campus-loader campus-loader-inline">
        <div className="cc-loader-core" role="status" aria-live="polite" aria-label={label || "Loading"}>
          <div className="cc-charge" aria-hidden="true">
            <i className="cc-charge-bar cc-charge-black" /><i className="cc-charge-bar cc-charge-purple" /><i className="cc-charge-bar cc-charge-lime" />
          </div>
          {label ? <div className="cc-loader-text">{label}</div> : null}
          <div className="cc-loader-subtext">Syncing CampusCode</div>
        </div>
      </div>
    </div>
  );
}

// ── Event banners. The live portal shows uploaded poster images; these are drawn in HTML and CSS instead. ──
export function Banner({ kind, title }: { kind: BannerKind; title: string }) {
  return (
    <div className="event-banner">
      {kind === "rebuild" ? (
        <div className="eb eb-rebuild" role="img" aria-label={`${title} banner`}>
          <i className="eb-slab" aria-hidden="true" />
          <span className="eb-tile" aria-hidden="true"><i /><i /><i /></span>
          <div className="eb-copy" aria-hidden="true">
            <small>CAMPUSCODE PRESENTS</small>
            <span className="eb-title">ReBuild <em>'26</em></span>
            <strong>THE DASHBOARD RECREATION HACKATHON</strong>
            <span className="eb-pills"><u>CERTIFICATE FOR WINNERS</u><u>INTERNSHIP OPPORTUNITY</u><u>REGISTER BY 5 NOV 2026</u></span>
          </div>
          <i className="eb-line" aria-hidden="true" />
        </div>
      ) : (
        <div className="eb eb-quiz" role="img" aria-label={`${title} banner`}>
          <i className="eb-blob eb-blob-a" aria-hidden="true" /><i className="eb-blob eb-blob-b" aria-hidden="true" />
          <span className="eb-tile" aria-hidden="true"><i /><i /><i /></span>
          <div className="eb-copy" aria-hidden="true">
            <small>CAMPUSCODE</small>
            <span className="eb-title">FIRSTCOMMIT '26</span>
            <span className="eb-title eb-purple">QUIZ COMPETITION</span>
            <span className="eb-mono">50 QUESTIONS &nbsp;·&nbsp; TECH &nbsp;·&nbsp; AI &nbsp;·&nbsp; ENGINEERING</span>
            <span className="eb-mono">SUNDAY, 1 NOVEMBER 2026</span>
          </div>
          <div className="eb-big" aria-hidden="true"><strong>50</strong><span>QUESTIONS</span></div>
          <i className="eb-line eb-line-lime" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
