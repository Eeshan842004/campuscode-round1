/* The little bus on the login page. Same states as the live page:
   idle  = "Zzz" + READY
   drive = the bus rolls to the barrier while the sign-in is checked ("RIDING…")
   wait  = the bus waits at the barrier ("CONNECTING…") if it takes longer than 1.5 s */
export type BusState = "idle" | "drive" | "wait";

export function Bus({ state }: { state: BusState }) {
  const cls = state === "drive" ? "drive" : state === "wait" ? "waiting" : "";
  return (
    <>
      <div className={`au-ride ${cls}`} aria-hidden="true">
        {state === "idle" && <span className="au-ride-zzz">Zzz</span>}
        <span className="au-ride-bus">
          <span className="au-ride-body"><i /><i /><i /></span>
          <span className="au-ride-wheel left" /><span className="au-ride-wheel right" />
        </span>
        <span className="au-ride-barrier" />
        <span className="au-ride-status">{state === "idle" ? "READY" : state === "wait" ? "CONNECTING…" : "RIDING…"}</span>
        <span className="au-ride-traffic">● ● ●</span>
      </div>
      <span className="sr-only" role="status">{state === "idle" ? "" : "Checking your login"}</span>
    </>
  );
}
