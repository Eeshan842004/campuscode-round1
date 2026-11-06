import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../../motion/motion.css";
import { AuthLayout } from "./AuthLayout";
import { Bus, type BusState } from "./Bus";
import { CaptchaPicture, NewCode, useCaptcha } from "./Captcha";
import { shakeField } from "./fx";
import { Submit } from "./Submit";
import { arrival, signIn, signOut } from "./session";
import { vEmail, vPassword } from "./validate";

/* Login has three steps, like the live page:
   credentials -> (FORGOT PASSWORD?) -> forgot (email + captcha) -> reset (code + new password) */
type Step = "credentials" | "forgot" | "reset";

export default function Login() {
  const navigate = useNavigate();
  const captcha = useCaptcha();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    document.title = "Login · CampusCode";
    signOut();                                  // arriving here means "log out"
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  // a failed check: show the message and shake the fields that caused it
  const fail = (message: string, ...ids: string[]) => { setError(message); ids.forEach(shakeField); };
  const wrongCaptcha = () => { fail("Captcha does not match. Try the new code.", step === "forgot" ? "forgot-captcha" : "login-captcha"); captcha.refresh(); setTyped(""); };
  const busState: BusState = busy ? (slow ? "wait" : "drive") : "idle";

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setNotice("");
    const mail = email.trim().toLowerCase();
    if (!mail || !password) return fail("Please enter your email and password.", "login-email", "login-password");
    const bad = vEmail(mail);
    if (bad) return fail(bad, "login-email");
    if (!captcha.check(typed)) return wrongCaptcha();
    setBusy(true); setSlow(false);
    later(() => setSlow(true), 1500);            // after 1.5 s the bus waits at the barrier
    later(() => { signIn(mail.split("@")[0]); navigate("/student"); }, 2000);
  };

  const onForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const mail = email.trim().toLowerCase();
    if (!mail) return fail("Enter your email address first.", "forgot-email");
    const bad = vEmail(mail);
    if (bad) return fail(bad, "forgot-email");
    if (!captcha.check(typed)) return wrongCaptcha();
    setTyped(""); captcha.refresh(); setStep("reset");
  };

  const onReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (resetCode.replace(/\D/g, "").length < 6) return fail("Enter the 6-digit code we sent you.", "reset-code");
    const weak = vPassword(newPassword);
    if (weak) return fail(weak, "reset-password");
    setStep("credentials"); setPassword(""); setResetCode(""); setNewPassword("");
    setNotice("Password updated. Log in with your new password.");
  };

  const back = () => { setStep("credentials"); setError(""); setTyped(""); captcha.refresh(); };

  return (
    <AuthLayout kind="login">
      {step === "credentials" && (
        <form onSubmit={onLogin} noValidate>
          <div className="au-field m-field">
            <label htmlFor="login-email">EMAIL ADDRESS</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">@</span>
              <input id="login-email" type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" autoComplete="email" disabled={busy} autoFocus />
            </div>
          </div>
          <div className="au-field m-field">
            <label htmlFor="login-password">PASSWORD</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">•</span>
              <input id="login-password" type={show ? "text" : "password"} name="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter your password" autoComplete="current-password" disabled={busy} />
              <button type="button" className="au-toggle" onClick={() => setShow((s) => !s)} disabled={busy} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"}>
                <span aria-hidden="true">{show ? "◉" : "○"}</span>{show ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
          <div className="au-field m-field">
            <label htmlFor="login-captcha">CAPTCHA</label>
            <div className="au-captcha-row">
              <CaptchaPicture code={captcha.code} className="au-captcha-img" />
              <NewCode className="au-toggle" onNew={captcha.refresh} disabled={busy} />
            </div>
            <div className="au-input m-control" style={{ marginTop: 8 }}>
              <input id="login-captcha" type="text" value={typed} onChange={(e) => { setTyped(e.target.value); setError(""); }}
                placeholder="Enter the code above" autoComplete="off" maxLength={5} inputMode="numeric" disabled={busy} style={{ paddingLeft: 12 }} />
            </div>
          </div>
          {error && <div className="au-message au-error" role="alert"><span>!</span><p>{error}</p></div>}
          {notice && <div className="au-message au-success" role="status"><span>✓</span><p>{notice}</p></div>}
          <Bus state={busState} />
          <Submit busy={busy} label={busy ? "CHECKING..." : "LOGIN"} busyGlyph="↻" spin />
          <div className="au-row">
            <button type="button" className="au-toggle" onClick={() => { setStep("forgot"); setError(""); setNotice(""); captcha.refresh(); setTyped(""); }} disabled={busy}>FORGOT PASSWORD?</button>
          </div>
        </form>
      )}

      {step === "forgot" && (
        <form onSubmit={onForgot} noValidate>
          <p className="au-sent">RESET YOUR <strong>PASSWORD</strong></p>
          <div className="au-field m-field">
            <label htmlFor="forgot-email">EMAIL ADDRESS</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">@</span>
              <input id="forgot-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" autoComplete="email" autoFocus />
            </div>
          </div>
          <div className="au-field m-field">
            <label htmlFor="forgot-captcha">CAPTCHA</label>
            <div className="au-captcha-row">
              <CaptchaPicture code={captcha.code} className="au-captcha-img" />
              <NewCode className="au-toggle" onNew={captcha.refresh} />
            </div>
            <div className="au-input m-control" style={{ marginTop: 8 }}>
              <input id="forgot-captcha" type="text" value={typed} onChange={(e) => { setTyped(e.target.value); setError(""); }} placeholder="Enter the code above" autoComplete="off" maxLength={5} inputMode="numeric" style={{ paddingLeft: 12 }} />
            </div>
          </div>
          {error && <div className="au-message au-error" role="alert"><span>!</span><p>{error}</p></div>}
          <Submit label="SEND RESET CODE" />
          <div className="au-row"><button type="button" className="au-toggle" onClick={back}>← BACK TO LOGIN</button></div>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={onReset} noValidate>
          <p className="au-sent">CODE SENT TO <strong>{email.trim().toLowerCase()}</strong></p>
          <div className="au-field m-field">
            <label htmlFor="reset-code">6-DIGIT CODE</label>
            <div className="au-input m-control au-otp">
              <input id="reset-code" type="text" inputMode="numeric" autoComplete="one-time-code" value={resetCode}
                onChange={(e) => { setResetCode(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(""); }} placeholder="••••••" maxLength={8} autoFocus />
            </div>
            <p className="au-hint">This is a demo, so any 6 digits work.</p>
          </div>
          <div className="au-field m-field">
            <label htmlFor="reset-password">NEW PASSWORD</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">•</span>
              <input id="reset-password" type={show ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(""); }} placeholder="Create a new password" autoComplete="new-password" />
              <button type="button" className="au-toggle" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"}>
                <span aria-hidden="true">{show ? "◉" : "○"}</span>{show ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
          {error && <div className="au-message au-error" role="alert"><span>!</span><p>{error}</p></div>}
          <Submit label="RESET PASSWORD" />
          <div className="au-row"><button type="button" className="au-toggle" onClick={back}>← BACK TO LOGIN</button></div>
        </form>
      )}

      <div className="au-switch">
        <span>DON'T HAVE AN ACCOUNT?</span>
        <button type="button" className="link-draw" onClick={() => { arrival.viaTransition = true; navigate("/register", { viewTransition: true }); }} disabled={busy}>CREATE ACCOUNT →</button>
      </div>
    </AuthLayout>
  );
}
