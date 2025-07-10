import express from "express";

import { verifyAdmin, verifyAdminTrainer } from "../middleware/verifAdmin.js";
import {
  deleteUser,
  getAllMembers,
  getAllTrainers,
  getAllUsers,
  getUserById,
  getUserByIdFromCookies,
  login,
  logout,
  register,
  resetPassword,
  sendPasswordResetEmail,
  updateUser,
  validateResetToken,
} from "../controllers/users.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Route pour s'inscrire, uniquement pour les admins
router.post("/register", upload.single("profileImage"), register);

// Route pour se connecter
router.post("/login", login);

// Route pour récupérer un utilisateur par ID
router.get("/me/:id", getUserById);
router.get("/", getAllUsers);

// Route pour récupérer un utilisateur à partir du cookie
router.get("/me", getUserByIdFromCookies);

// Route pour récupérer tous les membres (seulement pour admin ou trainer)
router.get("/members", verifyAdminTrainer, getAllMembers);

// Route pour récupérer tous les entraîneurs (seulement pour admin ou trainer)
router.get("/trainers", getAllTrainers);

// Route pour supprimer un utilisateur (seulement pour admin ou trainer)
router.delete("/:id", deleteUser);

// Route pour mettre à jour un utilisateur
router.put("/:id", updateUser);

// Route pour se déconnecter
router.post("/logout", logout);
router.post("/auth/send-reset-email", sendPasswordResetEmail);
router.post("/auth/validate-reset-token", validateResetToken);
router.post("/auth/reset-password", resetPassword);
export { router as usersRouter };
