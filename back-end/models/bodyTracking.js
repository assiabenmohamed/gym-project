import mongoose from "mongoose";
const bodyTrackingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number, required: true },
    fatMass: { type: Number },
    muscleMass: { type: Number },
    boneMass: { type: Number },
    visceralFat: { type: Number },
    metabolicRate: { type: Number },
    metabolicAge: { type: Number },
    waterMass: { type: Number },
    note: { type: String },
  },
  { timestamps: true }
);
export const BodyTracking = mongoose.model("BodyTracking", bodyTrackingSchema);
