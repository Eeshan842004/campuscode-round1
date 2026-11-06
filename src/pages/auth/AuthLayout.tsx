import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import "../../site/site.css";
import "../../motion/motion.css";
import "./auth.css";
import { Logo } from "../../site/Logo";
import { Network } from "../../site/Network";
import { InkWord } from "../../motion/InkWord";
import { LineReveal } from "../../motion/LineReveal";
import { Roll } from "../../motion/Roll";
import { Scramble } from "../../motion/Scramble";
import { spotlight } from "../../motion/useSpotlight";
import { arrival } from "./session";

/* Login and Register are drawn as a pair on the live site (01 / 02 and 02 / 02),
   so they share this one layout and only the words and the form change. */
type Kind = "login" | "register";

const COPY = {
  login: {
    crumb: "CAMPUSCODE / AUTHENTICATION", kicker: "ACCESS", step: "01 / 02",
    desc: "Sign in to continue building, collaborating and competing with the CampusCode community.",
    cards: [{ n: "01", title: "BUILD" }, { n: "02", title: "COMPETE" }, { n: "03", title: "SHIP" }],
    system: ["AUTHENTICATION READY", "SECURE ACCESS", "2026"],
    label: "EXISTING ACCOUNT", title: "LOGIN", sub: "Access your CampusCode account.", code: "01", secure: "SECURE LOGIN",
    lines: ["ENTER", "THE"],
  },
  register: {
    crumb: "CAMPUSCODE / REGISTRATION", kicker: "CREATE", step: "02 / 02",
    desc: "Create your CampusCode identity and become part of a student ecosystem designed around ideas, teams, technology and competition.",
    cards: [
      { n: "01", tag: "IDENTITY", title: "CREATE", text: "Build your student profile and enter the CampusCode ecosystem." },
      { n: "02", tag: "TEAM", title: "COLLABORATE", text: "Find teammates and build projects together." },
      { n: "03", tag: "ARENA", title: "COMPETE", text: "Join hackathons and turn ideas into submissions." },
    ],
    system: ["REGISTRATION OPEN", "STUDENT INNOVATION NETWORK", "2026"],
    label: "NEW ACCOUNT", title: "REGISTER", sub: "Create your CampusCode account.", code: "02", secure: "SECURE REGISTRATION",
    lines: ["JOIN", "THE"],
  },
} as const;

export function AuthLayout({ kind, children }: { kind: Kind; children: ReactNode }) {
  const navigate = useNavigate();
  const c = COPY[kind];
  // arriving from the other page through a view transition: the card stays put, so skip the entrance
  const [still] = useState(() => arrival.viaTransition);
  useEffect(() => { arrival.viaTransition = false; }, []);
  return (
    <div className={`cc-site site au au-${kind}${still ? " au-still" : ""}`}>
      <div className="au-grid" />
      <div className="au-glow au-glow-1" /><div className="au-glow au-glow-2" />
      <Network />

      <header className="au-nav">
        <Logo onClick={() => navigate("/")} />
        <button type="button" className="au-back link-draw" onClick={() => navigate("/")}>← BACK TO HOME</button>
      </header>

      <main className="au-main">
        <section className="au-intro">
          <div className="au-status"><span /><Scramble text={c.crumb} /></div>
          <div className="au-index"><span>{c.kicker}</span><span><Roll value={c.step} /></span></div>
          <LineReveal as="h1" className="auth-head" lines={[c.lines[0], c.lines[1], <InkWord key="a">ARENA.</InkWord>]} />
          <p className="au-desc">{c.desc}</p>
          <div className="au-cards">
            {c.cards.map((card, i) => (
              kind === "login" ? (
                <div className="au-card-mini spot" key={card.n} onPointerMove={spotlight}><strong>{card.n}</strong><span>{card.title}</span></div>
              ) : (
                <div className="au-card-mini spot" key={card.n} onPointerMove={spotlight}>
                  <div className="au-mini-top"><span>{card.n}</span><span>{"tag" in card ? card.tag : ""}</span></div>
                  <strong>{card.title}</strong>
                  <p>{"text" in card ? card.text : ""}</p>
                  {i === 0 && <div className="au-mini-line"><i /></div>}
                </div>
              )
            ))}
          </div>
          <div className="au-system">
            <div><i />{c.system[0]}</div><div>{c.system[1]}</div><div>{c.system[2]}</div>
          </div>
        </section>

        <section className="au-wrap">
          <div className="au-card auth-card">
            <div className="au-card-top">
              <div>
                <span className="au-card-label">{c.label}</span>
                <h2>{c.title}</h2>
                <p>{c.sub}</p>
              </div>
              <div className="au-card-index">CC<br />{c.code}</div>
            </div>
            <div className="au-divider" />
            {children}
          </div>
          <div className="au-card-foot"><span>AUTH / 2026</span><span><i />{c.secure}</span></div>
        </section>
      </main>

      <footer className="au-bottom">
        <span>CAMPUSCODE © 2026</span><span>LEARN · BUILD · COMPETE · SHIP</span><span>ALL SYSTEMS OPERATIONAL</span>
      </footer>
    </div>
  );
}
