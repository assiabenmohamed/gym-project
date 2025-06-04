import mongoose from "mongoose";
const programSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: { type: String, required: true },
    duration: { type: Number, default: 8 },
    isActive: { type: Boolean, default: true },
    objective: { type: String },
    strecture: [
      {
        name: { type: String },
        exercices: [
          {
            name: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Exercice",
              required: true,
            },
            sets: [{ repetition: Number }],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
export const Program = mongoose.model("Program", programSchema);
