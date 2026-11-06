// The event page that VIEW DETAILS and OPEN JOURNEY both open: a heading, tabs, and one panel per tab.
// The Overview tab is the "journey": registration record, round pipeline, team record, and the selected round.
import { useEffect, useState } from "react";
import { ROUNDS, TEAMS, type EventItem, type Round } from "./mock";
import { Banner, Empty, Loader, PageHeading, pick } from "./parts";
import { myRegistrations, useMock } from "./store";

export type HubTab = "overview" | "rounds" | "team" | "results" | "leaderboard" | "certificates" | "announcements" | "quiz";

const HACKATHON_TABS: [HubTab, string][] = [["overview", "Overview"], ["rounds", "Rounds"], ["team", "My Team"], ["results", "Results"], ["leaderboard", "Leaderboard"], ["certificates", "Certificates"], ["announcements", "Announcements"]];
const QUIZ_TABS: [HubTab, string][] = [["overview", "Overview"], ["quiz", "Quiz"], ["leaderboard", "Leaderboard"], ["certificates", "Certificates"], ["announcements", "Announcements"]];

/** Big "time left" card that ticks every second. */
function TimeLeft({ endAt }: { endAt: string }) {
  const end = new Date(endAt).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, end - now), s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  const text = d > 0 ? `${d}d ${two(h)}:${two(m)}:${two(sec)}` : `${two(h)}:${two(m)}:${two(sec)}`;
  const ends = new Date(end).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).toUpperCase();
  return (
    <div className="student-panel-card" style={{ marginBottom: 16 }}>
      <div className="student-panel-title"><span>TIME LEFT</span><span>{left <= 0 ? "ROUND ENDED" : `ENDS ${ends}`}</span></div>
      <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color: left <= 0 ? "#991b1b" : "#111" }}>{left <= 0 ? "TIME UP" : text}</div>
      {left > 0 && <div style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#888" }}>{d > 0 ? "DAYS  HOURS  MINUTES  SECONDS" : "HOURS  MINUTES  SECONDS"}</div>}
    </div>
  );
}

/** Details of the round you clicked in the pipeline. */
function RoundDetails({ round }: { round: Round }) {
  const fmt = (o: Intl.DateTimeFormatOptions) => new Date(round.end_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...o });
  return (
    <div className="student-panel-card" style={{ marginBottom: 16 }}>
      <div className="student-panel-title"><span>ROUND {round.number} DETAILS</span><span>{round.status.toUpperCase()}</span></div>
      <h3 style={{ fontSize: 26, letterSpacing: "-0.045em", margin: "0 0 12px" }}>{round.title}</h3>
      {round.show_timer && <TimeLeft endAt={round.end_at} />}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#888", marginBottom: 6 }}>WHAT YOU NEED TO SUBMIT</div>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#444" }}>{round.requirement}</p>
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#666" }}>Deadline: {fmt({ day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
      <p style={{ margin: 0, fontSize: 13, color: "#666" }}>AI usage: Not required for this round</p>
    </div>
  );
}

/** Overview tab for a hackathon: the registration journey. */
function Journey({ event }: { event: EventItem }) {
  const reg = myRegistrations().find((r) => r.hackathon_id === event.id);
  const rounds = ROUNDS[event.id] ?? [];
  const [open, setOpen] = useState<Round | null>(null);
  const team = TEAMS[event.id];
  const data = useMock(() => ({ rounds, reg }), 280);
  if (!data) return <Loader />;
  return (
    <section>
      <Banner kind={event.banner} title={event.title} />
      <div className="registration-detail-head">
        <div><span>REGISTRATION ID</span><strong>{pick(reg?.registration_id, "CONFIRMED")}</strong></div>
        <div><span>STATUS</span><strong>{pick(reg?.status, "REGISTERED")}</strong></div>
        <div><span>TEAM</span><strong>{pick(reg?.team_name, "NOT ASSIGNED")}</strong></div>
      </div>
      <div className="student-two-col">
        <div className="student-panel-card">
          <div className="student-panel-title"><span>ROUND PIPELINE</span></div>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>Click a round to see what you need to submit.</p>
          {rounds.length ? rounds.map((r) => (
            <div className="round-row" key={r.number} onClick={() => setOpen(r)} style={{ cursor: "pointer" }} title="View round details">
              <div className="round-number">{r.number}</div>
              <div><strong>{r.title}</strong><span>{r.status}</span></div>
              <b>{pick(r.result)}</b>
            </div>
          )) : <Empty title="NO ROUND DATA" text="No round records were returned for this hackathon." />}
        </div>
        <div className="student-panel-card">
          <div className="student-panel-title"><span>TEAM RECORD</span></div>
          {team ? (
            <div className="team-detail">
              <span>TEAM</span><h3>{team.name}</h3>
              <p>ID: {team.id}</p><p>STATUS: {team.status}</p>
            </div>
          ) : <Empty title="NO TEAM DATA" text="No team record was returned for this registration." />}
        </div>
      </div>
      {open && <RoundDetails round={open} />}
    </section>
  );
}

