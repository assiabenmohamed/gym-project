import mongoose from "mongoose";
const exerciceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    equipment: { type: String },
    description: { type: String },
    photourl: { type: String },
  },
  { timestamps: true }
);
export const Exercise = mongoose.model("Exercise", exerciceSchema);
