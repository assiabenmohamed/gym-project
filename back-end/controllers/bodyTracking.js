import { BodyTracking } from "../models/bodyTracking.js";
import { User } from "../models/users.js";

// 🔍 GET - Récupérer toutes les entrées de body tracking
export async function getBody(req, res) {
  try {
    const body = await BodyTracking.find();
    res.json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des données de suivi corporel",
    });
  }
}
export async function getBodyByUser(req, res) {
  try {
    const { userId } = req.params;

    const bodyData = await BodyTracking.find({ user: userId });

    res.json(bodyData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur dans getBodyByUser controller",
    });
  }
}

// ➕ POST - Créer une nouvelle entrée de body tracking
export async function createBody(req, res) {
  try {
    const {
      userid,
      date,
      weight,
      fatMass,
      muscleMass,
      boneMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    } = req.body;

    // 🔁 Vérifie si l'ID utilisateur est fourni
    if (!userid) {
      return res
        .status(400)
        .json({ message: "L'identifiant utilisateur est requis." });
    }

    // 🔍 Vérifie que l'utilisateur existe
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // ✅ Création de l'entrée
    const newBody = new BodyTracking({
      user: user._id, // lien avec l'utilisateur
      date,
      weight,
      fatMass,
      muscleMass,
      boneMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    });

    await newBody.save();

    res.status(201).json({
      message: "Body tracking créé avec succès.",
      body: newBody,
    });
  } catch (error) {
    console.error("❌ Erreur dans createBody:", error);
    res.status(500).json({
      message: "Erreur dans le contrôleur createBody.",
    });
  }
}

// ✏️ PUT - Mettre à jour une entrée existante
export async function updateBody(req, res) {
  try {
    const { id } = req.params;
    const {
      date,
      weight,
      fatMass,
      muscleMass,
      boneMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    } = req.body;

    const updated = await BodyTracking.findByIdAndUpdate(
      id,
      {
        date,
        weight,
        fatMass,
        muscleMass,
        boneMass,
        visceralFat,
        metabolicRate,
        metabolicAge,
        waterMass,
        note,
      },
      { new: true } // retourne l'objet mis à jour
    );

    if (!updated) {
      return res.status(404).json({ message: "Entrée non trouvée" });
    }

    res.json({
      message: "Données mises à jour avec succès",
      body: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur dans le contrôleur updateBody",
    });
  }
}

// 🗑️ DELETE - Supprimer une entrée
export async function deleteBody(req, res) {
  try {
    const { id } = req.params;
    const result = await BodyTracking.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Entrée non trouvée" });
    }

    res.json({
      message: "Entrée supprimée avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur dans le contrôleur deleteBody",
    });
  }
}