/** Overview tab for a quiz: the four stat cards and how the quiz works. */
function QuizOverview({ event, onGoToQuiz }: { event: EventItem; onGoToQuiz: () => void }) {
  const q = event.quiz;
  if (!q) return <Empty title="QUIZ NOT FOUND" text="No quiz details were returned for this event." />;
  const cards: [string | number, string, string][] = [[q.questions, "QUESTIONS", "#7665ff"], [q.marks, "TOTAL MARKS", "#a8e62e"], [`${q.minutes} MIN`, "DURATION", "#111"], [q.negative ? `−${q.negative}` : "NONE", "NEGATIVE", "#999"]];
  return (
    <section>
      <div className="quiz-stat-cards">
        {cards.map(([n, label, color]) => (
          <div className="quiz-stat-card" key={label}><i style={{ background: color }} /><strong>{n}</strong><span>{label}</span></div>
        ))}
      </div>
      <div className="student-panel-card" style={{ marginTop: 16 }}>
        <div className="student-panel-title"><span>HOW THIS QUIZ WORKS</span></div>
        <p style={{ lineHeight: 1.7, color: "#555" }}>Solo quiz, single attempt. The timer starts when you press Start and auto-submits at zero — answers saved so far are still scored. No negative marking.</p>
        <div style={{ marginTop: 16 }}><button className="student-primary-btn" onClick={onGoToQuiz}>OPEN QUIZ ↗</button></div>
      </div>
    </section>
  );
}

/** Panels for the tabs that have nothing to show yet in this demo (the live portal shows its own empty states). */
function EmptyTab({ tab }: { tab: HubTab }) {
  const texts: Partial<Record<HubTab, [string, string]>> = {
    rounds: ["NO ROUND DATA", "No round records were returned for this hackathon."],
    results: ["NO RESULTS YET", "Results appear here once the organizer publishes them."],
    leaderboard: ["NO LEADERBOARD YET", "The leaderboard appears once results are published."],
    certificates: ["NO CERTIFICATES YET", "Certificates appear here once an event is completed."],
    announcements: ["NO ANNOUNCEMENTS", "Organizer announcements for this event will show up here."],
    quiz: ["QUIZ CLOSED", "This quiz has ended. Your result appears under Leaderboard once the organizer posts it."],
  };
  const [title, text] = texts[tab] ?? ["NOTHING HERE YET", "Nothing to show for this tab."];
  return <Empty title={title} text={text} />;
}

export function EventHub({ event, tab, setTab, onBack }: { event: EventItem; tab: HubTab; setTab: (t: HubTab) => void; onBack: () => void }) {
  const quiz = event.event_type === "quiz";
  const tabs = quiz ? QUIZ_TABS : HACKATHON_TABS;
  return (
    <section>
      <button className="back-btn" onClick={onBack}>← ALL MY EVENTS</button>
      <PageHeading
        eyebrow="EVENT / LIVE HUB"
        title={`${event.title.toUpperCase()}.`}
        text={quiz ? "Everything for this quiz lives here — the timed quiz, leaderboard and certificates." : "Everything for this event lives here — rounds, team, results, leaderboard and certificates."}
      />
      {quiz && <Banner kind={event.banner} title={event.title} />}
      <div className="event-hub-tabs" role="tablist" aria-label="Event sections">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`event-hub-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      <div className="event-hub-panel" key={tab}>
        {tab === "overview" && (quiz ? <QuizOverview event={event} onGoToQuiz={() => setTab("quiz")} /> : <Journey event={event} />)}
        {tab === "team" && !quiz && <Journey event={event} />}
        {tab !== "overview" && tab !== "team" && <EmptyTab tab={tab} />}
      </div>
    </section>
  );
}
