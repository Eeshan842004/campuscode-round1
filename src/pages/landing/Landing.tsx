import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../../site/site.css";
import "../../motion/motion.css";
import "./landing.css";
import { Logo } from "../../site/Logo";
import { Network } from "../../site/Network";
import { ArrowLoop } from "../../motion/ArrowLoop";
import { InkWord } from "../../motion/InkWord";
import { LineReveal } from "../../motion/LineReveal";
import { MagnetButton } from "../../motion/MagnetButton";
import { Roll } from "../../motion/Roll";
import { RiseLetters } from "../../motion/RiseLetters";
import { Scramble } from "../../motion/Scramble";
import { VelocityMarquee } from "../../motion/VelocityMarquee";
import { useCursorParallax } from "../../motion/useCursorParallax";
import { spotlight } from "../../motion/useSpotlight";

/* The story film is the organisers' own file on their site. It is linked, not copied. */
const FILM = "https://www.campuscode.co.in/videos/what-is-campuscode.mp4";

const STEPS = [
  { n: "01", title: "DISCOVER", text: "Find a challenge that makes you want to build." },
  { n: "02", title: "TEAM UP", text: "Find people who share your ambition." },
  { n: "03", title: "BUILD", text: "Turn your idea into something people can use." },
  { n: "04", title: "SHIP", text: "Submit your work and take it to the arena." },
];
const ARENA = [
  { n: "01", tag: "ARTIFICIAL INTELLIGENCE", title: "AI INNOVATION", text: "Build intelligent solutions for problems that matter.", status: "LIVE" },
  { n: "02", tag: "WEB DEVELOPMENT", title: "FUTURE WEB", text: "Design and ship the next generation of digital experiences.", status: "OPEN" },
  { n: "03", tag: "SMART TECHNOLOGY", title: "CAMPUS TECH", text: "Create technology that makes student life better.", status: "UPCOMING" },
];
const TICKER = ["IDEAS", "PEOPLE", "PRODUCTS", "INNOVATION", "COMMUNITY"];
const EMAIL_SUPPORT = "mailto:support@campuscode.co.in";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Play the film while at least 40% of it is on screen, pause when it leaves. A tap toggles it. */
function Film() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = video.current, el = box.current;
    if (!v || !el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    }, { threshold: 0.4 });
    const on = () => setPlaying(true), off = () => setPlaying(false);
    v.addEventListener("play", on); v.addEventListener("pause", off);
    io.observe(el);
    return () => { io.disconnect(); v.removeEventListener("play", on); v.removeEventListener("pause", off); };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      if (muted) { v.muted = false; setMuted(false); }   // the first tap turns the sound on
      v.play().catch(() => {});
    } else v.pause();
  };

  return (
    <div ref={box} className="lp-film" role="button" tabIndex={0} aria-label={playing ? "Pause the What is CampusCode film" : "Play the What is CampusCode film"}
      onClick={toggle} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}>
      {/* the frame opens from a smaller inset as it scrolls in; the purple glow stays on the outer box */}
      <div className="lp-film-frame story-open">
        <video ref={video} src={FILM} loop muted={muted} playsInline preload="metadata" />
        {!playing && <span className="lp-badge" aria-hidden="true">▶</span>}
        <span className="lp-hint" aria-hidden="true">{playing ? "TAP TO PAUSE" : "TAP TO PLAY"}</span>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const glow = useRef<HTMLDivElement>(null);
  const hero = useCursorParallax<HTMLElement>();
  const orbit = useCursorParallax<HTMLDivElement>();

  useEffect(() => { document.title = "CampusCode"; }, []);

  // soft purple glow that follows the mouse (one update per frame)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0, x = 0, y = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; if (glow.current) glow.current.style.transform = `translate(${x - 140}px, ${y - 140}px)`; });
    };
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(frame); };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
    setMenu(false);
  };
  const to = (path: string) => () => navigate(path);

  return (
    <div className="cc-site site lp">
      <div ref={glow} className="lp-cursor" aria-hidden="true" />

      <header className="lp-nav">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" })} />
        <nav className={`lp-links${menu ? " open" : ""}`} aria-label="Sections">
          <button type="button" onClick={() => go("about")}><Scramble text="ABOUT" trigger="hover" /></button>
          <button type="button" onClick={() => go("how")}><Scramble text="HOW IT WORKS" trigger="hover" /></button>
          <button type="button" onClick={() => go("hackathons")}><Scramble text="HACKATHONS" trigger="hover" /></button>
          <button type="button" onClick={() => go("community")}><Scramble text="COMMUNITY" trigger="hover" /></button>
          <MagnetButton type="button" className="lp-join btn-wipe" onClick={to("/register")}>JOIN CAMPUSCODE<span><ArrowLoop /></span></MagnetButton>
        </nav>
        <div className="lp-actions">
          <button type="button" className="lp-login link-draw" onClick={to("/login")}>LOGIN</button>
          <MagnetButton type="button" className="lp-join btn-wipe" onClick={to("/register")}>JOIN CAMPUSCODE<span><ArrowLoop /></span></MagnetButton>
        </div>
        <button type="button" className="lp-menu" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>☰</button>
      </header>

      <section ref={hero} className="lp-hero">
        <div className="lp-hero-grid" />
        <div className="lp-glow lp-glow-1" /><div className="lp-glow lp-glow-2" /><div className="lp-glow lp-glow-3" />
        <Network r={5} depth />
        <div className="lp-topline">
          <span><i /><Scramble text="THE DIGITAL HOME FOR STUDENT INNOVATION" /></span>
          <span><Scramble text="CHENNAI · INDIA" /></span>
        </div>
        <div className="lp-hero-content">
          <div className="lp-label"><Scramble text="CAMPUSCODE / 001" /></div>
          <LineReveal as="h1" lines={["BUILD", <InkWord key="c">COMPETE</InkWord>, "SHIP."]} />
          <div className="lp-desc lp-rise" style={{ ["--i" as string]: 3 }}>
            <p>A digital arena for students<br />who don't just have ideas.<br />They build them.</p>
            <MagnetButton type="button" className="lp-explore btn-wipe" onClick={() => go("hackathons")}><span>EXPLORE HACKATHONS</span><b><ArrowLoop /></b></MagnetButton>
          </div>
        </div>
        <div className="lp-bottom">
          <span>SCROLL TO EXPLORE</span>
          <div className="lp-scroll" aria-hidden="true"><i /></div>
          <span><Roll value="01 / 05" /></span>
        </div>
      </section>

      <section className="lp-marquee">
        <VelocityMarquee items={TICKER} speed={32} />
      </section>

      <section id="about" className="lp-about">
        <div className="lp-num">01</div>
        <div className="lp-about-text">
          <div className="lp-small-label"><i /><Scramble text="WHAT IS CAMPUSCODE?" /></div>
          <LineReveal lines={["WHERE", "STUDENTS", <InkWord key="b">BUILD.</InkWord>]} />
          <p>CampusCode brings students, teams, organizers and hackathons into one connected ecosystem.</p>
        </div>
        <div ref={orbit} className="lp-about-visual" aria-hidden="true">
          <div className="lp-ring-wrap depth" style={{ ["--d" as string]: 6 }}><div className="lp-ring lp-ring-a" /></div>
          <div className="lp-ring-wrap depth" style={{ ["--d" as string]: 12 }}><div className="lp-ring lp-ring-b" /></div>
          <div className="lp-ring-wrap depth" style={{ ["--d" as string]: 18 }}><div className="lp-ring lp-ring-c" /></div>
          <div className="lp-core">CC</div>
          <span className="lp-node lp-node-1">01</span><span className="lp-node lp-node-2">02</span><span className="lp-node lp-node-3">03</span>
        </div>
      </section>

      <section className="lp-video">
        <div className="lp-video-grid" />
        <div className="lp-video-top"><span><Scramble text="02 — EXPERIENCE" /></span><span><Roll value="00:30" /></span></div>
        <div className="lp-video-title">
          <small><Scramble text="THE CAMPUSCODE EXPERIENCE" /></small>
          <LineReveal as="strong" lines={["BUILD", "TOGETHER."]} />
        </div>
        <Film />
        <div className="lp-video-bottom"><span>WATCH THE STORY</span><span className="lp-auto-note">PLAYS AS YOU SCROLL <ArrowLoop /></span></div>
      </section>

      <section id="how" className="lp-how">
        <div className="lp-heading">
          <div><span>03</span><h2>HOW IT WORKS</h2></div>
          <p>FROM IDEA<br />TO IMPACT.</p>
        </div>
        <div className="lp-steps">
          {STEPS.map((s) => (
            <div className="lp-step spot" key={s.n} onPointerMove={spotlight}>
              <div className="lp-step-num">{s.n}</div>
              <div className="lp-step-line" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="lp-step-arrow" aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </section>

      <section id="hackathons" className="lp-arena">
        <div className="lp-heading">
          <div><span>04</span><h2>ENTER THE ARENA</h2></div>
          <button type="button" className="link-draw" onClick={to("/login")}>VIEW ALL <ArrowLoop /></button>
        </div>
        <div className="lp-list">
          {ARENA.map((h) => (
            <article className="lp-row row-shift spot" key={h.n} onPointerMove={spotlight}>
              <div className="row-inner">
                <div className="lp-row-num">{h.n}</div>
                <div className="lp-row-title"><small>{h.tag}</small><h3>{h.title}</h3></div>
                <p>{h.text}</p>
                <div className={`lp-status${h.status === "UPCOMING" ? " upcoming" : ""}`}><i className={h.status === "LIVE" ? "on dot-live" : ""} />{h.status}</div>
                <span className="lp-row-arrow row-arrow" aria-hidden="true">↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-mission">
        <div className="lp-watermark" aria-hidden="true">CAMPUSCODE</div>
        <div className="lp-mission-content">
          <span><Scramble text="05 — THE MISSION" /></span>
          <LineReveal lines={["GREAT", "IDEAS", <InkWord key="n">NEED BUILDERS.</InkWord>]} />
          <p>Your university is full of people with ideas. CampusCode gives those ideas somewhere to go.</p>
        </div>
      </section>

      <section id="community" className="lp-community">
        <div className="lp-community-left">
          <span><Scramble text="THE NETWORK" /></span>
          <LineReveal lines={["FIND", "YOUR", <InkWord key="p">PEOPLE.</InkWord>]} />
        </div>
        <div className="lp-community-right">
          <div className="lp-orbit" aria-hidden="true"><span className="lp-orbit-dots spin"><i /><i /><i /><i /><i /></span><strong>CC</strong></div>
          <p>Build with developers.<br />Think with designers.<br />Compete with builders.</p>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-cta-grid" />
        <div className="lp-cta-content">
          <small><Scramble text="READY?" /></small>
          <LineReveal lines={["YOUR NEXT", <InkWord key="p">PROJECT</InkWord>, "STARTS HERE."]} />
          <MagnetButton type="button" className="lp-cta-button btn-press" onClick={to("/register")}>JOIN CAMPUSCODE<span><ArrowLoop /></span></MagnetButton>
        </div>
        <div className="lp-cta-orb" aria-hidden="true" />
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-main">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <span className="cc-mark" aria-hidden="true"><span /><span /><span /></span>
              <span><strong>CAMPUSCODE</strong><small>HACKATHON ARENA</small></span>
            </div>
            <p>The student hackathon arena.<br />You build the idea,<br />we run the competition.</p>
          </div>
          <div className="lp-footer-col">
            <h4>PRODUCT</h4>
            <a href="#about" onClick={(e) => { e.preventDefault(); go("about"); }}>About</a>
            <a href="#hackathons" onClick={(e) => { e.preventDefault(); go("hackathons"); }}>Hackathons</a>
            <a href="#how" onClick={(e) => { e.preventDefault(); go("how"); }}>How it works</a>
            <a href="#community" onClick={(e) => { e.preventDefault(); go("community"); }}>Community</a>
          </div>
          <div className="lp-footer-col">
            <h4>BUILDERS</h4>
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>Students</a>
            <a href="#community" onClick={(e) => { e.preventDefault(); go("community"); }}>Teams</a>
            <a href="mailto:campuscode@gmail.com">Organizers</a>
            <a href="#how" onClick={(e) => { e.preventDefault(); go("how"); }}>Developers</a>
          </div>
          <div className="lp-footer-col">
            <h4>GUIDES</h4>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Hackathon Rules</a>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>FAQ</a>
            <a href={EMAIL_SUPPORT}>Support</a>
            <a href={EMAIL_SUPPORT}>Contact</a>
          </div>
        </div>
        <div className="lp-footer-status">
          <div><i className="dot-live" />ALL SYSTEMS OPERATIONAL</div>
          <a className="link-draw" href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>TERMS</a>
          <a className="link-draw" href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>PRIVACY</a>
          <a className="link-draw" href={EMAIL_SUPPORT}>CONTACT</a>
        </div>
        <RiseLetters text="CampusCode" className="lp-footer-watermark" />
        <div className="lp-footer-bottom">
          <span>© 2026 CAMPUSCODE</span>
          <span>LEARN · BUILD · COMPETE · SHIP</span>
          <span>CHENNAI · INDIA</span>
        </div>
      </footer>
    </div>
  );
}
