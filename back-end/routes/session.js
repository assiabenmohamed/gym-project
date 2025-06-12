import express from "express";
import {
  createSession,
  deleteSession,
  getSession,
  getSessionById,
  getSessionByUser,
  updateSession,
} from "../controllers/session.js";

const router = express.Router();

// Créer un session
router.post("/", createSession);

// Récupérer tous les sessions
router.get("/", getSession);

// Récupérer un session par ID
router.get("/:id", getSessionById);

// Mettre à jour un session par ID
router.put("/:id", updateSession);

// Supprimer un session par ID
router.delete("/:id", deleteSession);

// Récupérer tous les sessions d’un membre (user)
router.get("/user/:userId", getSessionByUser);

export { router as sessionRouter };
