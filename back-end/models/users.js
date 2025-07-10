import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /.+\@.+\..+/,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"] },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: ["trainer", "member", "admin"],
      default: "member",
    },

    trainerAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },

    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    goals: [String],
    medicalRestrictions: String,
    profileImageUrl: { type: String, default: "uploads/default-avatar.jpg" },
    isOnline: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpires: Date,
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
