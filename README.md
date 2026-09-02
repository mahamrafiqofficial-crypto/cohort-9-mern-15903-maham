# Notely — MERN Notes App

A full-stack notes-taking application built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can sign up, log in, and manage rich-text notes with search, sorting, tagging, color coding, and more.

## 🌐 Live Links

- **Frontend:** https://notes-by-maham.vercel.app/login
- **Backend Health Check:** https://backend-tau-one-94.vercel.app/health
- **Code Quality (SonarCloud):** https://sonarcloud.io/project/overview?id=mahamrafiqofficial-crypto_cohort-9-mern-15903-maham

## ✨ Features

- 🔐 User signup/login with JWT authentication and hashed passwords (bcryptjs)
- 📝 Full Notes CRUD (create, read, update, delete), scoped per logged-in user
- 🎨 Rich text editor (Tiptap) — bold, italic, underline, strikethrough, headings, bullet/numbered lists, blockquote, code block, text alignment, links, images, tables, undo/redo, word & character count
- 🔍 Search notes by title or content
- ↕️ Sort notes (newest, oldest, title A-Z, last edited)
- 📌 Pin/unpin important notes
- 📋 Duplicate notes
- 🏷️ Category and tags support
- 🎨 Color coding for notes
- 🌙 Dark / light mode toggle
- ⌨️ Ctrl+S keyboard shortcut to save
- 👤 Profile settings — profile picture upload, phone, location, bio
- 📤 Export notes as a JSON file
- 📥 Import notes from a JSON file
- 📱 Mobile-responsive UI
- 🪵 Pino logging for all requests, responses, and errors
- 🛡️ Global exception-handling middleware (validation, cast, duplicate key, JWT, 404)
- ✅ Backend unit tests (Mocha, Chai, Supertest) for auth and notes endpoints
- 📊 SonarCloud code quality analysis integrated via CI

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- React Router
- Axios
- Tiptap (rich text editor)

**Backend:**
- Node.js, Express.js
- MongoDB with Mongoose
- JWT + bcryptjs for authentication
- Pino + pino-http for logging

**Testing & Quality:**
- Mocha, Chai, Supertest
- SonarCloud

**Deployment:**
- Vercel (frontend + backend, separately)

## 📁 Project Structure

cohort-9-mern-15903-maham/
├── backend/
│ ├── src/
│ │ ├── controllers/ # Route handlers (auth, notes)
│ │ ├── models/ # Mongoose schemas (User, Note)
│ │ ├── routes/ # Express routers
│ │ ├── middleware/ # Auth protection, error handling
│ │ └── app.js
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable components (RichTextEditor, ThemeToggle, etc.)
│ │ ├── pages/ # Dashboard, NoteEditor, Profile, Login, Signup
│ │ ├── services/ # API calls (api.js)
│ │ └── hooks/ # Custom hooks (useTheme)
│ └── package.json
└── README.md


## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-15903-maham.git
cd cohort-9-mern-15903-maham
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000


Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup

> Open a new terminal at the project root, or from the `backend` folder run `cd ../frontend`.

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` with:

VITE_API_URL=http://localhost:5000/api


Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🧪 Running Tests

```bash
cd backend
npm test
```

## 📡 API Endpoints

**Auth**
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/auth/me` | Get current user's profile |
| PUT | `/api/auth/me` | Update current user's profile |

**Notes**
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/notes` | Get all notes (supports `?q=`, `?sort=`, `?category=`, `?tag=`) |
| GET | `/api/notes/:id` | Get a single note |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| PATCH | `/api/notes/:id/pin` | Toggle pin on a note |
| PATCH | `/api/notes/:id/archive` | Toggle archive on a note |
| POST | `/api/notes/:id/duplicate` | Duplicate a note |
| GET | `/api/notes/export` | Export all notes as JSON |
| POST | `/api/notes/import` | Import notes from JSON |

## 📝 Notes for Reviewer

- The task document specified MySQL/PostgreSQL; **MongoDB** was used instead for this implementation.
- Git workflow: feature branches → PR (reviewed via CodeRabbit) → merged into `develop`.

## 👤 Author

Maham Rafiq — Cohort 9, 10Pearls SHINE Internship Program