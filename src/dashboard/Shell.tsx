// The student dashboard shell: sidebar, top bar, and the page shown for the chosen tab.
// Like the live portal, every tab lives on the one /student URL and the tab is kept in state.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import "./student.css";
import "./banners.css";
import { signOut } from "../pages/auth/session";
import { Events } from "./Events";
import { EventHub, type HubTab } from "./EventHub";
import { IconBell, IconBot, IconCertificates, IconEvents, IconIdCard, IconMyEvents, IconOverview, IconProfile, IconRefresh, IconSparkles } from "./icons";
import { NOTIFICATIONS, STUDENT, type EventItem } from "./mock";
import { MyEvents } from "./MyEvents";
import { OtherTab } from "./OtherTabs";
import IdeaCheck from "./IdeaCheck";
import DigitalCard from "./DigitalCard";
import Profile from "./Profile";
import { Overview } from "./Overview";
import { Avatar, Brand } from "./parts";

const ICON = { size: 16, strokeWidth: 1.8 };
// Same labels, same order, same icons as the live sidebar.
const NAV: [string, ReactNode][] = [
  ["Overview", <IconOverview {...ICON} />],
  ["Events", <IconEvents {...ICON} />],
  ["My Events", <IconMyEvents {...ICON} />],
  ["HackMate AI", <IconSparkles {...ICON} />],
  ["IdeaCheck AI", <IconSparkles {...ICON} />],
  ["Certificates", <IconCertificates {...ICON} />],
  ["Digital Card", <IconIdCard {...ICON} />],
  ["RuleBot AI", <IconBot {...ICON} />],
  ["Student Guide", <IconBot {...ICON} />],
  ["Official Communication", <IconBell {...ICON} />],
  ["Notifications", <IconBell {...ICON} />],
  ["Help & Support", <IconBot {...ICON} />],
  ["Profile", <IconProfile {...ICON} />],
];

/** Pop-up with confetti shown after joining an event. */
function Milestone({ event, onClose }: { event: { hackathon: string } | null; onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!event || !c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
    const colors = ["#a7f37a", "#7665ff", "#ffffff", "#e8b93c", "#23f39a"];
    const bits: { x: number; y: number; vx: number; vy: number; s: number; r: number; vr: number; c: string; life: number }[] = [];
    const burst = (x: number, spread: number) => {
      for (let i = 0; i < 70; i++) bits.push({ x, y: H * 0.72, vx: (Math.random() - 0.5) * spread, vy: -Math.random() * 13 - 5, s: Math.random() * 7 + 4, r: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0], life: 1 });
    };
    burst(W * 0.5, 16);
    const t1 = window.setTimeout(() => burst(W * 0.22, 10), 180), t2 = window.setTimeout(() => burst(W * 0.78, 10), 320);
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const b of bits) {
        b.vy += 0.32; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life -= 0.008;
        if (b.life <= 0 || b.y > H + 20) continue;
        ctx.save(); ctx.globalAlpha = Math.max(0, b.life); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c;
        ctx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * 0.62); ctx.restore();
      }
      if (bits.some((b) => b.life > 0 && b.y < H + 20)) raf = requestAnimationFrame(tick); else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [event]);
  if (!event) return null;
  return (
    <div className="student-milestone-backdrop">
      <canvas ref={canvas} className="milestone-confetti" aria-hidden="true" />
      <div className="student-milestone-card">
        <div className="student-milestone-icon">✦</div>
        <span>REGISTRATION CONFIRMED</span>
        <h2>YOU'RE IN.</h2>
        <p>Your registration for {event.hackathon || "this hackathon"} is confirmed. Time to build.</p>
        <button onClick={onClose}>CONTINUE BUILDING</button>
      </div>
    </div>
  );
}

