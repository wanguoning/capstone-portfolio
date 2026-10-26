# Wang Guoning — Full-Stack Portfolio & Blog

**Course:** Web Data Management and Application — Cumulative Full-Stack Capstone Project
**Student:** Wang Guoning (Student ID: 24998015)
**Project Type:** MERN full-stack personal portfolio website with a blog, comments and a contact form.

---

## 1. Project Overview

This capstone project is a production-ready full-stack web application made of two parts:

- **Back-End API (`server/`)** — a secure, RESTful API built with Node.js and Express. It manages portfolio projects, blog posts, comments and contact messages. User registration and login issue JWTs; protected routes require a valid token; only the author of a blog post may edit or delete it. Data is modeled with Mongoose and stored in MongoDB.
- **Front-End SPA (`client/`)** — a responsive Single Page Application built with React and Vite, styled with Tailwind CSS. It consumes every back-end endpoint, provides public pages (home, projects, blog, blog detail, contact, login, register) and a protected Admin Dashboard where the logged-in owner manages projects and blog posts and can comment on posts.

### Main features

- Public browsing of projects and blog posts, with author names populated from the database.
- Account registration and login with hashed passwords and JWT authentication.
- Protected Admin Dashboard with create / edit / delete for projects and blog posts.
- Author-only edit and delete on blog posts; non-author requests are rejected with `403`.
- Comment system on blog posts for logged-in users; anonymous visitors are asked to log in.
- Public contact form that saves messages to the database.
- Centralized error handling, secure HTTP headers (helmet), CORS whitelist and input validation.

---

## 2. Deployed Links

> The two public URLs below are filled in after deployment to the hosting platforms.

| Part | URL |
| --- | --- |
| Live Front-End (React SPA) | `TO BE FILLED AFTER DEPLOYMENT` |
| Live Back-End (REST API) | `TO BE FILLED AFTER DEPLOYMENT` |

---

## 3. Repository Structure

```
24998015_WangGuoning_CapstoneProject/
├── README.md
├── server/                                  # Express REST API
│   ├── package.json
│   ├── .env.example
│   ├── server.js                            # Entry point: dotenv, connect DB, listen
│   ├── app.js                               # Express app: helmet, cors, routes, errors
│   ├── config/
│   │   └── db.js                            # Mongoose connection
│   ├── middleware/
│   │   ├── auth.js                          # protect: verify JWT, attach req.user
│   │   └── errorMiddleware.js               # 404 handler + central error handler
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── ProjectModel.js
│   │   ├── BlogPostModel.js
│   │   ├── CommentModel.js
│   │   └── MessageModel.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── blogController.js
│   │   ├── commentController.js
│   │   └── messageController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── blogRoutes.js
│   │   └── messageRoutes.js
│   ├── utils/
│   │   ├── ErrorHandler.js
│   │   └── generateToken.js
│   └── scripts/
│       ├── seed.js                          # Reset DB and insert sample data
│       └── api-test.js                      # Automated end-to-end API test suite
└── client/                                  # React + Vite SPA
    ├── package.json
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/client.js                   # fetch wrapper, token header, 401 handling
        ├── context/AuthContext.jsx         # global auth state, localStorage persistence
        ├── components/
        │   ├── Header.jsx
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ProjectCard.jsx
        │   ├── BlogPostCard.jsx
        │   ├── ProjectForm.jsx
        │   ├── BlogForm.jsx
        │   ├── CommentList.jsx
        │   └── CommentForm.jsx
        └── pages/
            ├── Home.jsx
            ├── Projects.jsx
            ├── Blog.jsx
            ├── BlogDetail.jsx
            ├── Contact.jsx
            ├── Login.jsx
            ├── Register.jsx
            └── Admin.jsx
```

---

## 4. Tech Stack

### Back-End

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express 4 | RESTful web framework and routing |
| Mongoose 8 | MongoDB schema modeling and validation |
| jsonwebtoken 9 | JWT signing and verification |
| bcryptjs | Password hashing |
| helmet | Secure HTTP response headers |
| cors | Cross-origin request whitelist |
| cookie-parser | Cookie parsing |
| dotenv | Environment variable loading |

### Front-End

| Technology | Purpose |
| --- | --- |
| React 18 | Component-based UI |
| Vite 5 | Dev server and production build |
| React Router DOM 6 | Client-side routing and protected routes |
| Tailwind CSS 3 | Utility-first styling |
| Context API | Global authentication state |

### Database and authentication

- **Database:** MongoDB (local instance for development; MongoDB Atlas for deployment).
- **Authentication:** JWT in the `Authorization: Bearer <token>` header; token payload contains the user `id` and expires after `30d`.

---

## 5. Environment Variables

### Back-End — `server/.env`

Copy `server/.env.example` to `server/.env` and fill in the values.

