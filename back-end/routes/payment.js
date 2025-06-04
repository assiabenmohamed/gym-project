import express from "express";
import {
  createPaymentAndManageSubscription,
  deletePayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByUser,
} from "../controllers/payment.js";

const router = express.Router();

// 💰 Créer un paiement et gérer l'abonnement
router.post("/", createPaymentAndManageSubscription);

// 📄 Obtenir tous les paiements
router.get("/", getAllPayments);

// 🔍 Obtenir un paiement par ID
router.get("/:id", getPaymentById);

// 📧 Obtenir les paiements d'un utilisateur par email
router.get("/user/:email", getPaymentsByUser);

// 🗑️ Supprimer un paiement
router.delete("/:id", deletePayment);

export { router as paymentRouter };
