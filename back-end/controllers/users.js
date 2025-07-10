import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
const MILILSECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // 🔐 À mettre dans .env
export async function register(req, res) {
  try {
    const {
      email,
      firstName,
      lastName,
      birthday,
      password,
      address,
      gender,
      phoneNumber,
      role,

      trainerAssigned,

      emergencyContact,
      goals,
      medicalRestrictions,
    } = req.body;
    // Vérifie si l'utilisateur existe déjà

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash du mot de passe (asynchrone)

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Récupère le chemin de l'image si elle a été envoyée
    const profileImageUrl = req.file ? `uploads/${req.file.filename}` : null;

    const newUser = new User({
      email,
      firstName,
      lastName,
      birthday,
      password: hash,
      address,
      gender,
      phoneNumber,
      role,
      trainerAssigned,

      emergencyContact,
      goals,
      medicalRestrictions,
      profileImageUrl,
    });
    await newUser.save(); // ✅ Attente correcte

    // Supprime le password du nouvel utilisateur avant de répondre
    const userResponse = { ...newUser._doc };
    delete userResponse.password;

    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "error in register controller", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (!userExists) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return res.status(400).json({
        message: "Password or email doesn't exists",
      });
    } // 200ms

    // test password
    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Password or email doesn't exists",
      });
    } //
    // ✅ Mettre à jour l'état connecté
    userExists.isOnline = true;
    await userExists.save();
    // Génération du JWT
    const payload = { userId: userExists._id, email: userExists.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "14d" }); // Le token expire après 14 jours

    const options = {
      maxAge: MILILSECONDS_IN_A_DAY * 14, // 14 jours
      httpOnly: true, // Le cookie est accessible seulement par le serveur
      secure: process.env.NODE_ENV === "production", // En production, cookie sécurisé (requiert HTTPS)
    };
    userExists.isOnline = true;
    res.cookie("token", token, options);
    res.json({
      user: userExists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in login controller" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in getUserById controller" });
  }
}
export async function getAllMembers(req, res) {
  try {
    const members = await User.find({ role: "member" }).select("-password");

    if (!members || members.length === 0) {
      return res.status(404).json({ message: "No members found" });
    }

    res.status(200).json(members);
  } catch (error) {
    console.error("getAllMembers error:", error);
    res.status(500).json({ message: "Error in getAllMembers controller" });
  }
}
export async function getAllTrainers(req, res) {
  try {
    const trainers = await User.find({ role: "trainer" }).select("-password");

    if (!trainers || trainers.length === 0) {
      return res.status(404).json({ message: "No trainers found" });
    }

    res.status(200).json(trainers);
  } catch (error) {
    console.error("getAllTrainers error:", error);
    res.status(500).json({ message: "Error in getAllTrainers controller" });
  }
}
export async function updateUser(req, res) {
  try {
    const {
      email,
      firstName,
      lastName,
      birthday,
      password,
      address,
      gender,
      phoneNumber,
      trainerAssigned,
      emergencyContact,
      goals,
      medicalRestrictions,
      profileImageUrl,
    } = req.body;
    const updateData = {
      email,
      firstName,
      lastName,
      birthday,
      password,
      address,
      gender,
      phoneNumber,
      trainerAssigned,
      emergencyContact,
      goals,
      medicalRestrictions,
      profileImageUrl,
    };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function deleteUser(req, res) {
  try {
    const deleteuser = await User.findByIdAndDelete(req.params.id);
    if (!deleteuser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully",
      user: deleteuser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function getUserByIdFromCookies(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getUserByIdFromCookies error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
export async function logout(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await User.findByIdAndUpdate(userId, { isOnline: false });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error in logout controller" });
  }
}