| Variable | Required | Description | Example / default |
| --- | --- | --- | --- |
| `PORT` | No | Port the API listens on | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb://127.0.0.1:27017/capstone_db` |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs | a long random string |
| `CORS_ORIGIN` | Yes | Allowed front-end origin | `http://localhost:5173` |

### Front-End — `client/.env`

Copy `client/.env.example` to `client/.env` and fill in the value.

| Variable | Required | Description | Example / default |
| --- | --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL of the back-end API | `http://localhost:5000/api` |

---

## 6. API Reference

### 6.1 Conventions

- **Local base URL:** `http://localhost:5000/api`
- **Protected requests** must carry the header `Authorization: Bearer <token>`.
- All request and response bodies are JSON.

**Success envelopes**

- Authentication endpoints return the user and token directly (no `data` wrapper):

```json
{ "success": true, "_id": "...", "username": "admin", "email": "admin@portfolio.com", "token": "..." }
```

- Resource endpoints wrap the payload in a `data` field; list responses also include `count`:

```json
{ "success": true, "count": 4, "data": [ /* projects or posts */ ] }
```

```json
{ "success": true, "data": { /* single project, post, comment or message */ } }
```

**Error envelope**

```json
{ "success": false, "message": "Description of the error" }
```

**Common status codes**

| Code | Meaning |
| --- | --- |
| `200` | Request succeeded |
| `201` | Resource created |
| `400` | Missing required fields, validation error or duplicate unique field |
| `401` | Missing or invalid token, or invalid credentials |
| `403` | Authenticated but not authorized (for example, non-author editing a post) |
| `404` | Resource not found, invalid ObjectId, or unmatched route |

### 6.2 Public Endpoints

| Method | Path | Description | Request body | Success response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/users/register` | Register a new account and return a JWT | `{ "username": "...", "email": "...", "password": "..." }` — all required, password at least 6 characters | `201` — `{ success, _id, username, email, token }` |
| `POST` | `/api/users/login` | Log in and return a JWT | `{ "email": "...", "password": "..." }` | `200` — `{ success, _id, username, email, token }` |
| `GET` | `/api/projects` | List all projects, with owner username populated | none | `200` — `{ success, count, data: Project[] }` |
| `GET` | `/api/projects/:id` | Get one project by id, with owner username populated | none | `200` — `{ success, data: Project }` |
| `GET` | `/api/blog` | List all blog posts, newest first, with author username populated | none | `200` — `{ success, count, data: BlogPost[] }` |
| `GET` | `/api/blog/:id` | Get one post with its comments (oldest first), authors populated | none | `200` — `{ success, data: { ...BlogPost, comments: Comment[] } }` |
| `GET` | `/api/blog/:postId/comments` | List comments for one post, oldest first, author populated | none | `200` — `{ success, count, data: Comment[] }` |
| `POST` | `/api/contact` | Save a public contact message | `{ "name": "...", "email": "...", "message": "..." }` — all required | `201` — `{ success, data: Message }` |

### 6.3 Protected Endpoints

All endpoints below require `Authorization: Bearer <token>`.

| Method | Path | Access | Description | Request body | Success response |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/api/projects` | Logged-in user | Create a project linked to the current user | `{ "title": "...", "description": "...", "imageUrl": "?", "repoUrl": "?", "liveUrl": "?" }` — `title` and `description` required; other fields optional | `201` — `{ success, data: Project }` |
| `PUT` | `/api/projects/:id` | Logged-in user | Update a project | `{ "title": "...", "description": "...", "imageUrl": "?", "repoUrl": "?", "liveUrl": "?" }` | `200` — `{ success, data: Project }` |
| `DELETE` | `/api/projects/:id` | Logged-in user | Delete a project | none | `200` — `{ success, message: "Project removed" }` |
| `POST` | `/api/blog` | Logged-in user | Create a post linked to the current user | `{ "title": "...", "content": "..." }` — both required | `201` — `{ success, data: BlogPost }` |
| `PUT` | `/api/blog/:id` | Author only | Update a post; non-author receives `403` | `{ "title": "...", "content": "..." }` | `200` — `{ success, data: BlogPost }` |
| `DELETE` | `/api/blog/:id` | Author only | Delete a post and cascade-delete its comments; non-author receives `403` | none | `200` — `{ success, message: "Blog post removed" }` |
| `POST` | `/api/blog/:postId/comments` | Logged-in user | Add a comment to a post | `{ "body": "..." }` — required | `201` — `{ success, data: Comment }` |

**Authorization rules**

- Project create / update / delete require only a valid token.
- Blog post update / delete additionally require the current user to be the post author; otherwise the API returns `403 Not authorized to update this post` or `403 Not authorized to delete this post`.

---

## 7. Data Models

### User

