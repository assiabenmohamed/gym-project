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

const allowedOrigins = [
  "http://localhost:3000", // Development
  "https://gym-project-8u8p.vercel.app", // Votre URL Vercel
  process.env.CLIENT_URL, // Variable d'environnement
];

// Log des origins autorisées au démarrage
console.log("Allowed origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS check for origin:", origin);

    // Permettre les requêtes sans origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log("No origin - allowing");
      return callback(null, true);
    }

    // Vérifier si l'origin est autorisée
    if (allowedOrigins.includes(origin)) {
      console.log("Origin allowed:", origin);
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: ${origin}`);
      console.log("Allowed origins:", allowedOrigins);
      callback(new Error(`Not allowed by CORS - Origin: ${origin}`));
    }
  },
  credentials: true, // INDISPENSABLE pour les cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "Set-Cookie",
    "X-Requested-With",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO CORS not allowed"));
      }
    },
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
