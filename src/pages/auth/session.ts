/* Mock sign-in. There is no backend, so "signed in" is just a flag kept in this browser.
   Login and Register set it, the dashboard checks it, and LOG OUT clears it. */
const KEY = "cc_auth";
const NAME = "cc_auth_name";

export function signIn(name?: string) {
  try {
    localStorage.setItem(KEY, "1");
    if (name) localStorage.setItem(NAME, name);
  } catch { /* storage can be blocked; the flag then lasts only until reload */ }
}
export function signOut() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
export function isSignedIn(): boolean {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}

/** Set just before a Login <-> Register view transition, so the arriving page skips its own entrance animation. */
export const arrival = { viaTransition: false };
