import { User } from "../models/users.js";
import { Subscription } from "../models/subscription.js";
import { Attendance } from "../models/attendance.js";

export async function markAttendance(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const subscription = await Subscription.findOne({
      user: user._id,
      isActive: true,
      endDate: { $gte: new Date() },
    }).populate("plan");

    if (!subscription) {
      return res.status(400).json({ error: "Aucun abonnement actif trouvé" });
    }

    if (
      subscription.remainingSessions !== null &&
      subscription.remainingSessions <= 0
    ) {
      return res.status(403).json({ error: "Plus de séances disponibles" });
    }

    // Empêcher les doublons de présence le même jour
    const alreadyMarked = await Attendance.findOne({
      user: user._id,
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    if (alreadyMarked) {
      return res
        .status(409)
        .json({ message: "Présence déjà enregistrée aujourd'hui" });
    }

    await Attendance.create({ user: user._id });

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
