import { Exercise } from "../models/exercise.js";
import { Program } from "../models/program.js";
import { Session } from "../models/session.js";
import { User } from "../models/users.js";

// Create a new program

export async function getSession(req, res) {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getSession controller",
    });
  }
}
export async function getSessionByUser(req, res) {
  try {
    const { userId } = req.params; // L'ID du membre est dans les params URL

    const session = await Session.find({ user: userId });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching sessions by user" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching session by ID" });
  }
}
export async function createSession(req, res) {
  try {
    const { user, program, date, categories } = req.body;

    // Vérifie si l'utilisateur existe
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifie si chaque exercise existe
    for (const category of categories) {
      for (const exo of category.exercises) {
        const exists = await Exercise.findById(exo.name);
        if (!exists) {
          return res.status(404).json({
            message: `Exercise not found: ${exo.name}`,
          });
        }
      }
    }

    // Crée une nouvelle session
    const newSession = new Session({
      program,
      user,
      date,
      categories,
    });

    await newSession.save();

    res.status(201).json({
      message: "Session created successfully",
      session: newSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error in createSession controller",
    });
  }
}
export async function updateSession(req, res) {
  try {
    const { id } = req.params;
    const { program, user, date, categories } = req.body;

    // Vérifie l'existence de la session
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Vérifie si chaque exercise existe
    for (const category of categories) {
      for (const exo of category.exercises) {
        const exists = await Exercise.findById(exo.name);
        if (!exists) {
          return res.status(404).json({
            message: `Exercise not found: ${exo.name}`,
          });
        }
      }
    }

    // Met à jour la session
    session.program = program;
    session.user = user;
    session.date = date;
    session.categories = categories;

    await session.save();

    res.status(200).json({
      message: "Session updated successfully",
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in updateSession controller" });
  }
}
export async function deleteSession(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Session.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in deleteSession controller",
    });
  }
}
