// A tiny stand-in for the portal's backend: which events the student joined (kept in this browser only),
// plus a hook that "loads" mock data after a short pause so the loader shows, like the live portal.
import { useEffect, useState } from "react";
import { EVENTS, JOINED_AT_START, REGISTRATIONS, STUDENT, type EventItem, type Registration } from "./mock";

const KEY = "cc_joined";

function readJoined(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* storage blocked: fall back to the starting list */ }
  return [...JOINED_AT_START];
}

export const getJoined = (): Set<string> => new Set(readJoined());

export function joinEvent(id: string) {
  const ids = readJoined();
  if (!ids.includes(id)) ids.push(id);
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

/** The student's registrations, one per joined event, in the order they joined. */
export function myRegistrations(): (Registration & { event: EventItem })[] {
  return readJoined().flatMap((id) => {
    const event = EVENTS.find((e) => e.id === id);
    if (!event) return [];
    const known = REGISTRATIONS.find((r) => r.hackathon_id === id);
    const reg: Registration = known ?? { registration_id: `${id.slice(0, 8)}-0000-4000-8000-${id.slice(-12)}`, hackathon_id: id, status: "REGISTERED", team_name: event.event_type === "quiz" ? "" : STUDENT.team };
    return [{ ...reg, event }];
  });
}

/** Runs `make` after a short delay and returns its result (null while "loading"). */
export function useMock<T>(make: () => T, ms = 320): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setData(make()), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data;
}
