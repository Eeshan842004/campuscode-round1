/* Plain validation helpers. Each one returns an error message, or "" when the value is fine. */
export const vEmail = (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address.");
export const vName = (v: string) => (v.trim().length >= 2 ? "" : "Enter your full name.");
export const vSame = (a: string, b: string) => (a === b ? "" : "Passwords do not match.");

/** The live page asks for 8+ characters with upper case, lower case and a number. */
export const vPassword = (v: string) =>
  v.length >= 8 && /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v)
    ? ""
    : "Password needs 8+ characters with upper case, lower case and a number.";

/** 0 to 3, used for the "Strength: Weak / Fair / Good / Strong" line. */
export function strength(v: string): number {
  const checks = [v.length >= 8, /[a-z]/.test(v) && /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)];
  return Math.min(checks.filter(Boolean).length, 3);
}
export const STRENGTH_LABEL = ["Weak", "Fair", "Good", "Strong"];
