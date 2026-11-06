// IDEACHECK AI tab. Same layout and wording as the live portal; the backend call is replaced by a small
// local "analysis" so a report can be shown without a server.
import { useState } from "react";
import { Loader, PageHeading, pick } from "./parts";

interface Report {
  similarity_check: { status: string; similarity_score: number; matched_project?: { title: string; description: string; category: string; technology: string } };
  idea_evaluation: { overall: number; verdict: string; technology: number; usage: number; innovation: number; practicality: number; feasibility: number };
  ai_analysis: { available: boolean; ai_verdict: string; confidence: number; model_name: string; summary: string; similarity_explanation: string; unique_points: string[]; feature_suggestions: string[]; improvement_suggestions: string[]; differentiation_strategy: string };
  disclaimer: string;
}

// A tiny stand-in for the backend's dataset check + Gemini answer.
function analyse(text: string): Report {
  const words: string[] = text.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const known = ["campus", "student", "hackathon", "attendance", "event", "learning", "portal", "team"];
  const hits = known.filter((k) => words.includes(k)).length;
  const score = Math.min(88, 22 + hits * 11 + (words.length % 7));
  const similar = score >= 50;
  return {
    similarity_check: {
      status: similar ? "SIMILAR_FOUND" : "NO_SIMILAR",
      similarity_score: score,
      matched_project: similar ? { title: "Campus Event Manager", description: "A web portal where students discover campus events, register and track their participation.", category: "Web Development", technology: "React, Node.js" } : undefined,
    },
    idea_evaluation: { overall: 7.4, verdict: "Promising", technology: 7, usage: 8, innovation: 7, practicality: 8, feasibility: 7 },
    ai_analysis: {
      available: true, ai_verdict: similar ? "SIMILAR" : "UNIQUE", confidence: 82, model_name: "Gemini",
      summary: similar ? "Your idea overlaps with an existing campus project, but it can stand apart." : "Your idea looks different from the projects in the reference dataset.",
      similarity_explanation: "The core problem and target users are close to a known reference, while your feature mix and workflow are different.",
      unique_points: ["Clear focus on one group of users", "Simple flow from problem to result"],
      feature_suggestions: ["Add a progress dashboard", "Send reminders before important dates"],
      improvement_suggestions: ["Describe your target users in more detail", "Explain how you will measure success"],
      differentiation_strategy: "Lead with the single feature nobody else offers, and keep the rest of the product simple.",
    },
    disclaimer: "This report is a guide only. Always review your idea with your mentors before you build.",
  };
}

