import express from "express";

import { verifyAdmin, verifyAdminTrainer } from "../middleware/verifAdmin.js";
import {
  deleteUser,
  getAllMembers,
  getAllTrainers,
  getUserById,
  getUserByIdFromCookies,
  login,
  logout,
  register,
  updateUser,
} from "../controllers/users.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Route pour s'inscrire, uniquement pour les admins
router.post("/register", upload.single("profileImage"), register);

// Route pour se connecter
router.post("/login", login);

// Route pour récupérer un utilisateur par ID
router.get("/me/:id", getUserById);

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

export { router as usersRouter };
