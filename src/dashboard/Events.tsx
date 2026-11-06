// EVENTS tab: every CampusCode event as a card. Copied from the live portal's structure; data is mocked.
import { useState } from "react";
import { EVENTS, type EventItem } from "./mock";
import { Banner, Empty, EventMark, Loader, PageHeading, fmtDate, pick } from "./parts";
import { getJoined, joinEvent, useMock } from "./store";

const TABS: [string, string][] = [["all", "All events"], ["hackathon", "Hackathons"], ["quiz", "Quizzes"]];

export function Events({ onOpen, onJoined }: { onOpen: (e: EventItem) => void; onJoined: (e: { hackathon: string }) => void }) {
  const events = useMock(() => EVENTS);
  const [joined, setJoined] = useState<Set<string>>(() => getJoined());
  const [joining, setJoining] = useState("");
  const [message, setMessage] = useState("");
  const [celebrate, setCelebrate] = useState("");
  const [tab, setTab] = useState("all");

  const join = (e: EventItem) => {
    if (joining || joined.has(e.id)) return;
    setJoining(e.id); setMessage("");
    window.setTimeout(() => {
      joinEvent(e.id);
      setJoined((s) => new Set([...s, e.id]));
      setMessage("Hackathon joined successfully.");
      setCelebrate(e.id);
      window.setTimeout(() => setCelebrate(""), 3000);
      setJoining("");
      onJoined({ hackathon: e.title });
    }, 700);
  };

  return (
    <section>
      <PageHeading eyebrow="DISCOVER / BACKEND DATA" title="EVENTS." text="Explore CampusCode events — hackathons, quizzes, workshops — and join the ones you want." count={events?.length ?? 0} />
      {message && <div className="student-inline-success">{message}</div>}
      {!events && <Loader />}
      {events && !events.length && <Empty title="NO HACKATHONS AVAILABLE" text="The backend returned no hackathons for this account right now." />}
      {events && events.length > 0 && (
        <div className="event-hub-tabs" role="tablist" aria-label="Filter events by type">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={`event-hub-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      )}
      {events && events.length > 0 && (
        <div className="hackathon-grid">
          {events.filter((e) => tab === "all" || e.event_type === tab).map((t) => {
            const isJoined = joined.has(t.id);
            const quiz = t.event_type === "quiz";
            return (
              <article key={t.id} className={`hackathon-card ${celebrate === t.id ? "join-celebrate" : ""}`}>
                {celebrate === t.id && (
                  <>
                    <span className="join-confetti"><i /><i /><i /><i /><i /><i /><i /><i /></span>
                    <span className="join-stamp">YOU'RE IN ✓</span>
                  </>
                )}
                <Banner kind={t.banner} title={t.title} />
                <div className="hackathon-card-top"><span>{t.id}</span><b>{t.status}</b></div>
                <div className="hackathon-card-brand"><EventMark title={t.title} /><h2>{t.title}</h2></div>
                {quiz && <p><strong>QUIZ · SOLO · TIMED</strong></p>}
                <p>{t.description}</p>
                <div className="hackathon-data">
                  <span><small>MODE</small>{pick(t.mode)}</span>
                  <span><small>{quiz ? "FORMAT" : "TEAM SIZE"}</small>{quiz ? "Solo" : t.max_team_size === 1 ? "Individual" : t.max_team_size ? `Up to ${t.max_team_size}` : "—"}</span>
                  <span><small>START</small>{fmtDate(t.start_date)}</span>
                </div>
                <div className="hackathon-actions">
                  <button onClick={() => onOpen(t)} className="student-outline-btn">VIEW DETAILS <b>↗</b></button>
                  <button onClick={() => join(t)} disabled={isJoined || joining === t.id} className={`student-join-btn ${isJoined ? "joined" : ""}`}>
                    {isJoined ? "✓ JOINED" : joining === t.id ? "JOINING..." : quiz ? "REGISTER FOR QUIZ ↗" : "JOIN HACKATHON ↗"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
