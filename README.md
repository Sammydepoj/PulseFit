# PulseFit

A small-group strength studio site. React front end, Express + Postgres back
end, deployed separately.

```
client/   Vite + React + Tailwind        -> deploy to Vercel
server/   Express + pg (hand-written auth) -> deploy to Render
```

## Run it locally

You need Node 20+ and a Postgres database (local, or a free one from Neon).

```
# 1. server
cd server
cp .env.example .env        # fill in DATABASE_URL
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
(no real values) is tracked.

## The database in plain English

- **coaches**: the four coaches, each with a bio, a quote and a photo path.
- **classes**: the weekly timetable. One row per slot (day + morning/evening),
  each taught by exactly one coach (`coach_id`) at an intensity level.
- **plans**: the membership tiers. Price is stored in cents; `perks` is a list.
- **users**: one row per person. The password is stored as a salted scrypt
  hash, never as text. Email is unique and always lower-case.
- **sessions**: one row per signed-in browser. The cookie holds a random token;
  only its SHA-256 hash is stored, so a leaked database can't be used to sign in.
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
| `POST /api/auth/signup` `{ name, email, password }` | no | creates the account and signs in |
| `POST /api/auth/login` `{ email, password }` | no | signs in |
| `POST /api/auth/logout` | no | ends the session |
| `GET /api/auth/me` | no | `{ user }`, or `{ user: null }` when signed out |
| `GET /api/saved` | yes | ids of the user's saved classes |
| `POST /api/saved` `{ classIds }` | yes | merge several saves |
| `PUT /api/saved/:classId`, `DELETE /api/saved/:classId` | yes | save / unsave one |

## How sign-in works

1. Signup/login checks the input, then hashes (or verifies) the password with
   Node's built-in `crypto.scrypt` (`server/src/password.js`).
2. The server creates a random token, stores its hash in `sessions`, and sends
   the token in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` on https). The
   page's JavaScript can't read it.
3. Each request, `loadUser` (`server/src/session.js`) looks the cookie up and
   attaches the user. `requireUser` returns 401 on routes that need one.
4. Logging out deletes the session row. Sessions last 7 days.

Protections: wrong email and wrong password give the same error and take the
same time; password length is capped (8 to 128); POSTs from other origins are
refused; 10 failed logins per email in 15 minutes locks that email out briefly
(in memory, so it resets when the server restarts).

Signed-out visitors can still save classes; they live in `localStorage` and
are merged into the account when the visitor signs in.

## Deploy

The browser only ever talks to the Vercel domain. Vercel forwards `/api/*` to
Render (`client/vercel.json`), so the session cookie is first-party and works
in Safari and with third-party cookies blocked.

1. **Database (Neon).** Create a project and copy the connection string.
2. **Server (Render).** New -> Blueprint and pick this repo (it reads
   `render.yaml`), or New -> Web Service with root directory `server`, build
   command `npm install`, start command `npm run migrate && npm start` and
   health check path `/api/health`. Environment variables:
   - `DATABASE_URL`: the Neon string
   - `CLIENT_URL`: the Vercel URL (set after step 3)

   Render provides `PORT` itself. Seed once from your machine with the Neon
   string: `DATABASE_URL="..." npm run seed` (inside `server/`).
   On the free plan Render puts the service to sleep after about 15 minutes
   without traffic, so the first request after a pause can take up to a
   minute. A paid instance stays awake.
3. **Client (Vercel).** Import the repo, set the root directory to `client`.
   In `client/vercel.json`, replace `YOUR-RENDER-SERVICE.onrender.com` with your
   Render domain (shown at the top of the service page) and redeploy.
4. Set `CLIENT_URL` on Render to the Vercel URL (saving redeploys the server).
   The server refuses POSTs from any other origin, and uses the `https` in this
   URL to mark the session cookie `Secure`.

Check: open the Vercel URL, sign up, refresh (you should stay signed in), and
open `<vercel-url>/api/classes` to see JSON.
