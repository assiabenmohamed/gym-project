import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: Date, required: true },
    categories: [
      {
        name: { type: String },
        exercises: [
          {
            name: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Exercise",
              required: true,
            },
            sets: [{ repetition: Number, weight: Number }],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
export const Session = mongoose.model("Session", sessionSchema);
