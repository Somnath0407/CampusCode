# CampusCode

A full-stack coding-practice platform in the spirit of LeetCode: browse problems, write solutions in an in-browser Monaco editor, and get judged live against real test cases via Judge0. Includes a public landing page, a user dashboard for solving problems, and a separate admin dashboard for managing the problem set.

## Features

- **Landing page** for logged-out visitors — hero, live problem-count stats, feature highlights, and a problem-set preview
- User registration, login, and logout with JWT-based auth (HTTP-only cookie)
- Role-based access control (`user` / `admin`), each with its own dashboard after login
- Logout token blocklisting via Redis (Upstash)
- Users can **Run** code against visible test cases, or **Submit** to run against all (visible + hidden) test cases; accepted submissions mark the problem solved and are recorded in submission history
- Admins create/update/delete problems; reference solutions are auto-verified against test cases through Judge0 before a problem can be saved
- Admin dashboard shows color-coded stats (total / easy / medium / hard) and lets admins provision further admin/user accounts

## Tech Stack

| Layer          | Technology                                          |
|----------------|------------------------------------------------------|
| Backend        | Node.js, Express 5                                    |
| Database       | MongoDB + Mongoose                                     |
| Cache/Blocklist| Redis (Upstash)                                        |
| Auth           | JWT (`jsonwebtoken`) + `bcrypt`                        |
| Code execution | Judge0 CE via RapidAPI                                 |
| Frontend       | React (Vite), React Router, Redux Toolkit               |
| Styling        | Tailwind CSS + daisyUI (dark, LeetCode-inspired theme)  |
| Code editor    | Monaco Editor (`@monaco-editor/react`)                  |
| Icons          | lucide-react                                            |

## Project Structure

```
backend/
└── src/
    ├── config/
    │   ├── db.js                  # MongoDB connection
    │   └── redis.js               # Redis client (reads REDIS_URL)
    ├── controllers/
    │   ├── userAuthent.js         # register / login / logout / adminRegister / getProfile
    │   ├── userProblem.js         # problem CRUD + listing + public stats
    │   └── userSubmission.js      # run / submit code via Judge0, submission history
    ├── middleware/
    │   ├── userMiddleWare.js      # verifies JWT, checks Redis blocklist
    │   └── adminMiddleware.js     # same, plus requires role === "admin"
    ├── models/
    │   ├── user.js
    │   ├── problem.js
    │   └── submission.js
    ├── routes/
    │   ├── userAuth.js            # /user routes
    │   ├── problemCreator.js      # /problem routes
    │   └── submit.js              # /submission routes
    └── index.js                    # app entry point

frontend/
└── src/
    ├── api/axiosClient.js          # axios instance (cookies included)
    ├── store/                      # Redux Toolkit auth slice
    ├── components/
    │   ├── Logo.jsx                 # CampusCode mark (graduation cap + code chevron)
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx / AdminRoute.jsx
    │   ├── ProblemForm.jsx          # shared create/update problem form
    │   └── DifficultyBadge.jsx
    └── pages/
        ├── Landing.jsx              # public marketing page ("/")
        ├── Login.jsx / Signup.jsx
        ├── UserDashboard.jsx        # problem list + solved progress ("/problems")
        ├── ProblemSolve.jsx         # description + Monaco editor + run/submit
        ├── AdminDashboard.jsx       # colorful stats + problem list ("/admin")
        ├── AdminCreateProblem.jsx / AdminUpdateProblem.jsx
        └── AdminCreateAdmin.jsx
```

## Prerequisites

- Node.js
- A MongoDB connection string (e.g. MongoDB Atlas)
- An Upstash Redis database (free tier) — see below
- A Judge0 CE API key from RapidAPI

## Setup

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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` (or the next free port — the backend's CORS accepts any `localhost:<port>` origin, so this just works) and talks to the backend via `VITE_API_BASE_URL` (see `frontend/.env`, defaults to `http://localhost:3000`).

The first admin account must be created directly in MongoDB (or promoted by setting `role: "admin"` on an existing user), since `/user/admin/register` itself requires an existing admin token. After that, admins can create further admin/user accounts from the "+ New Admin" button on the admin dashboard.

## API Reference

### Auth — `/user`

| Method | Route                   | Access        | Description                          |
|--------|-------------------------|---------------|----------------------------------------|
| POST   | `/user/register`        | Public        | Register a new user                    |
| POST   | `/user/login`           | Public        | Log in, receive a JWT cookie           |
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

## Security Notes

- `.env` files in both `backend/` and `frontend/` are covered by `.gitignore` — never commit them. If credentials were ever committed in this repo's history, rotate them (MongoDB, Redis, JWT secret, Judge0 key).
- `/problem/stats` is the only intentionally public data endpoint — it exposes counts only, never problem content.