export default function Shell() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [menu, setMenu] = useState(false);
  const [hubEvent, setHubEvent] = useState<EventItem | null>(null);
  const [hubTab, setHubTab] = useState<HubTab>("overview");
  const [milestone, setMilestone] = useState<{ hackathon: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const milestoneTimer = useRef(0);

  const name = STUDENT.name;
  const initials = useMemo(() => name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase(), [name]);
  const unread = NOTIFICATIONS.length;

  useEffect(() => {
    document.title = "CampusCode";
    return () => clearTimeout(milestoneTimer.current);
  }, []);

  const toTop = () => requestAnimationFrame(() => document.querySelector(".student-main")?.scrollTo({ top: 0, behavior: "smooth" }));
  const go = (t: string) => { setTab(t); setHubEvent(null); setMenu(false); toTop(); };
  const openEvent = (e: EventItem, t: HubTab = "overview") => { setHubEvent(e); setHubTab(t); setTab("EventHub"); setMenu(false); toTop(); };
  const logout = () => { signOut(); navigate("/login", { replace: true }); };
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshKey((k) => k + 1);                 // the page loads its data again
    window.setTimeout(() => setRefreshing(false), 650);
  };
  const celebrate = (e: { hackathon: string }) => {
    setMilestone(e);
    clearTimeout(milestoneTimer.current);
    milestoneTimer.current = window.setTimeout(() => setMilestone(null), 4800);
  };

  let page: ReactNode = <Overview go={go} />;
  if (tab === "Events") page = <Events onOpen={(e) => openEvent(e)} onJoined={celebrate} />;
  else if (tab === "My Events") page = <MyEvents onOpen={(e) => openEvent(e)} />;
  else if (tab === "EventHub") page = hubEvent ? <EventHub event={hubEvent} tab={hubTab} setTab={setHubTab} onBack={() => go("My Events")} /> : <MyEvents onOpen={(e) => openEvent(e)} />;
  else if (tab === "IdeaCheck AI") page = <IdeaCheck />;
  else if (tab === "Digital Card") page = <DigitalCard />;
  else if (tab === "Profile") page = <Profile />;
  else if (tab !== "Overview") page = <OtherTab name={tab} />;

  return (
    <div className="student-panel">
      <Milestone event={milestone} onClose={() => { clearTimeout(milestoneTimer.current); setMilestone(null); }} />
      <div className="student-bg-grid" />
      <div className="student-bg-orb one" />
      <div className="student-bg-orb two" />
      <div className="student-mobile-topbar">
        <button onClick={() => setMenu((m) => !m)} className="student-menu-button">☰</button>
        <Brand mobile />
        <div className="student-mobile-avatar">{initials || "S"}</div>
      </div>
      <aside className={`student-sidebar ${menu ? "student-sidebar-open" : ""}`}>
        <button className="student-sidebar-close" onClick={() => setMenu(false)} aria-label="Close sidebar">‹</button>
        <Brand />
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="student-nav">
          {NAV.map(([label, icon]) => {
            const active = tab === label || (tab === "EventHub" && label === "My Events");
            return (
              <button key={label} type="button" className={`student-nav-item ${active ? "active" : ""} ${label === "RuleBot AI" ? "rulebot-nav-item" : ""}`} onClick={() => go(label)}>
                <span className="student-nav-icon">{icon}</span>
                <span>{label}</span>
                {active && <b>→</b>}
              </button>
            );
          })}
        </nav>
        <div className="student-sidebar-bottom">
          <div className="sidebar-label">ACCOUNT</div>
          <div className="sidebar-user"><div>{initials || "S"}</div><span><strong>{name}</strong><small>{STUDENT.role}</small></span></div>
          <button type="button" className="logout-btn" onClick={logout}><span>↪</span>LOG OUT</button>
        </div>
      </aside>
      <main className="student-main">
        <header className="student-topbar">
          <div><span>CAMPUSCODE / STUDENT</span><strong>{tab.toUpperCase()}</strong></div>
          <div className="student-top-actions">
            <button type="button" className="student-top-notification" onClick={() => go("Notifications")} aria-label="Open notifications">
              <IconBell {...ICON} />
              {unread > 0 ? <b className="notif-badge">{unread > 9 ? "9+" : unread}</b> : <i />}
            </button>
            <button type="button" className={`campus-refresh-button ${refreshing ? "is-refreshing" : ""}`} onClick={refresh} disabled={refreshing} aria-label="Refresh current page" title="Refresh current page">
              <span className="campus-refresh-icon-wrap"><IconRefresh size={16} strokeWidth={1.9} /></span>
              <span className="campus-refresh-label">REFRESH</span>
            </button>
            <div className="topbar-user"><Avatar name={name} size={34} /><span>{name}</span></div>
          </div>
        </header>
        <div className="student-content">
          <div className="student-view" key={`${tab}-${hubEvent?.id ?? ""}-${refreshKey}`}>{page}</div>
        </div>
      </main>
    </div>
  );
}
