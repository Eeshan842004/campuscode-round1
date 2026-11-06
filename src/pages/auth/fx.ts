import { shake } from "../../motion/auth";

/** Shake the box around a field (found by the id of its input) when it fails validation. */
export function shakeField(id: string) {
  shake(document.getElementById(id)?.closest<HTMLElement>(".au-input, .au-age") ?? null);
}
