import { useEffect, useState } from "react";

/* The organisers' logo file. Drop it at public/campuscode-logo.png and it is used as-is
   (never recoloured or stretched). Until the file exists, the three-slash mark is drawn
   with CSS exactly like the live pages do, so nothing looks broken. */
const FILE = "/campuscode-logo.png";

let known: boolean | null = null;                 // checked once per page load
let pending: Promise<boolean> | null = null;
function logoFileExists(): Promise<boolean> {
  if (known !== null) return Promise.resolve(known);
  pending ??= new Promise<boolean>((done) => {
    const img = new Image();
    img.onload = () => { known = true; done(true); };
    img.onerror = () => { known = false; done(false); };
    img.src = FILE;
  });
  return pending;
}

export function Logo({ onClick, small }: { onClick?: () => void; small?: boolean }) {
  const [hasFile, setHasFile] = useState(known === true);
  useEffect(() => { let alive = true; logoFileExists().then((ok) => alive && setHasFile(ok)); return () => { alive = false; }; }, []);
  return (
    <button type="button" className="cc-logo" aria-label="CampusCode home" onClick={onClick}>
      {hasFile ? (
        <img src={FILE} alt="CampusCode, Hackathon Arena" />
      ) : (
        <>
          <span className="cc-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>
            <strong>CAMPUSCODE</strong>
            {!small && <small>HACKATHON ARENA</small>}
          </span>
        </>
      )}
    </button>
  );
}
