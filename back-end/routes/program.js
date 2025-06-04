import express from "express";

import {
    createProgram,
    deleteProgram,
    getProgramById,
    getPrograms,
    getProgramsByTrainer,
    getProgramsByUser,
    updateProgram,
} from "../controllers/program.js";

const router = express.Router();

// Créer un programme
router.post("/", createProgram);

// Récupérer tous les programmes
router.get("/", getPrograms);

// Récupérer un programme par ID
router.get("/:id", getProgramById);

// Mettre à jour un programme par ID
router.put("/:id", updateProgram);

// Supprimer un programme par ID
router.delete("/:id", deleteProgram);

// Récupérer tous les programmes d’un membre (user)
router.get("/user/:userId", getProgramsByUser);

// Récupérer tous les programmes d’un coach (trainer)
router.get("/trainer/:trainerId", getProgramsByTrainer);

export { router as programsRouter };
