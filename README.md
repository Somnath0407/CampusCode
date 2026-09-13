<p align="center">
  <img src=".github/logo.svg" alt="CampusCode Logo" width="96" height="96" style="border-radius: 20px;" />
</p>

<h1 align="center">CampusCode</h1>

<p align="center">
  A full-stack coding-practice platform in the spirit of LeetCode — browse a curated DSA bank, write solutions in an in-browser Monaco editor, and get judged live against real test cases via Judge0. A public landing page, a user dashboard for solving problems, and a separate admin dashboard for managing the problem set.
</p>

---

## What it does

- **Live Judged Code Execution** - Every **Run** (visible test cases) and **Submit** (visible + hidden) is compiled and executed for real via Judge0 CE, not simulated.
- **83-Problem Bank** - 51 DSA problems (two pointers, sliding window, fast/slow pointers, Kadane's, prefix sums, merge intervals, and more) with verified starter code and reference solutions in **JavaScript, C++, and Java**, plus 32 **SQL** problems verified against Judge0's live SQLite engine.
- **Role-Based Dashboards** - JWT-authenticated `user` and `admin` roles each land on their own dashboard; admins create/update/delete problems and provision further admin/user accounts.
- **Google Sign-In** - Sign up or log in with a Google account via Google Identity Services; the backend verifies the ID token and issues the same JWT as password-based login, so both flows share one session model.
- **Auto-Verified Problems** - A problem's reference solution is run against its own test cases through Judge0 before it can be saved, so broken problems never go live.
- **Per-Tab Sessions** - Auth tokens live in `sessionStorage` (not cookies or `localStorage`), so a user and an admin can be signed in simultaneously in two tabs of the same browser without one session overwriting the other.
- **Ask AI & Focus Timer** - A floating "Ask AI" button hands your code, the problem, and the latest error to ChatGPT in one click; an optional Stopwatch/Timer widget (20/40/60 minutes by difficulty) supports timed practice.
- **Light/Dark Theme Toggle** - Persisted per browser with no flash of the wrong theme on load, plus a scrolling logo marquee and live problem-count stats on the landing page.

---

## Tech Stack

| Category | Technology |
|---|---|
| Backend | [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org) [![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com) |
| Database & Cache | [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com) [![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com) [![Redis](https://img.shields.io/badge/Redis_(Upstash)-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com) |
| Auth & Security | [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io) [![bcrypt](https://img.shields.io/badge/bcrypt-338033?style=for-the-badge)](https://www.npmjs.com/package/bcrypt) [![Google Sign-In](https://img.shields.io/badge/Google_Sign--In-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity/gsi/web) |
| Code Execution | [![Judge0](https://img.shields.io/badge/Judge0_CE-4B32C3?style=for-the-badge)](https://judge0.com) |
| Frontend | [![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev) [![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com) [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org) |
| Styling & Editor | [![TailwindCSS](https://img.shields.io/badge/TailwindCSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![daisyUI](https://img.shields.io/badge/daisyUI-1AD1A5?style=for-the-badge&logoColor=white)](https://daisyui.com) [![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor) [![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F55036?style=for-the-badge&logoColor=white)](https://lucide.dev) |

Headings render in **Sora**, body text in **Inter**, and code in **JetBrains Mono**.

---

## Getting Started

### Prerequisites

- Node.js
- A MongoDB connection string (e.g. MongoDB Atlas)
- An Upstash Redis database (free tier) — see below
- A Judge0 CE API key from RapidAPI

### Clone

```bash
git clone https://github.com/Somnath0407/CampusCode.git
cd CampusCode
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
DB_CONNECTION_STRING=<your MongoDB connection string>
JWT_SECRET=<a random secret used to sign JWTs>
REDIS_URL=<your Upstash Redis connection string>
JUDGE0_API_KEY=<your Judge0 RapidAPI key>
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=<OAuth Client ID from Google Cloud Console, see below>
```

**Getting `REDIS_URL` from Upstash:**
1. Go to [console.upstash.com](https://console.upstash.com) and sign in.
2. Create a new Redis database (free tier).
3. Open the **Connect** tab → **TCP** → reveal and copy the `rediss://default:...` connection string.
4. Paste it into `.env` as `REDIS_URL`.

**Getting `GOOGLE_CLIENT_ID` from Google Cloud Console** (needed for "Sign in with Google"):
1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) and select or create a project.
2. If prompted, configure the OAuth consent screen first: **External** user type, fill in the app name and support/contact email, then under **Audience** add your own Google account as a **test user** (required while the app is unpublished).
3. Back on **Credentials** → **+ Create Credentials** → **OAuth client ID** → Application type **Web application**.
4. Under **Authorized JavaScript origins**, add `http://localhost:5173` (no redirect URI is needed — this flow verifies an ID token, not an auth-code redirect).
5. Copy the generated Client ID (ends in `.apps.googleusercontent.com`) into **both** `backend/.env` as `GOOGLE_CLIENT_ID` and `frontend/.env` as `VITE_GOOGLE_CLIENT_ID` — it's the same value in both places, and it's fine that it's plainly visible in frontend code: an OAuth Client ID is meant to be public.

Run the server:

```bash
npm start          # or: npm run dev (auto-restarts on file changes)
```

The API starts on `http://localhost:<PORT>` once it connects to MongoDB and Redis.

**Loading the problem bank** (optional, once an admin account exists):

```bash
node scripts/seedDsaProblems.js          # loads 51 DSA problems with JS starter code
node scripts/addCppJavaStarterCode.js    # adds C++ and Java starter code to them
node scripts/seedSqlProblems.js          # loads 32 SQL problems
```

All three scripts are idempotent — safe to re-run, they skip anything already present.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=<same OAuth Client ID as backend's GOOGLE_CLIENT_ID>
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the next free port — the backend's CORS accepts any `localhost:<port>` origin, so this just works).

The first admin account must be created directly in MongoDB (or promoted by setting `role: "admin"` on an existing user), since `/user/admin/register` itself requires an existing admin token. After that, admins can create further admin/user accounts from the "+ New Admin" button on the admin dashboard.

---

## Project Structure

```
CampusCode/
├── backend/
│   ├── scripts/
│   │   ├── dsa-50-problems.json        # 51-problem DSA bank (JS solutions, verified test cases)
│   │   ├── seedDsaProblems.js          # loads the DSA bank into MongoDB
│   │   ├── cpp-java-starter-code.json  # C++/Java starter code for the DSA bank
│   │   ├── addCppJavaStarterCode.js    # applies it to the seeded DSA problems
│   │   ├── sql-problems.json           # 32-problem SQL bank, verified against Judge0's SQLite engine
│   │   └── seedSqlProblems.js          # loads the SQL bank into MongoDB
│   └── src/
│       ├── config/
│       │   ├── db.js                    # MongoDB connection
│       │   └── redis.js                 # Redis client (reads REDIS_URL)
│       ├── controllers/
│       │   ├── userAuthent.js           # register / login / logout / adminRegister / getProfile
│       │   ├── userProblem.js           # problem CRUD + listing + public stats
│       │   └── userSubmission.js        # run / submit code via Judge0, submission history
│       ├── middleware/
│       │   ├── userMiddleWare.js        # verifies the Bearer JWT, checks Redis blocklist
│       │   └── adminMiddleware.js       # same, plus requires role === "admin"
│       ├── models/
│       │   ├── user.js
│       │   ├── problem.js
│       │   └── submission.js
│       ├── routes/
│       │   ├── userAuth.js              # /user routes
│       │   ├── problemCreator.js        # /problem routes
│       │   └── submit.js                # /submission routes
│       ├── utils/
│       │   ├── auth.js                  # Authorization header → Bearer token parsing
│       │   ├── validator.js             # signup payload validation
│       │   └── problemUtillity.js       # Judge0 language mapping & polling
│       └── index.js                      # app entry point
└── frontend/
    └── src/
        ├── api/
        │   ├── axiosClient.js            # axios instance, attaches Bearer token per request
        │   └── tokenStorage.js           # sessionStorage-backed token (per-tab sessions)
        ├── store/                        # Redux Toolkit auth slice
        ├── context/ThemeContext.jsx      # light/dark theme state + persistence
        ├── components/
        │   ├── Logo.jsx                   # CampusCode mark
        │   ├── LogoMarquee.jsx            # scrolling logo strip on the landing page
        │   ├── ThemeToggle.jsx            # light/dark switch
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx / AdminRoute.jsx
        │   ├── ProblemForm.jsx            # shared create/update problem form
        │   └── DifficultyBadge.jsx
        └── pages/
            ├── Landing.jsx                # public marketing page ("/")
            ├── Login.jsx / Signup.jsx
            ├── UserDashboard.jsx          # problem list + solved progress ("/problems")
            ├── ProblemSolve.jsx           # description + Monaco editor + run/submit
            ├── AdminDashboard.jsx         # colorful stats + problem list ("/admin")
            ├── AdminCreateProblem.jsx / AdminUpdateProblem.jsx
            └── AdminCreateAdmin.jsx
```

---

## Available Scripts

**Backend** (`backend/`)
- `npm start` - Run the API with plain Node
- `npm run dev` - Run the API, auto-restarting on file changes

**Frontend** (`frontend/`)
- `npm run dev` - Start the Vite development server
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build locally
- `npm run lint` - Lint the project with oxlint

---

## API Reference

### Auth — `/user`

| Method | Route                   | Access        | Description                          |
|--------|-------------------------|---------------|----------------------------------------|
| POST   | `/user/register`        | Public        | Register a new user, returns a JWT     |
| POST   | `/user/login`           | Public        | Log in, returns a JWT                  |
| POST   | `/user/google`          | Public        | Log in or sign up with a Google ID token, returns a JWT |
| POST   | `/user/logout`          | Authenticated | Log out, blocklist current token       |
| POST   | `/user/admin/register`  | Admin only    | Register a new admin/user account      |
| GET    | `/user/profile`         | Authenticated | Get the current user's profile         |

### Problems — `/problem`

| Method | Route                          | Access        | Description                                                  |
|--------|----------------------------------|---------------|----------------------------------------------------------------|
| GET    | `/problem/stats`                 | Public        | Live problem counts (total / easy / medium / hard) for the landing page |
| POST   | `/problem/create`                | Admin only    | Create a problem (reference solutions validated via Judge0)    |
| PUT    | `/problem/update/:id`            | Admin only    | Update a problem                                               |
| DELETE | `/problem/delete/:id`            | Admin only    | Delete a problem                                               |
| GET    | `/problem/admin/:id`             | Admin only    | Fetch full problem doc (incl. hidden test cases & solutions)   |
| GET    | `/problem/problemById/:id`       | Authenticated | Fetch a problem for solving (no hidden test cases/solutions)   |
| GET    | `/problem/getAllProblem`         | Authenticated | List all problems                                              |
| GET    | `/problem/problemSolvedByUser`   | Authenticated | List problem IDs solved by the current user                    |

### Submissions — `/submission`

| Method | Route                     | Access        | Description                                                        |
|--------|-----------------------------|---------------|-----------------------------------------------------------------------|
| POST   | `/submission/run/:id`       | Authenticated | Run code against visible test cases only (not saved)                  |
| POST   | `/submission/submit/:id`    | Authenticated | Run code against all test cases; saves a `Submission`, marks solved on accept |
| GET    | `/submission/:id`           | Authenticated | List the current user's past submissions for a problem                |

All authenticated routes expect `Authorization: Bearer <token>`, set by the frontend from the token returned by `/user/register`, `/user/login`, or `/user/google`.

---

## Security Notes

- `.env` files in both `backend/` and `frontend/` are covered by `.gitignore` — never commit them. If credentials were ever committed in this repo's history, rotate them (MongoDB, Redis, JWT secret, Judge0 key). `GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID` are the exception — an OAuth Client ID is meant to be public and ships inside the frontend bundle regardless, so there's nothing to rotate if it leaks.
- `/problem/stats` is the only intentionally public data endpoint — it exposes counts only, never problem content.
- JWTs are held in `sessionStorage`, never `localStorage` or a non-`HttpOnly` cookie, to limit exposure and keep sessions tab-scoped; logout blocklists the token in Redis for the remainder of its lifetime.

---

## Customization

- Add or edit problems via the admin dashboard, or seed more directly through [backend/scripts/dsa-50-problems.json](backend/scripts/dsa-50-problems.json) (DSA) or [backend/scripts/sql-problems.json](backend/scripts/sql-problems.json) (SQL)
- Theme tokens, fonts, and the `leetcode-dark` / `leetcode-light` daisyUI themes live in [frontend/src/index.css](frontend/src/index.css)
- Landing page copy and feature cards live in [frontend/src/pages/Landing.jsx](frontend/src/pages/Landing.jsx)

---

<p align="center">
  <em>CampusCode - practice, get judged, and track real progress.</em>
</p>
