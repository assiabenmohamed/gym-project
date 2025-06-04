import { Payment } from "../models/payement.js";
import { SubscriptionPlan } from "../models/subscriptionPlan.js";
import { Subscription } from "../models/subscription.js";
import { User } from "../models/users.js";

export async function createPaymentAndManageSubscription(req, res) {
  try {
    const { email, subscriptionPlanId, method, date, status, amount } =
      req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const plan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!plan) return res.status(404).json({ error: "Plan non trouvé" });

    const now = new Date();

    // Sessions selon la fréquence
    let baseSessions = null;
    if (plan.frequency === "2x/week") baseSessions = 8;
    else if (plan.frequency === "3x/week") baseSessions = 12;

    // Durée de l’abonnement
    let endDate = new Date(now);
    switch (plan.duration) {
      case "month":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "3 months":
        endDate.setMonth(endDate.getMonth() + 3);
        if (baseSessions !== null) baseSessions *= 3;
        break;
      case "6 months":
        endDate.setMonth(endDate.getMonth() + 6);
        if (baseSessions !== null) baseSessions *= 6;
        break;
      case "year":
        endDate.setFullYear(endDate.getFullYear() + 1);
        if (baseSessions !== null) baseSessions *= 12;
        break;
    }

    // Désactiver anciens abonnements
    await Subscription.updateMany(
      { user: user._id, isActive: true },
      { $set: { isActive: false } }
    );

    // Créer l’abonnement
    const subscription = await Subscription.create({
      user: user._id,
      plan: plan._id,
      startDate: date,
      endDate,
      isActive: true,
      remainingSessions: baseSessions,
    });

    // Créer le paiement après avoir lier subscription
    const payment = await Payment.create({
      user: user._id,
      subscriptionPlan: plan._id,
      subscription: subscription._id, // lien ajouté
      amount: amount,
      method,
      date: date,
      status: status,
    });
    const populatedPayment = await Payment.findById(payment._id)
      .populate("user")
      .populate("subscriptionPlan")
      .populate("subscription");
    res.status(201).json({
      message: "Paiement et nouvel abonnement enregistrés",
      payment: populatedPayment,
      subscriptionEndDate: subscription.endDate,
    });
  } catch (err) {
    console.error("Erreur paiement :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function updatePaymentAndSubscription(req, res) {
  try {
    const { paymentId, subscriptionPlanId, method, date, status, amount } =
      req.body;

    const existingPayment = await Payment.findById(paymentId);
    if (!existingPayment)
      return res.status(404).json({ error: "Paiement introuvable" });

    const user = await User.findById(existingPayment.user);
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    const plan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!plan)
      return res.status(404).json({ error: "Plan d’abonnement introuvable" });

    // Si le statut est "failed" ou "pending", on supprime l’abonnement
    if (["failed", "pending"].includes(status)) {
      if (existingPayment.subscription) {
        await Subscription.findByIdAndDelete(existingPayment.subscription);
        existingPayment.subscription = null;
      }
    } else {
      // Sinon, on met à jour ou crée l’abonnement
      const now = new Date();

      // Sessions selon la fréquence
      let baseSessions = null;
      if (plan.frequency === "2x/week") baseSessions = 8;
      else if (plan.frequency === "3x/week") baseSessions = 12;

      let endDate = new Date(now);
      switch (plan.duration) {
        case "month":
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case "3 months":
          endDate.setMonth(endDate.getMonth() + 3);
          if (baseSessions !== null) baseSessions *= 3;
          break;
        case "6 months":
          endDate.setMonth(endDate.getMonth() + 6);
          if (baseSessions !== null) baseSessions *= 6;
          break;
        case "year":
          endDate.setFullYear(endDate.getFullYear() + 1);
          if (baseSessions !== null) baseSessions *= 12;
          break;
      }

      let subscription;
      if (existingPayment.subscription) {
        subscription = await Subscription.findById(
          existingPayment.subscription
        );
        if (subscription) {
          subscription.plan = plan._id;
          subscription.startDate = date;
          subscription.endDate = endDate;
          subscription.remainingSessions = baseSessions;
          subscription.isActive = true;
          await subscription.save();
        }
      } else {
        // Désactiver anciens abonnements actifs
        await Subscription.updateMany(
          { user: user._id, isActive: true },
          { $set: { isActive: false } }
        );

        subscription = await Subscription.create({
          user: user._id,
          plan: plan._id,
          startDate: date,
          endDate,
          isActive: true,
          remainingSessions: baseSessions,
        });

        existingPayment.subscription = subscription._id;
      }
    }

    // Mise à jour du paiement
    existingPayment.subscriptionPlan = plan._id;
    existingPayment.method = method;
    existingPayment.date = date;
    existingPayment.status = status;
    existingPayment.amount = amount;
    await existingPayment.save();

    const updatedPayment = await Payment.findById(paymentId)
      .populate("user")
      .populate("subscriptionPlan")
      .populate("subscription");

    res.status(200).json({
      message: "Paiement mis à jour",
      payment: updatedPayment,
      subscriptionEndDate: updatedPayment.subscription?.endDate || null,
    });
  } catch (err) {
    console.error("Erreur mise à jour :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function getAllPayments(req, res) {
  try {
    const payments = await Payment.find()
      .populate("user")
      .populate("subscriptionPlan")
      .populate("subscription"); // s'assurer que ce champ est bien relié dans le schéma

    // Ajout d'une date de fin (issue de l'abonnement)
    const paymentsWithEndDate = payments.map((payment) => {
      const paymentObj = payment.toObject();
      return {
        ...paymentObj,
        subscriptionEndDate: payment.subscription?.endDate || null,
      };
    });

    res.status(200).json(paymentsWithEndDate);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function getPaymentById(req, res) {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "user subscriptionPlan subscription"
    );

    if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });

    res.status(200).json({
      ...payment.toObject(),
      subscriptionEndDate: payment.subscription?.endDate || null,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getPaymentsByUser(req, res) {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const payments = await Payment.find({ user: user._id }).populate(
      "subscriptionPlan"
    );
    res.status(200).json(payments);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paiements utilisateur :",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function deletePayment(req, res) {
  try {
    const { id } = req.params;

    // Récupérer le paiement d'abord
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });

    // Supprimer l’abonnement lié s’il existe
    if (payment.subscription) {
      await Subscription.findByIdAndDelete(payment.subscription);
    }

    // Supprimer le paiement
    await Payment.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Paiement et abonnement liés supprimés avec succès" });
  } catch (error) {
    console.error("Erreur suppression paiement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
