// OVERVIEW tab (the first screen after login): greeting, current event, stats, discover list, deadlines, notifications.
import { useState } from "react";
import { IconCertificates, IconCircleCheck, IconEvents, IconBot, IconSparkles, IconUsers, IconZap } from "./icons";
import { EVENTS, NOTIFICATIONS, STATS, STUDENT } from "./mock";
import { Avatar, Empty, EventMark, Loader, PageHeading, fmtDate, pick } from "./parts";
import { getJoined, joinEvent, myRegistrations, useMock } from "./store";

type Go = (tab: string) => void;

/** DISCOVER EVENTS: the first three events with a quick join button. */
function Discover({ go }: { go: Go }) {
  const [joined, setJoined] = useState<Set<string>>(() => getJoined());
  const [busy, setBusy] = useState("");
  const [celebrate, setCelebrate] = useState("");
  const join = (id: string) => {
    if (busy || joined.has(id)) return;
    setBusy(id);
    window.setTimeout(() => {
      joinEvent(id);
      setJoined((s) => new Set([...s, id]));
      setCelebrate(id);
      window.setTimeout(() => setCelebrate(""), 3000);
      setBusy("");
    }, 700);
  };
  return (
    <div className="student-dashboard-discover">
      <div className="student-panel-title"><span>03 / DISCOVER EVENTS</span><button onClick={() => go("Events")}>VIEW ALL ↗</button></div>
      <div className="student-discover-grid">
        {EVENTS.slice(0, 3).map((e) => {
          const isJoined = joined.has(e.id);
          return (
            <div key={e.id} className={`student-discover-card ${celebrate === e.id ? "join-celebrate" : ""}`}>
              {celebrate === e.id && (
                <>
                  <span className="join-confetti"><i /><i /><i /><i /><i /><i /><i /><i /></span>
                  <span className="join-stamp">YOU'RE IN ✓</span>
                </>
              )}
              <div className="student-discover-head">
                <EventMark title={e.title} size={40} />
                <div>
                  <span>{pick(e.category, "HACKATHON")}</span>
                  <strong>{e.title}</strong>
                  <small>{fmtDate(e.start_date)}</small>
                  {e.event_type !== "quiz" && (e.max_team_size === 1 ? <small>Individual participation</small> : null)}
                </div>
              </div>
              <button disabled={isJoined || busy === e.id} onClick={() => join(e.id)}>{isJoined ? "JOINED" : busy === e.id ? "JOINING" : "JOIN NOW ↗"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Upcoming deadlines, AI shortcuts and the journey bars. */
function Enrich({ go }: { go: Go }) {
  const rows = [
    { label: "HACKATHONS", n: STATS.registered, icon: <IconEvents size={16} strokeWidth={1.8} /> },
    { label: "ONGOING", n: STATS.ongoing, icon: <IconZap size={16} strokeWidth={1.8} /> },
    { label: "COMPLETED", n: STATS.completed, icon: <IconCircleCheck size={16} strokeWidth={1.8} /> },
    { label: "CERTIFICATES", n: STATS.certificates, icon: <IconCertificates size={16} strokeWidth={1.8} /> },
  ];
  const max = Math.max(1, ...rows.map((r) => r.n));
  const deadlines = myRegistrations()
    .map((r) => ({ title: r.event.title, date: r.start_date || r.registration_deadline || r.deadline }))
    .filter((d): d is { title: string; date: string } => !!d.date);
  return (
    <div className="student-enrich">
      <div className="student-panel-card enrich-card">
        <div className="student-panel-title"><span>UPCOMING DEADLINES</span><button onClick={() => go("My Events")}>VIEW ALL ↗</button></div>
        {deadlines.length ? (
          <div className="enrich-deadlines">
            {deadlines.map((d, i) => (
              <div className="enrich-deadline" key={i}>
                <div className="enrich-date"><strong>{fmtDate(d.date).split(" ").slice(0, 2).join(" ")}</strong><small>{fmtDate(d.date)}</small></div>
                <div className="enrich-deadline-info"><strong>{d.title}</strong><span>STARTS SOON</span></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="enrich-empty"><strong>No deadlines yet.</strong><p>Join an event and your upcoming dates will appear here.</p><button onClick={() => go("Events")}>BROWSE EVENTS ↗</button></div>
        )}
      </div>
      <div className="student-panel-card enrich-card enrich-ai">
        <div className="student-panel-title"><span>AI SPOTLIGHT</span></div>
        <h3>Your AI teammates are ready.</h3>
        <p>Check your idea, find teammates, or ask the rules — right from here.</p>
        <div className="enrich-ai-actions">
          <button onClick={() => go("IdeaCheck AI")}><IconSparkles size={14} /> IDEACHECK</button>
          <button onClick={() => go("HackMate AI")}><IconUsers size={14} /> HACKMATE</button>
          <button onClick={() => go("RuleBot AI")}><IconBot size={14} /> RULEBOT</button>
        </div>
      </div>
      <div className="student-panel-card enrich-card">
        <div className="student-panel-title"><span>YOUR JOURNEY</span><button onClick={() => go("Certificates")}>CERTIFICATES ↗</button></div>
        <div className="enrich-journey">
          {rows.map((r) => (
            <div className="enrich-journey-row" key={r.label}>
              <span className="enrich-journey-icon">{r.icon}</span>
              <div className="enrich-journey-bar"><i style={{ width: `${Math.round((r.n / max) * 100)}%` }} /></div>
              <strong>{r.n}</strong><small>{r.label}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Overview({ go }: { go: Go }) {
  const data = useMock(() => ({ current: EVENTS[0], notes: NOTIFICATIONS }));
  if (!data) return <Loader />;
  const { current, notes } = data;
  const first = STUDENT.name.split(" ")[0].toUpperCase();
  return (
    <section>
      <PageHeading
        eyebrow="STUDENT WORKSPACE / LIVE"
        title={<>WELCOME BACK, <span className="name-highlight">{first}</span>.</>}
        text="Your CampusCode activity is loaded directly from the backend."
      />
      <div className="student-hero">
        <div className="student-hero-copy">
          <span>BUILD · LEARN · COLLABORATE</span>
          <h2>{current.title}</h2>
          <p>{current.description}</p>
          <button onClick={() => go("Events")} className="student-primary-btn">OPEN EVENT <b>↗</b></button>
        </div>
        <div className="student-hero-avatars"><Avatar name={STUDENT.name} size={88} /><EventMark title={current.title} size={64} /></div>
      </div>
      <div className="student-stats-grid">
        {([["REGISTERED", STATS.registered], ["ONGOING", STATS.ongoing], ["COMPLETED", STATS.completed], ["CERTIFICATES", STATS.certificates]] as const).map(([label, n]) => (
          <div className="student-stat-card" key={label}><span>{label}</span><strong>{n}</strong><small>FROM BACKEND</small></div>
        ))}
      </div>
      <Discover go={go} />
      <Enrich go={go} />
      <div className="student-two-col">
        <div className="student-panel-card">
          <div className="student-panel-title"><span>01 / CURRENT ACTIVITY</span><button onClick={() => go("Events")}>VIEW EVENTS ↗</button></div>
          <div className="current-event">
            <div className="current-event-code">{current.id}</div>
            <h3>{current.title}</h3>
            <div className="current-event-meta"><span>{current.status}</span><span>{pick(current.mode)}</span><span>{fmtDate(current.start_date)}</span></div>
          </div>
        </div>
        <div className="student-panel-card">
          <div className="student-panel-title"><span>02 / NOTIFICATIONS</span><button onClick={() => go("Notifications")}>OPEN ALL ↗</button></div>
          {notes.length ? (
            <div className="notification-mini-list">
              {notes.map((n) => (
                <div className="notification-mini" key={n.id}>
                  <span className="live-dot" />
                  <div><strong>{n.title}</strong><small>{n.body}</small></div>
                  <time>{fmtDate(n.created_at)}</time>
                </div>
              ))}
            </div>
          ) : <Empty title="ALL CAUGHT UP" text="No unread notifications." />}
        </div>
      </div>
    </section>
  );
}