| Field | Type | Constraints |
| --- | --- | --- |
| `username` | String | Required, unique |
| `email` | String | Required, unique |
| `password` | String | Required, minimum 6 characters, `select: false`; hashed with bcrypt before saving |

Instance method `matchPassword(enteredPassword)` compares the entered password with the stored hash.

### Project

| Field | Type | Constraints |
| --- | --- | --- |
| `title` | String | Required |
| `description` | String | Required |
| `imageUrl` | String | Optional |
| `repoUrl` | String | Optional |
| `liveUrl` | String | Optional |
| `user` | ObjectId (`ref: User`) | Required, owner of the project |

### BlogPost

| Field | Type | Constraints |
| --- | --- | --- |
| `title` | String | Required |
| `content` | String | Required |
| `author` | ObjectId (`ref: User`) | Required |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

### Comment

| Field | Type | Constraints |
| --- | --- | --- |
| `body` | String | Required |
| `author` | ObjectId (`ref: User`) | Required |
| `post` | ObjectId (`ref: BlogPost`) | Required |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

### Message

| Field | Type | Constraints |
| --- | --- | --- |
| `name` | String | Required |
| `email` | String | Required |
| `message` | String | Required |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

---

## 8. Run the Project Locally

### 8.1 Prerequisites

- Node.js 18 or newer and npm.
- A running MongoDB instance (local MongoDB server or a MongoDB Atlas cluster).

### 8.2 Start the back-end API

1. Open a terminal and go to the server folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and edit it:

   ```bash
   cp .env.example .env
   ```

   Set `MONGO_URI`, `JWT_SECRET` and `CORS_ORIGIN` (the local front-end origin is `http://localhost:5173`).

4. (Optional) Reset the database and insert the sample projects, posts, comments and one contact message:

   ```bash
   npm run seed
   ```

5. Start the API:

   ```bash
   npm start
   ```

   The API runs on `http://localhost:5000`.

### 8.3 Start the front-end SPA

1. Open a second terminal and go to the client folder:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and edit it:

   ```bash
   cp .env.example .env
   ```

   Set `VITE_API_URL` to the local API base URL:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   The SPA runs on `http://localhost:5173`.

### 8.4 Connect the front-end to the back-end

- `client/.env` points `VITE_API_URL` at the back-end base URL.
- `server/.env` sets `CORS_ORIGIN` to the front-end origin (`http://localhost:5173` for local development).
- The back-end also allows the local Vite origin `http://localhost:5173` by default.
- After changing either environment file, restart the corresponding dev server.

### 8.5 Seed account and sample data

After running `npm run seed`, the following administrator account exists:

| Field | Value |
| --- | --- |
| Email | `admin@portfolio.com` |
| Password | `123456` |

The seed data contains 4 sample projects, 3 sample blog posts, 3 sample comments and 1 sample contact message.

### 8.6 Front-end routes

| Route | Access | Page |
| --- | --- | --- |
| `/` | Public | Home (hero, About Me, skills, social links) |
| `/projects` | Public | Project grid |
| `/blog` | Public | Blog post list |
| `/blog/:id` | Public | Blog post detail with comments |
| `/contact` | Public | Contact form |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/admin` | Protected | Admin Dashboard: project and post management |

---

## 9. Deployment Notes

### 9.1 Database — MongoDB Atlas

1. Create a free M0 cluster and a database user.
2. Add `0.0.0.0/0` to the network access whitelist (or the platform's outbound ranges).
3. Copy the connection string into the back-end `MONGO_URI` environment variable.

### 9.2 Back-end hosting (for example Render)

- Build command: `npm install`
- Start command: `node server.js`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN` (set to the deployed front-end URL).
- Verify the public API (for example `GET /api/blog`) responds from the live back-end URL.

### 9.3 Front-end hosting (for example Vercel or Netlify)

- Build command: `npm run build`; publish the `dist` folder.
- Environment variable: `VITE_API_URL` set to the live back-end API URL (for example `https://your-api.onrender.com/api`).
- Configure a SPA rewrite / fallback to `index.html` so client-side routes such as `/blog/:id` and `/admin` work on refresh.

### 9.4 Post-deployment checklist

- [ ] Both live URLs are recorded in Section 2 of this README.
- [ ] The deployed front-end talks only to the deployed back-end.
- [ ] Sample data or the administrator account is available on the deployed database.

---

## 10. Available Scripts

### Back-end (`server/`)

| Command | Action |
| --- | --- |
| `npm start` | Start the Express API (`node server.js`) |
| `npm run dev` | Start with nodemon for development |
| `npm run seed` | Reset the database and insert sample data |
| `npm run test:api` | Run the automated end-to-end API test suite |

### Front-end (`client/`)

| Command | Action |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 5173 |
| `npm run build` | Produce the optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
