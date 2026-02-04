const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

/* 🔥 CORS — ONLY ONCE */
app.use(
    cors({
        origin: [
            "https://task-taker-one.vercel.app",
            "http://localhost:3000"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* 🔥 IMPORTANT for preflight */
app.options("*", cors());

app.use(express.json());

/* Routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

module.exports = app;
