import express from "express";
import {
  getBody,
  createBody,
  updateBody,
  deleteBody,
  getBodyByUser,
} from "../controllers/bodyTracking.js";

const router = express.Router();

// 📌 GET - Récupérer toutes les données de suivi corporel
router.get("/", getBody);

// 📌 GET - Récupérer une entrée de suivi corporel par ID
router.get("/:userId", getBodyByUser); // 👈

// 📌 POST - Créer une nouvelle entrée de suivi corporel
router.post("/", createBody);

// 📌 PUT - Mettre à jour une entrée par ID
router.put("/:id", updateBody);

// 📌 DELETE - Supprimer une entrée par ID
router.delete("/:id", deleteBody);

export { router as bodyTrackingRouter };
