# Backend setup

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

Create a `.env` file in this folder (see `.env.example`):

```env
MONGO_URI=your_mongodb_atlas_connection_string
ADMIN_WIPE_SECRET=secret
```

- Get **MONGO_URI**: [MongoDB Atlas](https://cloud.mongodb.com) → create a free cluster → Connect → Driver: Node.js → copy the connection string. Replace `<password>` with your DB user password.
- If you see **querySrv ECONNREFUSED**: your network may block MongoDB Atlas, or the cluster is paused. Use your own Atlas cluster and your own MONGO_URI.

## 3. Run the server

```bash
npm start
```

API runs at `http://localhost:8080`.
