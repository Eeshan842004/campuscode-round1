// All the dashboard's mock data lives in this one file. The live portal fetches this from its backend;
// here it is typed and fixed, so every screenshot looks the same.

// ── The student. Change the name here and it changes everywhere. ──
export const STUDENT = {
  name: "eeshan gupta",
  email: "eeshangupta10@gmail.com",
  role: "STUDENT",
  campusId: "CC-6GYCSE",
  team: "Monarch",
};

export type EventKind = "hackathon" | "quiz";
export type BannerKind = "rebuild" | "quiz";

export interface EventItem {
  id: string;
  title: string;
  event_type: EventKind;
  status: "LIVE" | "COMPLETED";
  description: string;
  category: string;          // shown above the title on the Overview "Discover" cards
  mode?: string;
  max_team_size?: number;
  start_date?: string;       // ISO date (with the +05:30 offset)
  banner: BannerKind;
  end_at?: string;
  quiz?: { questions: number; marks: number; minutes: number; negative: number };
}

// The three events, in the same order as on the portal.
export const EVENTS: EventItem[] = [
  {
    id: "e2798ce3-a1b5-4806-9147-4d9f10c52ef1",
    title: "ReBuild '26",
    event_type: "hackathon",
    status: "LIVE",
    category: "Web Development",
    description:
      "ReBuild '26 is an individual dashboard-recreation hackathon by CampusCode. You participate alone, but you must create a team name for tracking and use it on your Unstop registration, the CampusCode portal, and every submission. Round 1 (Friday, 6 Nov, morning to 10 PM): Recreate the CampusCode user flow faithfully — Dashboard, Login, Register, and Student dashboard — and submit your demo any time till 10 PM. Round 2 (Saturday, 7 Nov, top performers from Round 1 only): Build a complete new UI in CampusCode's vibe. Frontend only, mock data is fine. No presentation round. Prizes: Winner certificate + CampusCode internship with ₹15,000 stipend, runner-up certificate, and participation certificates for all. Sunday, 8 Nov (Diwali) is free. This is a paid event (₹50 on Unstop). Paid students receive an invite code — enter it when you join this event on the portal.",
    max_team_size: 1,
    start_date: "2026-11-06T09:00:00+05:30",
    banner: "rebuild",
    end_at: "2026-11-06T22:00:00+05:30",
  },
  {
    id: "20864c76-4792-4b09-a2e9-ff6764bf20d6",
    title: "FirstCommit '26 Quiz Competition 2.0",
    event_type: "quiz",
    status: "COMPLETED",
    category: "Open Innovation",
    description: "This is the reattempt quiz those who missed",
    banner: "quiz",
    quiz: { questions: 50, marks: 50, minutes: 30, negative: 0 },
  },
  {
    id: "80299fc1-3e30-466f-a146-fd45c77c84be",
    title: "FirstCommit '26 Quiz Competition",
    event_type: "quiz",
    status: "COMPLETED",
    category: "Open Innovation",
    description:
      "The quiz features 50 questions across technology, AI, and engineering — 42 multiple-choice questions and 8 true/false questions — to be completed in 30 minutes on Sunday, 1 November 2026. It is conducted online on the CampusCode platform, and every participant gets a single attempt.",
    banner: "quiz",
    quiz: { questions: 50, marks: 50, minutes: 30, negative: 0 },
  },
];

// Events the student has already joined (by event id).
export const JOINED_AT_START = ["e2798ce3-a1b5-4806-9147-4d9f10c52ef1"];

export interface Registration {
  registration_id: string;
  hackathon_id: string;
  status: string;
  team_name: string;
  // The backend does not send any of these for a registration, so "Upcoming deadlines" stays empty (like the live portal).
  start_date?: string; registration_deadline?: string; deadline?: string;
}
export const REGISTRATIONS: Registration[] = [
  { registration_id: "001bce57-16e8-4757-b26c-0f26cc061eb2", hackathon_id: "e2798ce3-a1b5-4806-9147-4d9f10c52ef1", status: "REGISTERED", team_name: STUDENT.team },
];

export interface Round { number: number; title: string; status: string; result?: string; requirement: string; end_at: string; show_timer: boolean }
const AI_NOTE = "AI usage: Not required (AI assistants may be used for help, but the final design and code must be your own work and you must be able to explain it. Ready-made dashboard templates as-is are not allowed.)";
export const ROUNDS: Record<string, Round[]> = {
  "e2798ce3-a1b5-4806-9147-4d9f10c52ef1": [
    { number: 1, title: "Round 1 - Recreate", status: "LIVE", show_timer: true, end_at: "2026-11-06T22:00:00+05:30",
      requirement: "Recreate the CampusCode user flow faithfully — Dashboard, Login, Register, and Student dashboard (4 pages). Same layout, same sections, desktop-first. Frontend only, mock data is fine. Submit your dashboard demo (live link + screenshots) any time on Friday, 6 Nov, morning till 10 PM. Individual participation — use your team name for tracking consistently. " + AI_NOTE },
    { number: 2, title: "Round 2 - New UI", status: "SCHEDULED", show_timer: true, end_at: "2026-11-07T20:31:00+05:30",
      requirement: "Build a complete new UI in CampusCode's vibe. Frontend only, mock data is fine. Only top performers shortlisted from Round 1 can participate. Judged on faithful recreation + creativity and polish, desktop-first. No presentation round. Individual participation — use your team name for tracking consistently. " + AI_NOTE },
  ],
};

// The team record the backend returns for the event (its name is not the same as the registration's team label).
export const TEAMS: Record<string, { id: string; name: string; status: string }> = {
  "e2798ce3-a1b5-4806-9147-4d9f10c52ef1": { id: "713ad00f-2af7-47f9-a146-497533715bdd", name: "sai'steam", status: "BUILDING" },
};

export const NOTIFICATIONS = [
  { id: "n1", title: "Round is Live", body: "Hello students ReBuild'26 hackthon round 1 is Live . You can submit your live demo + GitHub before 10pm toady", created_at: "2026-11-06T09:00:00+05:30" },
  { id: "n2", title: "Create your team", body: "hello guys when you join the event using invite code you need to create a team . to create team go to hackmate ai select rebuild hackthon then create your team name", created_at: "2026-11-05T18:00:00+05:30" },
];

export const STATS = { registered: 1, ongoing: 1, completed: 0, certificates: 0 };