export default function IdeaCheck() {
  const [text, setText] = useState("");
  const [data, setData] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = () => {
    const t = text.trim();
    if (t.length < 10) { setError("Enter at least 10 characters so IdeaCheck AI can analyze your idea."); return; }
    setBusy(true); setError(""); setData(null);
    window.setTimeout(() => { setData(analyse(t)); setBusy(false); }, 1400);
  };

  const sim = data?.similarity_check;
  const ev = data?.idea_evaluation;
  const ai = data?.ai_analysis;
  const match = sim?.matched_project;
  const score = Number(sim?.similarity_score || 0);
  const conf = Number(ai?.confidence || 0);
  const hasAi = ai?.available !== false && !!ai?.summary;

  return (
    <section className="ideacheck-page">
      <PageHeading eyebrow="CAMPUSCODE INTELLIGENCE / IDEACHECK" title="IDEACHECK AI." text="Check your idea against the CampusCode reference dataset, then get a Gemini-powered explanation and improvement plan." />
      <div className="ideacheck-hero-grid">
        <div className="ideacheck-input-card">
          <div className="ideacheck-card-head">
            <div><span className="student-feature-label">01 / YOUR IDEA</span><h2>WHAT ARE YOU BUILDING?</h2></div>
            <div className="ideacheck-ai-badge">GEMINI AI</div>
          </div>
          <textarea className="ideacheck-textarea" value={text} onChange={(e) => setText(e.target.value.slice(0, 5000))} placeholder="Describe your project idea, the problem it solves, target users and the main features..." maxLength={5000} />
          <div className="ideacheck-input-footer">
            <span>{text.length} / 5000</span>
            <button type="button" className="student-primary-btn ideacheck-analyze-btn" onClick={run} disabled={busy || text.trim().length < 10}>{busy ? "ANALYZING WITH AI..." : "CHECK IDEA WITH AI ↗"}</button>
          </div>
          {error && <div className="student-inline-error">{error}</div>}
        </div>
        <div className="ideacheck-process-card">
          <span className="student-feature-label">HOW IT WORKS</span>
          <div className="ideacheck-process-step"><b>01</b><div><strong>DATASET CHECK</strong><span>Compares your idea against the CampusCode reference projects.</span></div></div>
          <div className="ideacheck-process-line" />
          <div className="ideacheck-process-step"><b>02</b><div><strong>SIMILARITY</strong><span>Calculates the strongest project similarity and identifies the matching reference.</span></div></div>
          <div className="ideacheck-process-line" />
          <div className="ideacheck-process-step"><b>03</b><div><strong>GEMINI AI</strong><span>Explains what is similar, what is different and how you can improve the idea.</span></div></div>
        </div>
      </div>

      {busy && <Loader label="IdeaCheck AI is analyzing your idea..." />}

      {data && !busy && sim && ev && ai && (
        <div className="ideacheck-results">
          <div className="ideacheck-result-header">
            <div><span className="student-feature-label">02 / ANALYSIS COMPLETE</span><h2>YOUR IDEA REPORT.</h2></div>
            <div className={`ideacheck-verdict-pill ${String(ai.ai_verdict || "").toLowerCase()}`}>{hasAi ? ai.ai_verdict : sim.status}</div>
          </div>
          <div className="ideacheck-score-grid">
            <div className="ideacheck-score-card main"><span>SIMILARITY</span><strong>{score}%</strong><small>{sim.status === "SIMILAR_FOUND" ? "Similar project found" : "No similar project found"}</small></div>
            <div className="ideacheck-score-card"><span>AI CONFIDENCE</span><strong>{hasAi ? `${conf}%` : "—"}</strong><small>{hasAi ? pick(ai.model_name, "Gemini") : "AI temporarily unavailable"}</small></div>
            <div className="ideacheck-score-card"><span>IDEA SCORE</span><strong>{pick(ev.overall, "—")}</strong><small>{pick(ev.verdict, "Evaluation")}</small></div>
          </div>
          {match && (
            <div className="ideacheck-match-card">
              <div><span className="student-feature-label">REFERENCE MATCH</span><h3>{pick(match.title, "Matched project")}</h3><p>{pick(match.description, "No project description available.")}</p></div>
              <div><span>CATEGORY</span><strong>{pick(match.category, "—")}</strong><span>TECHNOLOGY</span><strong>{pick(match.technology, "—")}</strong></div>
            </div>
          )}
          {hasAi ? (
            <>
              <div className="ideacheck-ai-summary"><span className="student-feature-label">GEMINI EXPLANATION</span><h3>{pick(ai.summary)}</h3><p>{pick(ai.similarity_explanation)}</p></div>
              <div className="ideacheck-ai-grid">
                <div className="ideacheck-ai-card"><span>WHAT MAKES IT DIFFERENT</span>{ai.unique_points.map((p, i) => <div key={i}><b>+</b><p>{p}</p></div>)}</div>
                <div className="ideacheck-ai-card"><span>AI FEATURE SUGGESTIONS</span>{ai.feature_suggestions.map((p, i) => <div key={i}><b>✦</b><p>{p}</p></div>)}</div>
                <div className="ideacheck-ai-card"><span>HOW TO IMPROVE</span>{ai.improvement_suggestions.map((p, i) => <div key={i}><b>↗</b><p>{p}</p></div>)}</div>
                <div className="ideacheck-ai-card"><span>DIFFERENTIATION STRATEGY</span><p>{pick(ai.differentiation_strategy)}</p></div>
              </div>
            </>
          ) : (
            <div className="ideacheck-ai-unavailable"><strong>AI EXPLANATION TEMPORARILY UNAVAILABLE</strong><span>The dataset similarity result is still available. Try again in a moment.</span></div>
          )}
          <div className="ideacheck-evaluation-card">
            <div><span className="student-feature-label">LOCAL IDEA EVALUATION</span><strong>{pick(ev.verdict, "—")}</strong></div>
            <div className="ideacheck-mini-scores"><span>TECH {ev.technology}</span><span>USAGE {ev.usage}</span><span>INNOVATION {ev.innovation}</span><span>PRACTICALITY {ev.practicality}</span><span>FEASIBILITY {ev.feasibility}</span></div>
          </div>
          <p className="ideacheck-disclaimer">{pick(data.disclaimer)}</p>
        </div>
      )}

      {!data && !busy && (
        <div className="ideacheck-empty">
          <div className="ideacheck-empty-icon">✦</div>
          <strong>YOUR IDEA REPORT WILL APPEAR HERE</strong>
          <span>Enter an idea above to run the CampusCode dataset check and Gemini AI analysis.</span>
        </div>
      )}
    </section>
  );
}
