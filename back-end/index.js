import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/connect-db.js";
import cookieParser from "cookie-parser";
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

// routers
// app.use("/users", usersRouter);
// app.use("/products", productsRouter);

app.get("/ping", async (req, res) => {
  res.send("pong");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
