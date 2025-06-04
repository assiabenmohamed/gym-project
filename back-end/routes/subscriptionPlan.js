import express from "express";
import {
  createPlan,
  deletePlan,
  getPlan,
  updatePlan,
} from "../controllers/subscriptionPlan.js";
import { verifyAdmin } from "../middleware/verifAdmin.js";

const router = express.Router();

router.post("/", createPlan);
router.get("/", verifyAdmin, getPlan);
router.delete("/:id", verifyAdmin, deletePlan);
router.put("/:id", verifyAdmin, updatePlan);

export { router as subscriptionPlanRouter };
