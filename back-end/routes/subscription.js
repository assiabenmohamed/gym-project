import express from "express";
import {
  deleteSubscription,
  getActiveSubscriptions,
  getAllSubscriptions,
  getSubscriptionByUserId,
} from "../controllers/subscription.js";

const router = express.Router();

router.get("/", getAllSubscriptions);

router.get("/user/:userId", getSubscriptionByUserId);

router.delete("/:id", deleteSubscription);

router.get("/active", getActiveSubscriptions);

export { router as subscriptionRouter };
