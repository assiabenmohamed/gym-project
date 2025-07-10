import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/connect-db.js";
import cookieParser from "cookie-parser";
import { usersRouter } from "./routes/users.js";
import path from "path";
import { fileURLToPath } from "url";
import { exerciseRouter } from "./routes/exercise.js";
import { programsRouter } from "./routes/program.js";
import { subscriptionPlanRouter } from "./routes/subscriptionPlan.js";
import { paymentRouter } from "./routes/payment.js";
import { bodyTrackingRouter } from "./routes/bodyTracking.js";
import { sessionRouter } from "./routes/session.js";
import { attendanceRouter } from "./routes/attendance.js";
import { subscriptionRouter } from "./routes/subscription.js";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./controllers/socketController.js";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// connect to db
connectDB();

// middlewares
// middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", usersRouter);
const server = http.createServer(app);

// Initialisation de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

setupSocketHandlers(io);

app.use("/exercises", exerciseRouter);
app.use("/programs", programsRouter);
app.use("/subscriptionPlan", subscriptionPlanRouter);
app.use("/payment", paymentRouter);
app.use("/bodyTracking", bodyTrackingRouter);
app.use("/sessions", sessionRouter);
app.use("/attendance", attendanceRouter);
app.use("/subscription", subscriptionRouter);
app.get("/ping", async (req, res) => {
  res.send("pong");
});

server.listen(process.env.PORT, () => {
  console.log(
    "✅ Serveur HTTP + WebSocket en écoute sur le port",
    process.env.PORT
  );
});
