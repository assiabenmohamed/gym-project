import { Exercise } from "../models/exercise.js";
import { Program } from "../models/program.js";
import { User } from "../models/users.js";

// Create a new program

export async function getPrograms(req, res) {
  try {
    const programs = await Program.find()
      .populate("user", "firstName lastName")
      .populate("trainer", "firstName lastName")
      .populate("strecture.exercices.name", "name category");

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
    const programs = await Program.find({ user: userId })
      .populate("trainer", "firstName lastName email") // optionnel, pour infos coach
      .populate("strecture.exercices.name", "name category"); // populate exercices dans la structure

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching programs by user" });
  }
}
export async function getProgramsByTrainer(req, res) {
  try {
    const { trainerId } = req.params;

    const programs = await Program.find({ trainer: trainerId })
      .populate("user", "firstName lastName email") // Infos utilisateur
      .populate("strecture.exercices.name", "name category"); // Exercices détails

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching programs by trainer" });
  }
}
export async function getProgramById(req, res) {
  try {
    const { id } = req.params;

    const program = await Program.findById(id)
      .populate("user", "firstName lastName email")
      .populate("trainer", "firstName lastName email")
      .populate("strecture.exercices.name", "name category");

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
    const { user, trainer, strecture } = req.body;

    // Vérifier si l'utilisateur existe
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifier si le coach existe
    const foundTrainer = await User.findById(trainer);
    if (!foundTrainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Vérifier les exercices dans la strecture
    for (const day of strecture) {
      for (const exo of day.exercices) {
        const exists = await Exercise.findById(exo.name);
        if (!exists) {
          return res.status(404).json({
            message: `Exercise not found: ${exo.name}`,
          });
        }
      }
    }

    // Créer le programme
    const newProgram = new Program(req.body);
    await newProgram.save();

    res.status(201).json({
      message: "Program created successfully",
      program: newProgram,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in createProgram controller",
    });
  }
}
export async function updateProgram(req, res) {
  try {
    const { id } = req.params;
    const { user, trainer, strecture } = req.body;

    // Vérifier que user existe
    const userExists = await User.exists({ _id: user });
    if (!userExists) {
      return res.status(400).json({ message: "User not found" });
    }

    // Vérifier que trainer existe
    const trainerExists = await User.exists({ _id: trainer });
    if (!trainerExists) {
      return res.status(400).json({ message: "Trainer not found" });
    }

    // Vérifier que tous les exercices dans la strecture existent
    if (Array.isArray(strecture)) {
      for (const section of strecture) {
        if (Array.isArray(section.exercices)) {
          for (const exercice of section.exercices) {
            const exerciseExists = await Exercise.exists({
              _id: exercice.name,
            });
            if (!exerciseExists) {
              return res.status(400).json({
                message: `Exercise with id ${exercice.name} not found`,
              });
            }
          }
        }
      }
    }

    // Mise à jour du programme si toutes les vérifications passent
    const updatedProgram = await Program.findByIdAndUpdate(id, req.body, {
      new: true,
    });

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
