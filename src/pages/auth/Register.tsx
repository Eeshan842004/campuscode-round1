import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../../motion/motion.css";
import { AuthLayout } from "./AuthLayout";
import { CaptchaPicture, NewCode, useCaptcha } from "./Captcha";
import { shakeField } from "./fx";
import { Submit } from "./Submit";
import { arrival, signIn } from "./session";
import { STRENGTH_LABEL, strength, vEmail, vName, vPassword, vSame } from "./validate";

/* Register has two steps, like the live page: details -> email code.
   There is no mail server here, so the code is shown in a TEST MODE box (the live page does the same when mail is off). */
type Step = "details" | "otp";
const RESEND_SECONDS = 30;
const newOtp = () => String(Math.floor(100000 + Math.random() * 900000));

function PasswordField({ label, id, value, onChange, placeholder, busy }: { label: string; id: string; value: string; onChange: (v: string) => void; placeholder: string; busy: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="au-field m-field">
      <label htmlFor={id}>{label}</label>
      <div className="au-input m-control">
        <span className="au-icon" aria-hidden="true">•</span>
        <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="new-password" disabled={busy} />
        <button type="button" className="au-toggle boxed" onClick={() => setShow((s) => !s)} disabled={busy} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"}>
          <span aria-hidden="true">{show ? "◉" : "○"}</span><span>{show ? "HIDE" : "SHOW"}</span>
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const captcha = useCaptcha();
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [typed, setTyped] = useState("");
  const [adult, setAdult] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [left, setLeft] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    document.title = "Register · CampusCode";
    return () => timers.current.forEach(clearTimeout);
  }, []);
  // resend countdown
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const clear = () => { setError(""); setNotice(""); };
  // a failed check: show the message and shake the field that caused it
  const fail = (message: string, id: string) => { setError(message); shakeField(id); };

  const sendCode = (resend = false) => {
    setBusy(true); clear();
    later(() => {
      setSentCode(newOtp()); setBusy(false); setLeft(RESEND_SECONDS); setOtp("");
      setNotice(resend ? "A new code was sent." : "Verification code sent. Check your inbox.");
      setStep("otp");
    }, 900);
  };

  const onDetails = (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    const checks: [string, string][] = [
      ["reg-name", vName(name)], ["reg-email", vEmail(email)], ["reg-password", vPassword(password)], ["reg-confirm", vSame(password, confirm)],
      ["reg-captcha", captcha.check(typed) ? "" : "Captcha does not match. Try the new code."],
      ["reg-age", adult ? "" : "Please confirm that you are 18 years of age or older."],
    ];
    const first = checks.find(([, message]) => message);
    if (first) {
      if (first[0] === "reg-captcha") { captcha.refresh(); setTyped(""); }
      return fail(first[1], first[0]);
    }
    sendCode();
  };

  const onVerify = (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    if (otp.length < 6) return fail("Enter the 6-digit code we sent you.", "reg-otp");
    if (otp !== sentCode) return fail("That code is not right. Check it and try again.", "reg-otp");
    setBusy(true);
    setNotice("Account created. Taking you to your dashboard…");
    later(() => { signIn(name.trim().split(" ")[0]); navigate("/student"); }, 900);
  };

  return (
    <AuthLayout kind="register">
      {step === "details" ? (
        <form onSubmit={onDetails} noValidate>
          <div className="au-field m-field">
            <label htmlFor="reg-name">FULL NAME</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">◇</span>
              <input id="reg-name" type="text" name="name" value={name} onChange={(e) => { setName(e.target.value); clear(); }} placeholder="Your full name" autoComplete="name" disabled={busy} />
            </div>
          </div>
          <div className="au-field m-field">
            <label htmlFor="reg-email">EMAIL ADDRESS</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">@</span>
              <input id="reg-email" type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); clear(); }} placeholder="you@example.com" autoComplete="email" disabled={busy} />
            </div>
          </div>
          <div className="au-field m-field">
            <label htmlFor="reg-type">ACCOUNT TYPE</label>
            <div className="au-input m-control">
              <span className="au-icon" aria-hidden="true">🎓</span>
              <input id="reg-type" type="text" value="STUDENT" disabled aria-label="Account type: student only" readOnly />
            </div>
            <p className="au-note">Organizer? Accounts are created by our team — contact <a href="mailto:campuscode@gmail.com">campuscode@gmail.com</a></p>
          </div>
          <div>
            <PasswordField label="PASSWORD" id="reg-password" value={password} onChange={(v) => { setPassword(v); clear(); }} placeholder="Create a password" busy={busy} />
            {password && <p className="au-hint" style={{ marginTop: -9, marginBottom: 17 }}>Strength: {STRENGTH_LABEL[strength(password)]} — needs 8+ chars, upper + lower + number.</p>}
          </div>
          <PasswordField label="CONFIRM PASSWORD" id="reg-confirm" value={confirm} onChange={(v) => { setConfirm(v); clear(); }} placeholder="Repeat your password" busy={busy} />
          <div className="au-field m-field">
            <label htmlFor="reg-captcha">CAPTCHA</label>
            <div className="au-captcha-row">
              <CaptchaPicture code={captcha.code} className="au-captcha-img" />
              <NewCode className="au-new-link" onNew={captcha.refresh} disabled={busy} />
            </div>
            <div className="au-input m-control" style={{ marginTop: 8 }}>
              <input id="reg-captcha" type="text" value={typed} onChange={(e) => { setTyped(e.target.value); clear(); }} placeholder="Enter the code above" autoComplete="off" maxLength={5} inputMode="numeric" disabled={busy} style={{ paddingLeft: 12 }} />
            </div>
          </div>
          <div className="au-field m-field">
            <label className="au-age">
              <input id="reg-age" className="chk" type="checkbox" checked={adult} onChange={(e) => { setAdult(e.target.checked); clear(); }} disabled={busy} />
              <span>I confirm that I am <b>18 years of age or older</b>.</span>
            </label>
          </div>
          {error && <div className="au-message au-error" role="alert"><span>!</span><p>{error}</p></div>}
          <Submit mini busy={busy} label={busy ? "SENDING CODE..." : "SEND VERIFICATION CODE"} busyGlyph="..." />
        </form>
      ) : (
        <form onSubmit={onVerify} noValidate>
          <p className="au-sent">CODE SENT TO <strong>{email.trim().toLowerCase()}</strong></p>
          <div className="au-field m-field">
            <label htmlFor="reg-otp">6-DIGIT CODE</label>
            <div className="au-input m-control au-otp">
              <input id="reg-otp" type="text" inputMode="numeric" autoComplete="one-time-code" value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 8)); clear(); }} placeholder="••••••" maxLength={8} disabled={busy} autoFocus />
            </div>
            <p className="au-hint">Check your inbox (and spam folder). The code expires in 5 minutes.</p>
          </div>
          <div className="au-dev-hint"><span>TEST MODE</span><p>Mail is not configured — your code is <strong>{sentCode}</strong></p></div>
          {error && <div className="au-message au-error" role="alert"><span>!</span><p>{error}</p></div>}
          {notice && <div className="au-message au-success" role="status"><span>✓</span><p>{notice}</p></div>}
          <Submit mini busy={busy} label={busy ? "VERIFYING..." : "VERIFY & CREATE ACCOUNT"} busyGlyph="..." glyph="✓" />
          <div className="au-row">
            <button type="button" className="au-new-link" disabled={busy || left > 0} onClick={() => sendCode(true)}>
              {left > 0 ? `RESEND IN ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : "RESEND CODE"}
            </button>
            <button type="button" className="au-new-link" disabled={busy} onClick={() => { setStep("details"); setOtp(""); clear(); captcha.refresh(); setTyped(""); }}>← USE A DIFFERENT EMAIL</button>
          </div>
        </form>
      )}

      <div className="au-switch">
        <span>ALREADY HAVE AN ACCOUNT?</span>
        <button type="button" className="link-draw" onClick={() => { arrival.viaTransition = true; navigate("/login", { viewTransition: true }); }} disabled={busy}>LOGIN →</button>
      </div>
    </AuthLayout>
  );
}
