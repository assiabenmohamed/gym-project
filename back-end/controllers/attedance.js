import { Request, Response } from "express";
import { User } from "../models/User";
import { Subscription } from "../models/Subscription";
import { Attendance } from "../models/Attendance"; // optionnel

export async function markAttendance(req) {
  try {
    const { email } = req.body;

    // 🔍 Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    // ✅ Trouver son abonnement actif
    const subscription = await Subscription.findOne({
      user: user._id,
      isActive: true,
      endDate: { $gte: new Date() },
    }).populate("plan");

    if (!subscription) {
      return res.status(400).json({ error: "Aucun abonnement actif trouvé" });
    }

    // 🔒 Vérifier s’il reste des séances (si ce n’est pas illimité)
    if (
      subscription.remainingSessions !== null &&
      subscription.remainingSessions <= 0
    ) {
      return res.status(403).json({ error: "Plus de séances disponibles" });
    }

    // 🗓️ Marquer la présence (optionnel)
    await Attendance.create({
      user: user._id,
      date: new Date(),
      subscription: subscription._id,
    });

    // ➖ Décrémenter les séances restantes si applicable
    if (subscription.remainingSessions !== null) {
      subscription.remainingSessions -= 1;
      await subscription.save();
    }

    return res.status(200).json({
      message: "Présence marquée avec succès",
      remainingSessions: subscription.remainingSessions,
    });
  } catch (err) {
    console.error("Erreur lors de la présence :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
