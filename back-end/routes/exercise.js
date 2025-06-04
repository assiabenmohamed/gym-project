import express from "express";
import { verifyAdmin, verifyAdminTrainer } from "../middleware/verifAdmin.js";
import {
  addManyExercises,
  createExercise,
  deleteExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
} from "../controllers/exercise.js";

const router = express.Router();
router.post("/bulk", addManyExercises);
router.post("/", createExercise);
router.get("/", getAllExercises);
router.get("/:id", getExerciseById);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);
export { router as exerciseRouter };
