// MY EVENTS tab: one card per event the student joined, each with OPEN JOURNEY.
import { Banner, Empty, EventMark, Loader, PageHeading, pick } from "./parts";
import { myRegistrations, useMock } from "./store";
import type { EventItem } from "./mock";

export function MyEvents({ onOpen }: { onOpen: (e: EventItem) => void }) {
  const regs = useMock(() => myRegistrations());
  return (
    <section>
      <PageHeading eyebrow="MY ACTIVITY / BACKEND DATA" title="MY EVENTS." text="Every event you joined, in one place. Open one to see its rounds, team, results and certificates." count={regs?.length ?? 0} />
      {!regs && <Loader />}
      {regs && !regs.length && <Empty title="NO EVENTS JOINED" text="No joined events were returned for your student account." />}
      {regs && regs.length > 0 && (
        <div className="registration-grid">
          {regs.map((r) => (
            <article className="registration-card" key={r.registration_id}>
              <Banner kind={r.event.banner} title={r.event.title} />
              <div><span>REGISTRATION</span><b>{pick(r.registration_id, "CONFIRMED")}</b></div>
              <div className="hackathon-card-brand"><EventMark title={r.event.title} /><h2>{r.event.title}</h2></div>
              <p>STATUS: <strong>{pick(r.status, "REGISTERED")}</strong></p>
              <p>TEAM: <strong>{pick(r.team_name, "NOT ASSIGNED")}</strong></p>
              <button onClick={() => onOpen(r.event)} className="student-primary-btn">OPEN JOURNEY ↗</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
