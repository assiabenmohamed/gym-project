import mongoose from "mongoose";
import { Program } from "./program";
const sessionSchema = new mongoose.Schema({
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
      exercices: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercice",
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
