# CampusCode: Round 1 recreation

An exact recreation of the CampusCode portal for ReBuild '26, Round 1:
the **Landing page**, **Login**, **Register** (with the email-code step), and the **Student dashboard** (Events and My Events).

Frontend only. React 19, TypeScript, Vite, React Router. No other runtime packages.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build and check

```bash
npm run build      # type-checks, then builds to dist/
npm run preview    # serves the build, so you can refresh any route
```

## Deploy (Vercel)

Import the repo on Vercel. It detects Vite on its own: build command `npm run build`, output folder `dist`.
`vercel.json` sends every URL to `index.html`, so refreshing `/login`, `/register` or `/student` works.

## Pages

| URL | Page |
| --- | --- |
| `/` | Landing |
| `/login` | Login (captcha, bus animation, forgot-password steps) |
| `/register` | Register (captcha, email code) |
| `/student` | Student dashboard (opens on Overview; Events and My Events are the full pages) |

## What is mocked

- There is no backend. The student, the three events and the registration live in `src/dashboard/mock.ts`; joining an event is remembered in this browser only.
- Login and Register accept any valid input; the email code is shown on screen in a "test mode" box.

Fonts are self-hosted (Inter and DM Mono). Only small, brand-palette animations were added on top of the exact copy.
