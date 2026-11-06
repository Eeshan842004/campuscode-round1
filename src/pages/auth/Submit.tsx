import { ArrowLoop } from "../../motion/ArrowLoop";
import { MagnetButton } from "../../motion/MagnetButton";

/* The black submit button used by every form on Login and Register.
   It leans toward the cursor, presses in, loops its arrow on hover and shows a lime sweep while busy. */
const Mini = () => <span className="au-mini" aria-hidden="true"><i /><i /><i /></span>;

type Props = {
  label: string;
  busy?: boolean;
  mini?: boolean;        // the small three-slash chip on Register's button
  glyph?: string;        // a fixed glyph (for example the tick); leave out to get the looping arrow
  busyGlyph?: string;    // what shows on the right while busy
  spin?: boolean;        // spin the busy glyph
};

export function Submit({ label, busy = false, mini = false, glyph, busyGlyph, spin = false }: Props) {
  return (
    <MagnetButton type="submit" className="au-submit btn-press btn-busy" disabled={busy} aria-busy={busy}>
      {mini && <Mini />}
      <span>{label}</span>
      <b className={busy && spin ? "spin" : ""} aria-hidden="true">
        {busy ? busyGlyph : glyph ?? <ArrowLoop />}
      </b>
    </MagnetButton>
  );
}
