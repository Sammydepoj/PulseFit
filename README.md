# PulseFit

A small-group strength studio site. React front end, Express + Postgres back
end, deployed separately.

```
client/   Vite + React + Tailwind        -> deploy to Vercel
server/   Express + Better Auth + pg     -> deploy to Railway
```

## Run it locally

You need Node 20+ and a Postgres database (local, or a free one from Neon).

```
# 1. server
cd server
cp .env.example .env        # fill in DATABASE_URL and BETTER_AUTH_SECRET
npm install
npm run migrate             # creates the tables
npm run seed                # loads coaches, classes and plans
npm run dev                 # http://localhost:4000

# 2. client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173, /api is proxied to :4000
```

`.env` is in `.gitignore` and must never be committed. Only `.env.example`
(no real values) is tracked. Generate a secret with `openssl rand -base64 32`.

## The database in plain English

- **coaches**: the four coaches, each with a bio, a quote and a photo path.
- **classes**: the weekly timetable. One row per slot (day + morning/evening),
  each taught by exactly one coach (`coach_id`) at an intensity level.
- **plans**: the membership tiers. Price is stored in cents; `perks` is a list.
- **user / account / session / verification**: created by Better Auth. A
  `user` is a person, `account` holds their hashed password, `session` is one
  signed-in browser.
- **saved_classes**: which user saved which class. Many users can save many
  classes, so it is a join table keyed on `(user_id, class_id)`. Deleting a
  user or a class removes its saved rows.

The full schema is `server/src/schema.sql`.

## API

| Route | Auth | Returns |
| --- | --- | --- |
| `GET /api/health` | no | `{ ok: true }` (checks the database) |
| `GET /api/classes` | no | the weekly schedule |
| `GET /api/coaches` | no | coaches |
| `GET /api/plans` | no | membership plans |
| `POST /api/auth/sign-up/email`, `sign-in/email`, `sign-out`, `GET get-session` | n/a | handled by Better Auth |
| `GET /api/saved` | yes | ids of the user's saved classes |
| `POST /api/saved` `{ classIds }` | yes | merge several saves |
| `PUT /api/saved/:classId`, `DELETE /api/saved/:classId` | yes | save / unsave one |

Signed-out visitors can still save classes; they live in `localStorage` and
are merged into the account when the visitor signs in.

## Deploy

The browser only ever talks to the Vercel domain. Vercel forwards `/api/*` to
Railway (`client/vercel.json`), so the session cookie is first-party and works
in Safari and with third-party cookies blocked.

1. **Database (Neon).** Create a project and copy the connection string.
2. **Server (Railway).** New project from this repo, set the root directory to
   `server`. Variables:
   - `DATABASE_URL`: the Neon string
   - `BETTER_AUTH_SECRET`: `openssl rand -base64 32`
   - `BETTER_AUTH_URL`: the Railway public URL, e.g. `https://pulsefit.up.railway.app`
   - `CLIENT_URL`: the Vercel URL (set after step 3)

   Railway runs `npm run migrate && npm start` (see `server/railway.json`).
   Seed once from your machine with the Neon string:
   `DATABASE_URL="..." npm run seed` (inside `server/`).
3. **Client (Vercel).** Import the repo, set the root directory to `client`.
   In `client/vercel.json`, replace `YOUR-RAILWAY-APP.up.railway.app` with your
   Railway domain and redeploy.
4. Set `CLIENT_URL` on Railway to the Vercel URL and redeploy the server.
   Better Auth rejects sign-ins from origins that aren't listed there.

Check: open the Vercel URL, sign up, refresh (you should stay signed in), and
open `<vercel-url>/api/classes` to see JSON.
