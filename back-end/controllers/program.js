import { Exercise } from "../models/exercise.js";
import { Program } from "../models/program.js";
import { User } from "../models/users.js";

// Create a new program

export async function getPrograms(req, res) {
  try {
    const programs = await Program.find();

    res.json(programs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getPrograms controller",
    });
  }
}

export async function getProgramsByUser(req, res) {
  try {
    const { userId } = req.params; // L'ID du membre est dans les params URL

    // Recherche des programmes liés à ce user, on peut aussi populate si besoin
    const programs = await Program.find({ user: userId });

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching programs by user" });
  }
}
export async function getProgramsByTrainer(req, res) {
  try {
    const { trainerId } = req.params;

    const programs = await Program.find({ trainer: trainerId });

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching programs by trainer" });
  }
}
export async function getProgramById(req, res) {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching program by ID" });
  }
}
export async function createProgram(req, res) {
  try {
    const { user, trainer, name, duration, objective, structure } = req.body;

    // 🔍 Vérifier si l'utilisateur existe
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔍 Vérifier si le coach existe
    const foundTrainer = await User.findById(trainer);
    if (!foundTrainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // 🔍 Vérifier tous les exercises de la structure
    for (const day of structure) {
      for (const exo of day.exercises) {
        const exists = await Exercise.findById(exo.name);
        if (!exists) {
          return res.status(404).json({
            message: `Exercise not found: ${exo.name}`,
          });
        }
      }
    }

    //  Désactiver les anciens programmes actifs de l'utilisateur
    await Program.updateMany(
      { user, isActive: true },
      { $set: { isActive: false } }
    );
    // ✅ Créer le nouveau programme
    const newProgram = new Program({
      user,
      trainer,
      name,
      duration,
      isActive: true,
      objective,
      structure,
    });

    await newProgram.save();

    res.status(201).json({
      message: "Program created successfully",
      program: newProgram,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in createProgram controller" });
  }
}
export async function updateProgram(req, res) {
  try {
    const { id } = req.params;
    const { user, trainer, name, duration, objective, structure } = req.body;

    // 🔍 Vérifier si l'utilisateur existe
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔍 Vérifier si le coach existe
    const foundTrainer = await User.findById(trainer);
    if (!foundTrainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // 🔍 Vérifier tous les exercises de la structure
    for (const day of structure) {
      for (const exo of day.exercises) {
        const exists = await Exercise.findById(exo.name);
        if (!exists) {
          return res.status(404).json({
            message: `Exercise not found: ${exo.name}`,
          });
        }
      }
    }

    // ✅ Mettre à jour le programme
    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      {
        user,
        trainer,
        name,
        duration,
        objective,
        structure,
      },
      { new: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json({
      message: "Program updated successfully",
      program: updatedProgram,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error in updateProgram controller",
    });
  }
}
export async function deleteProgram(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Program.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json({
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in deleteProgram controller",
    });
  }
}
