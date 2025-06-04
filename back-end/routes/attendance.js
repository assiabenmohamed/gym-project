import express from "express";

import { markAttendance } from "../controllers/attedance.js";

const router = express.Router();
router.post("/mark", markAttendance);
