import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["card", "cash"], required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
