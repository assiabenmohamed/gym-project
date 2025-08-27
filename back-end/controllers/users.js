import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import crypto from "crypto";

const MILILSECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // 🔐 À mettre dans .env
export async function register(req, res) {
  try {
    const {
      email,
      firstName,
      lastName,
      birthday,
      password,
      address,
      gender,
      phoneNumber,
      role,
      trainerAssigned,
      emergencyContact,
      goals,
      medicalRestrictions,
    } = req.body;

    // ✅ Corriger ici
    const finalTrainerAssigned =
      trainerAssigned && trainerAssigned !== "" ? trainerAssigned : null;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const profileImageUrl = req.file
      ? `uploads/${req.file.filename}`
      : "uploads/default-avatar.jpg";

    const newUser = new User({
      email,
      firstName,
      lastName,
      birthday,
      password: hash,
      address,
      gender,
      phoneNumber,
      role,
      trainerAssigned: finalTrainerAssigned,
      emergencyContact,
      goals,
      medicalRestrictions,
      profileImageUrl,
    });

    await newUser.save();

    const userResponse = { ...newUser._doc };
    delete userResponse.password;

    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in register controller",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Marquer l'utilisateur comme connecté
    userExists.isOnline = true;
    await userExists.save();

    // Générer le JWT
    const payload = { userId: userExists._id, email: userExists.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "14d" });

    // Options du cookie
    const options = {
      maxAge: MILILSECONDS_IN_A_DAY * 14,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Sécurisé uniquement en prod
      sameSite: "None",
      path: "/",
    };

    // Définir le cookie JWT
    res.cookie("token", token, options);

    return res.status(200).json({ user: userExists });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in login controller" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in getUserById controller" });
  }
}
export async function getAllMembers(req, res) {
  try {
    const members = await User.find({ role: "member" }).select("-password");

    res.status(200).json(members);
  } catch (error) {
    console.error("getAllMembers error:", error);
    res.status(500).json({ message: "Error in getAllMembers controller" });
  }
}
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Error in getAllUsers controller" });
  }
}
export async function getAllTrainers(req, res) {
  try {
    const trainers = await User.find({ role: "trainer" }).select("-password");

    res.status(200).json(trainers);
  } catch (error) {
    console.error("getAllTrainers error:", error);
    res.status(500).json({ message: "Error in getAllTrainers controller" });
  }
}
export async function updateUser(req, res) {
  try {
    console.log("➡️ req.body:", req.body);

    const {
      email,
      firstName,
      lastName,
      birthday,
      password,
      address,
      gender,
      phoneNumber,
      trainerAssigned,
      emergencyContact,
      goals,
      medicalRestrictions,
      profileImageUrl,
    } = req.body;
    const updateData = {
      email,
      firstName,
      lastName,
      birthday,
      password,
      address,
      gender,
      phoneNumber,
      trainerAssigned,
      emergencyContact,
      goals,
      medicalRestrictions,
      profileImageUrl,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function deleteUser(req, res) {
  try {
    const deleteuser = await User.findByIdAndDelete(req.params.id);
    if (!deleteuser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully",
      user: deleteuser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function getUserByIdFromCookies(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getUserByIdFromCookies error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
export async function logout(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    await User.findByIdAndUpdate(userId, { isOnline: false });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error in logout controller" });
  }
}
import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600000; // 1 heure
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL, // e.g. pulsefit.training2025@gmail.com
      pass: process.env.SMTP_PASSWORD, // Use App Password if 2FA is enabled
    },
  });

  const mailOptions = {
    from: `"Gym Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Token et mot de passe requis." });
  }

  try {
    // Trouver l’utilisateur avec ce token ET une date de validité
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // encore valide
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Lien invalide ou expiré." });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe et supprimer le token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé avec succès.",
    });
  } catch (err) {
    console.error("Erreur de réinitialisation :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};
export const validateResetToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token manquant." });
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Lien invalide ou expiré." });
  }

  return res.status(200).json({ success: true, email: user.email });
};
