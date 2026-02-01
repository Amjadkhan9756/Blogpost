import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.use(postRoutes);
app.use(userRoutes);

app.use(express.static("uploads"))

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("connected too mongodb atlas"))
    .catch((err) => console.error("mongose connected failed", err))

app.get("/", (req, res) => {
    res.send("API is working and connect to mongodb atles")
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

