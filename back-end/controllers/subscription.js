import { Subscription } from "../models/Subscription";

export async function getAllSubscriptions(req, res) {
  try {
    const subscriptions = await Subscription.find()
      .populate("user")
      .populate("plan");
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error("Erreur getAllSubscriptions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function getSubscriptionByUserId(req, res) {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({ user: userId }).populate(
      "plan"
    );
    if (!subscription) {
      return res.status(404).json({ error: "Aucun abonnement trouvé" });
    }

    res.status(200).json(subscription);
  } catch (err) {
    console.error("Erreur getSubscriptionByUserId :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Subscription.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "Abonnement non trouvé" });

    res.status(200).json({ message: "Abonnement supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteSubscription :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function getActiveSubscriptions(req, res) {
  try {
    const subscriptions = await Subscription.find({ isActive: true }).populate(
      "user plan"
    );
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error("Erreur getActiveSubscriptions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
