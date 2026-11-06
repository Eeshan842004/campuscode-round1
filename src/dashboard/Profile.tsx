// PROFILE tab: the read-only grid, and an edit form (name, bio, skills with suggestions).
// Saved changes are kept in this browser only, since there is no backend.
import { useState } from "react";
import { STUDENT } from "./mock";
import { Loader, PageHeading, pick } from "./parts";
import { useMock } from "./store";

const KEY = "cc_profile";
interface Form { name: string; bio: string; skills: string }

const SUGGESTIONS = ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "Express.js", "Python", "FastAPI", "Java", "C", "C++", "Kotlin", "Flutter", "SQL", "PostgreSQL", "MongoDB", "Git", "GitHub", "Tailwind CSS", "AWS", "Docker", "Machine Learning", "Data Analysis"];

function load(): Form {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { name: STUDENT.name, bio: "", skills: "", ...(JSON.parse(raw) as Partial<Form>) };
  } catch { /* storage blocked: start from the defaults */ }
  return { name: STUDENT.name, bio: "", skills: "" };
}

export default function Profile() {
  const data = useMock(load, 280);
  const [saved, setSaved] = useState<Form | null>(null);
  const [form, setForm] = useState<Form>({ name: "", bio: "", skills: "" });
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  if (!data) return <Loader />;
  const p = saved ?? data;

  const last = form.skills.split(",").pop()!.trim().toLowerCase();
  const suggestions = SUGGESTIONS.filter((s) => last && s.toLowerCase().startsWith(last) && !form.skills.toLowerCase().includes(s.toLowerCase())).slice(0, 6);
  const addSkill = (s: string) => {
    const parts = form.skills.split(",").map((x) => x.trim()).filter(Boolean);
    const tail = parts[parts.length - 1];
    if (tail && tail.toLowerCase() !== s.toLowerCase()) parts[parts.length - 1] = s;
    else if (!parts.some((x) => x.toLowerCase() === s.toLowerCase())) parts.push(s);
    setForm((f) => ({ ...f, skills: `${parts.join(", ")}, ` }));
  };
  const edit = () => { setForm(p); setEditing(true); setMessage(""); setError(""); };
  const save = () => {
    if (!form.name.trim()) { setError("Name cannot be empty."); return; }
    setBusy(true); setError("");
    window.setTimeout(() => {
      const next: Form = { name: form.name.trim(), bio: form.bio.trim(), skills: form.skills.split(",").map((x) => x.trim()).filter(Boolean).join(", ") };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      setSaved(next); setEditing(false); setBusy(false); setMessage("Profile updated successfully");
    }, 500);
  };

  const fields: [string, string | undefined][] = [["NAME", p.name], ["EMAIL", STUDENT.email], ["ROLE", STUDENT.role], ["CAMPUSCODE ID", STUDENT.campusId], ["BIO", p.bio], ["SKILLS", p.skills]];
  return (
    <section>
      <PageHeading eyebrow="ACCOUNT / BACKEND PROFILE" title="YOUR PROFILE." text="Edit your student profile and save the changes directly to the CampusCode backend." />
      {editing ? (
        <div className="profile-edit-shell">
          <div className="profile-edit-grid">
            <div className="profile-edit-field"><label>NAME</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" /></div>
            <div className="profile-edit-field"><label>EMAIL · READ ONLY</label><input value={STUDENT.email} disabled /></div>
            <div className="profile-edit-field full"><label>BIO</label><textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Tell the CampusCode community about yourself" /></div>
            <div className="profile-edit-field full profile-skills-field">
              <label>SKILLS · COMMA SEPARATED</label>
              <input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js, Python" autoComplete="off" />
              {suggestions.length > 0 && <div className="profile-skill-suggestions">{suggestions.map((s) => <button type="button" key={s} onClick={() => addSkill(s)}>{s}</button>)}</div>}
            </div>
          </div>
          {error && <div className="profile-message error">{error}</div>}
          {message && <div className="profile-message">{message}</div>}
          <div className="profile-edit-actions">
            <button className="profile-save-btn" onClick={save} disabled={busy}>{busy ? "SAVING..." : "SAVE CHANGES ↗"}</button>
            <button className="profile-cancel-btn" onClick={() => { setEditing(false); setError(""); }}>CANCEL</button>
          </div>
        </div>
      ) : (
        <>
          <div className="profile-grid">{fields.map(([label, value]) => <div className="profile-field" key={label}><span>{label}</span><strong>{pick(value)}</strong></div>)}</div>
          <div className="profile-edit-actions"><button className="profile-edit-btn" onClick={edit}>EDIT PROFILE ↗</button></div>
        </>
      )}
      {message && !editing && <div className="profile-message">{message}</div>}
    </section>
  );
}
