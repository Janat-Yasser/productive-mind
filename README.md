# 🌀 Productive Mind

A full-stack productivity and task management application built with **Node.js, Express, MongoDB, and EJS**, following the **MVC architecture**.

![Productive Mind](https://via.placeholder.com/800x400/0d0d0d/f5c800?text=Productive+Mind)

---

## ✨ Features

- **Authentication** — Signup, signin, sessions via Passport.js + bcrypt
- **Today View** — Daily tasks grouped by priority with progress tracking
- **Upcoming View** — Tasks grouped by due date over the next 7 days
- **Utility Hub** — Kanban board with filters (status, priority, category, search)
- **Calendar** — Month, Week, and Day views with tasks overlaid
- **Task Management** — Create, edit, delete, toggle status via AJAX
- **Recurring Tasks** — Daily / weekly / monthly repeating tasks
- **Tags & Categories** — Personal, Work, Health, Learning, Finance, Other
- **Responsive** — Works on desktop, tablet, and mobile

---

## 🗂 Project Structure

```
productive-mind/
├── config/
│   ├── db.js              # MongoDB connection
│   └── passport.js        # Passport local strategy
├── controllers/
│   ├── taskController.js  # Task CRUD logic
│   └── calendarController.js
├── middleware/
│   └── auth.js            # ensureAuth / ensureGuest
├── models/
│   ├── User.js            # Mongoose User schema
│   └── Task.js            # Mongoose Task schema
├── public/
│   ├── css/style.css      # All styles
│   └── js/app.js          # Frontend JS
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── tasks.js
│   └── calendar.js
├── views/
│   ├── layouts/           # main, auth, landing layouts
│   ├── auth/              # signin, signup
│   ├── tasks/             # today, upcoming, utility, form
│   ├── calendar/          # month, week, day
│   └── index.ejs          # Landing page
├── .env                   # Environment variables (do not commit)
├── server.js              # App entry point
├── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd productive-mind
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/productive-mind
SESSION_SECRET=your-very-long-random-secret-here
NODE_ENV=development
```

### 3. Run

```bash
npm start
# or for development with auto-reload:
npx nodemon server.js
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Deployment

Runs the app + MongoDB together with one command:

```bash
docker-compose up --build
```

App available at [http://localhost:3000](http://localhost:3000)

To stop:
```bash
docker-compose down
```

---

## ☁️ Deploy to Railway / Render / Fly.io

### Railway
1. Push code to GitHub
2. Create new project on [railway.app](https://railway.app)
3. Add a MongoDB plugin
4. Set environment variables:
   - `MONGODB_URI` → from Railway MongoDB plugin
   - `SESSION_SECRET` → any long random string
   - `NODE_ENV=production`

### Render
1. Push to GitHub
2. Create Web Service → connect repo
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add a MongoDB Atlas connection string as `MONGODB_URI`

### Fly.io
```bash
fly launch
fly secrets set SESSION_SECRET=your-secret MONGODB_URI=your-atlas-uri
fly deploy
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/productive-mind` |
| `SESSION_SECRET` | Express session secret (keep private!) | — |
| `NODE_ENV` | `development` or `production` | `development` |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | Passport.js (Local Strategy) + bcryptjs |
| Sessions | express-session + connect-mongo |
| Views | EJS + express-ejs-layouts |
| Validation | express-validator |
| Styling | Custom CSS (Syne + DM Sans) |
| Dev | nodemon |

---

## 📋 API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/` | Landing page |
| GET | `/auth/signin` | Sign in form |
| POST | `/auth/signin` | Authenticate |
| GET | `/auth/signup` | Sign up form |
| POST | `/auth/signup` | Create account |
| POST | `/auth/logout` | Sign out |
| GET | `/tasks` | Today view |
| GET | `/tasks/upcoming` | Upcoming tasks |
| GET | `/tasks/utility` | Utility Hub (Kanban) |
| GET | `/tasks/add` | New task form |
| POST | `/tasks/add` | Create task |
| GET | `/tasks/:id/edit` | Edit task form |
| PUT | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id/status` | Toggle status (AJAX) |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/calendar` | Month calendar |
| GET | `/calendar/week` | Week calendar |
| GET | `/calendar/day` | Day calendar |

---

## 🧠 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + N` | Add new task |
| `Ctrl/Cmd + K` | Focus search |
| `Escape` | Blur focused element |

---

## License

MIT — free to use and modify.
