import { Exercise } from "../models/exercise.js";
export async function getAllExercises(req, res) {
  try {
    const exercise = await Exercise.find();
    res.json(exercise);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in getAllExercises controller",
    });
  }
}

// Create an exercise
export const createExercise = async (req, res) => {
  try {
    const { name, category, equipment, description, photourl } = req.body;

    const newExercise = new Exercise({
      name,
      category,
      equipment,
      description,
      photourl,
    });

    await newExercise.save();

    res.json({
      message: "Exercise created successfully",
      exercise: newExercise,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in createExercise controller",
    });
  }
};
// Add multiple exercises
export const addManyExercises = async (req, res) => {
  try {
    const exercises = req.body; // an array of exercises

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        message: "Request body must be a non-empty array of exercises",
      });
    }

    const insertedExercises = await Exercise.insertMany(exercises);

    res.json({
      message: "Exercises added successfully",
      exercises: insertedExercises,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in addManyExercises controller",
    });
  }
};

// Get single exercise by ID
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }
    res.json({
      message: "Exercise fetched successfully",
      exercise,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getExerciseById controller",
    });
  }
};

// Update an exercise
export const updateExercise = async (req, res) => {
  try {
    const { name, category, equipment, description, photourl } = req.body;
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      name,
      category,
      equipment,
      description,
      photourl,
      { new: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.json({
      message: "Exercise updated successfully",
      exercise: updatedExercise,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in updateExercise controller",
    });
  }
};

// Delete an exercise
export const deleteExercise = async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.json({
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in deleteExercise controller",
    });
  }
};
