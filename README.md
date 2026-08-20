<p align="center">
  <img src="frontend/public/favicon.svg" alt="CampusCode Icon" width="96" height="96" style="border-radius: 20px;" />
</p>

<h1 align="center">CampusCode</h1>

<p align="center">
  A full-stack coding-practice platform in the spirit of LeetCode — browse a curated DSA bank, write solutions in an in-browser Monaco editor, and get judged live against real test cases via Judge0. A public landing page, a user dashboard for solving problems, and a separate admin dashboard for managing the problem set.
</p>

---

## What it does

- **Live Judged Code Execution** - Every **Run** (visible test cases) and **Submit** (visible + hidden) is compiled and executed for real via Judge0 CE, not simulated.
- **50-Problem DSA Bank** - Two pointers, sliding window, fast/slow pointers, Kadane's, prefix sums, and merge intervals, each with verified starter code and reference solutions in **JavaScript, C++, and Java**.
- **Role-Based Dashboards** - JWT-authenticated `user` and `admin` roles each land on their own dashboard; admins create/update/delete problems and provision further admin/user accounts.
- **Auto-Verified Problems** - A problem's reference solution is run against its own test cases through Judge0 before it can be saved, so broken problems never go live.
- **Per-Tab Sessions** - Auth tokens live in `sessionStorage` (not cookies or `localStorage`), so a user and an admin can be signed in simultaneously in two tabs of the same browser without one session overwriting the other.
- **Light/Dark Theme Toggle** - Persisted per browser with no flash of the wrong theme on load, plus a scrolling logo marquee and live problem-count stats on the landing page.

---

## Tech Stack

| Category | Technology |
|---|---|
| Backend | [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org) [![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com) |
| Database & Cache | [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com) [![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com) [![Redis](https://img.shields.io/badge/Redis_(Upstash)-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com) |
| Auth & Security | [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io) [![bcrypt](https://img.shields.io/badge/bcrypt-338033?style=for-the-badge)](https://www.npmjs.com/package/bcrypt) |
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
```

**Getting `REDIS_URL` from Upstash:**
1. Go to [console.upstash.com](https://console.upstash.com) and sign in.
2. Create a new Redis database (free tier).
3. Open the **Connect** tab → **TCP** → reveal and copy the `rediss://default:...` connection string.
4. Paste it into `.env` as `REDIS_URL`.

Run the server:

```bash
npm start          # or: npm run dev (auto-restarts on file changes)
```

The API starts on `http://localhost:<PORT>` once it connects to MongoDB and Redis.

**Loading the DSA problem bank** (optional, once an admin account exists):

```bash
node scripts/seedDsaProblems.js          # loads the 50 problems with JS starter code
node scripts/addCppJavaStarterCode.js    # adds C++ and Java starter code to them
```

Both scripts are idempotent — safe to re-run, they skip anything already present.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the next free port — the backend's CORS accepts any `localhost:<port>` origin, so this just works). The app talks to the backend via `VITE_API_BASE_URL` (see `frontend/.env`, defaults to `http://localhost:3000`).

The first admin account must be created directly in MongoDB (or promoted by setting `role: "admin"` on an existing user), since `/user/admin/register` itself requires an existing admin token. After that, admins can create further admin/user accounts from the "+ New Admin" button on the admin dashboard.

---

## Project Structure

```
CampusCode/
├── backend/
│   ├── scripts/
│   │   ├── dsa-50-problems.json        # 50-problem DSA bank (JS solutions, verified test cases)
│   │   ├── seedDsaProblems.js          # loads the bank into MongoDB
│   │   ├── cpp-java-starter-code.json  # C++/Java starter code for the bank
│   │   └── addCppJavaStarterCode.js    # applies it to the seeded problems
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

All authenticated routes expect `Authorization: Bearer <token>`, set by the frontend from the token returned by `/user/register` or `/user/login`.

---

## Security Notes

- `.env` files in both `backend/` and `frontend/` are covered by `.gitignore` — never commit them. If credentials were ever committed in this repo's history, rotate them (MongoDB, Redis, JWT secret, Judge0 key).
- `/problem/stats` is the only intentionally public data endpoint — it exposes counts only, never problem content.
- JWTs are held in `sessionStorage`, never `localStorage` or a non-`HttpOnly` cookie, to limit exposure and keep sessions tab-scoped; logout blocklists the token in Redis for the remainder of its lifetime.

---

## Customization

- Add or edit problems via the admin dashboard, or seed more directly through [backend/scripts/dsa-50-problems.json](backend/scripts/dsa-50-problems.json)
- Theme tokens, fonts, and the `leetcode-dark` / `leetcode-light` daisyUI themes live in [frontend/src/index.css](frontend/src/index.css)
- Landing page copy and feature cards live in [frontend/src/pages/Landing.jsx](frontend/src/pages/Landing.jsx)

---

<p align="center">
  <em>CampusCode - practice, get judged, and track real progress.</em>
</p>
