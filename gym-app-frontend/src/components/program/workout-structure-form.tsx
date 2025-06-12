import { Exercise, WorkoutStructure } from "@/app/(users)/types/program";
import type React from "react";

interface WorkoutStructureFormProps {
  workoutStructure: WorkoutStructure[];
  exercises: Exercise[];
  onChange: (structure: WorkoutStructure[]) => void;
}

export function WorkoutStructureForm({
  workoutStructure,
  exercises,
  onChange,
}: WorkoutStructureFormProps) {
  const addWorkoutStructure = () => {
    onChange([...workoutStructure, { name: "", exercises: [] }]);
  };

  const addExerciseToWorkout = (workoutIndex: number) => {
    const updatedStructure = [...workoutStructure];
    updatedStructure[workoutIndex].exercises.push({ name: "", sets: [] });
    onChange(updatedStructure);
  };

  const addSetToExercise = (workoutIndex: number, exerciseIndex: number) => {
    const updatedStructure = [...workoutStructure];
    updatedStructure[workoutIndex].exercises[exerciseIndex].sets.push({
      repetition: 0,
    });
    onChange(updatedStructure);
  };

  const updateWorkoutName = (workoutIndex: number, name: string) => {
    const updatedStructure = [...workoutStructure];
    updatedStructure[workoutIndex].name = name;
    onChange(updatedStructure);
  };

  const updateExerciseName = (
    workoutIndex: number,
    exerciseIndex: number,
    name: string
  ) => {
    const updatedStructure = [...workoutStructure];
    updatedStructure[workoutIndex].exercises[exerciseIndex].name = name;
    onChange(updatedStructure);
  };

  const updateSetRepetition = (
    workoutIndex: number,
    exerciseIndex: number,
    setIndex: number,
    repetition: number
  ) => {
    const updatedStructure = [...workoutStructure];
    updatedStructure[workoutIndex].exercises[exerciseIndex].sets[
      setIndex
    ].repetition = repetition;
    onChange(updatedStructure);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Workout Structure</h3>
        <button
          type="button"
          onClick={addWorkoutStructure}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          Add Workout
        </button>
      </div>

      {workoutStructure.map((workout, workoutIndex) => (
        <div
          key={workoutIndex}
          className="border border-gray-200 rounded-lg p-4 mb-4"
        >
          <input
            type="text"
            placeholder="Workout name (e.g., Upper Body, Leg Day)"
            value={workout.name}
            onChange={(e) => updateWorkoutName(workoutIndex, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <button
            type="button"
            onClick={() => addExerciseToWorkout(workoutIndex)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mb-3"
          >
            Add Exercise
          </button>

          {workout.exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="ml-4 border-l-2 border-gray-200 pl-4 mb-3"
            >
              <select
                value={exercise.name}
                onChange={(e) =>
                  updateExerciseName(
                    workoutIndex,
                    exerciseIndex,
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              >
                <option value="">Select Exercise</option>
                {exercises.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => addSetToExercise(workoutIndex, exerciseIndex)}
                className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 mb-2"
              >
                Add Set
              </button>

              <div className="flex flex-wrap gap-2">
                {exercise.sets.map((set, setIndex) => (
                  <input
                    key={setIndex}
                    type="number"
                    placeholder="Reps"
                    value={
                      Number.isFinite(set.repetition) ? set.repetition : ""
                    }
                    onChange={(e) =>
                      updateSetRepetition(
                        workoutIndex,
                        exerciseIndex,
                        setIndex,
                        Number.parseInt(e.target.value)
                      )
                    }
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    min="1"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
