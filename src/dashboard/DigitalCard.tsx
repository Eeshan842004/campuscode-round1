// DIGITAL CARD tab: the student's identity card with a real, scannable QR code (made in the browser).
import { useMemo, useState } from "react";
import qrcode from "qrcode-generator";
import { STUDENT } from "./mock";
import { Avatar, Brand, Loader, PageHeading, pick } from "./parts";
import { useMock } from "./store";

/** A QR code as an SVG: one <path> of dark squares, so it scales cleanly. */
function Qr({ value, size }: { value: string; size: number }) {
  const { d, n } = useMemo(() => {
    const q = qrcode(0, "H");
    q.addData(value);
    q.make();
    const n = q.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return { d, n };
  }, [value]);
  return (
    <svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#ffffff" />
      <path d={d} fill="#0a0a0a" />
    </svg>
  );
}

export default function DigitalCard() {
  const data = useMock(() => STUDENT, 280);
  const [copied, setCopied] = useState(false);
  if (!data) return <Loader label="Loading Digital ID from backend..." />;
  const id = data.campusId;
  const url = `${window.location.origin}/u/${encodeURIComponent(id)}`;
  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section>
      <PageHeading eyebrow="IDENTITY / VERIFIED ACCOUNT" title="DIGITAL ID." text="Your identity card uses the real CampusCode profile and CampusCode ID returned by the backend." />
      <div className="digital-id-layout">
        <div className="digital-id-card">
          <div className="digital-id-top"><Brand /><span>VERIFIED</span></div>
          <div className="digital-id-main">
            <Avatar name={data.name} size={76} />
            <div><span>STUDENT</span><h2>{pick(data.name)}</h2><p>{pick(data.email)}</p></div>
          </div>
          <div className="digital-id-data">
            <div><span>CAMPUSCODE ID</span><strong>{pick(id)}</strong></div>
            <div><span>ROLE</span><strong>{pick(data.role)}</strong></div>
            <div><span>ACCOUNT</span><strong>ACTIVE</strong></div>
          </div>
          <div className="digital-id-qr-wrap">
            <Qr value={url} size={210} />
            <span>SCAN TO OPEN PUBLIC CAMPUSCODE PROFILE</span>
          </div>
          <div className="digital-id-footer"><span>LEARN · BUILD · BELONG</span><span>{pick(id)}</span></div>
        </div>
        <div className="digital-id-info">
          <span>IDENTITY / 01</span>
          <h2>ONE ID.<br />YOUR CAMPUSCODE.</h2>
          <p>The QR code is generated from the real public profile URL using the CampusCode ID returned by your backend. No placeholder QR pattern is used.</p>
          <div className="identity-check"><i /> BACKEND PROFILE LOADED</div>
          <div className="identity-actions">
            <button onClick={() => window.print()}>PRINT / SAVE</button>
            <button onClick={copy}>{copied ? "LINK COPIED ✓" : "COPY PROFILE LINK"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
