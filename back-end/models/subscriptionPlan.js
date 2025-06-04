import mongoose from "mongoose";
const subscriptionPlanSchema = new mongoose.Schema(
  {
    duration: {
      type: String,
      enum: ["month", "3 months", "6 months", "year"],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["2x/week", "3x/week", "infinite"],
      required: true,
    },
    accessType: {
      type: String,
      enum: ["musculation", "fitness", "gold"],
      required: true,
    },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);
export const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);
