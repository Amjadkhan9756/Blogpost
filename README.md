<div align="center">

# 📝 Postblog

**A modern full-stack social blog platform — share posts, connect with users, and build your profile.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

---

</div>

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 **Auth** | Register, login, and secure sessions |
| 📄 **Posts** | Create, like, and comment on posts with optional media |
| 👤 **Profiles** | Custom profiles with bio, education, and work experience |
| 🔗 **Connections** | Send and accept connection requests (LinkedIn-style) |
| ✅ **Verified badge** | Blue check for high-engagement users |
| 🖼️ **Media** | Profile pictures and post images with fallbacks |
| 🛡️ **Admin** | Optional wipe & seed utilities for development |

---

## 🛠️ Tech stack

<table>
<tr>
<td width="50%">

**Frontend**

- **Next.js 15** — React framework
- **React 19** — UI
- **Redux Toolkit** — State management
- **Bootstrap 5** — Styling
- **Axios** — API client

</td>
<td width="50%">

**Backend**

- **Node.js** — Runtime
- **Express 5** — API server
- **MongoDB + Mongoose** — Database
- **Multer** — File uploads
- **bcrypt** — Password hashing

</td>
</tr>
</table>

---

## 📁 Project structure

```
Blogpost/
├── frontend/          # Next.js app (port 3000)
│   ├── src/
│   │   ├── pages/     # Dashboard, profile, discover, etc.
│   │   ├── Component/
│   │   ├── config/
│   │   └── ...
│   └── package.json
├── backend/           # Express API (port 8080)
│   ├── controller/
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://cloud.mongodb.com) account (free tier is enough)

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Amjadkhan9756/Postblog.git
cd Postblog
```

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

Create a `.env` file (see `backend/.env.example`):

```env
MONGO_URI=your_mongodb_atlas_connection_string
ADMIN_WIPE_SECRET=your-secret
```

Start the API:

```bash
npm run dev
```

API runs at **http://localhost:8080**

### 3️⃣ Frontend setup

In a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` (optional — defaults to `http://localhost:8080`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/
```

Start the app:

```bash
npm run dev
```

Open **http://localhost:3000**

### 4️⃣ Seed data (optional)

From `backend/`:

```bash
npm run seed
```

Creates sample users (password: `password123`), profiles, posts, and comments.

---

## 📜 Scripts

| Where | Command | Description |
|-------|---------|-------------|
| **Backend** | `npm run dev` | Start API with nodemon |
| **Backend** | `npm run seed` | Seed database |
| **Frontend** | `npm run dev` | Start Next.js dev server |
| **Frontend** | `npm run build` | Production build |

---

## 🔗 Links

- [MongoDB Atlas](https://cloud.mongodb.com) — Free cluster for `MONGO_URI`
- [Next.js docs](https://nextjs.org/docs)
- [Express docs](https://expressjs.com/)

---

<div align="center">

**Postblog** — built with Next.js, Express & MongoDB

</div>
