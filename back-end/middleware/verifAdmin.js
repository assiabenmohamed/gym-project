import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Optionnel : ajouter `req.user = user;` si tu veux l'utiliser plus tard
    next();
  } catch (error) {
    console.error("verifyAdmin error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
export async function verifyAdminTrainer(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifie si l'utilisateur a le rôle "admin" ou "trainer"
    if (user.role !== "admin" && user.role !== "trainer") {
      return res
        .status(403)
        .json({ message: "Access denied: Admins and Trainers only" });
    }

    // Optionnel : ajouter `req.user = user;` si tu veux l'utiliser plus tard
    req.user = user;
    next();
  } catch (error) {
    console.error("verifyAdminTrainer error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
