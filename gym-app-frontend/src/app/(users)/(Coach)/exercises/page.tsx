"use client";
import { useState, useEffect } from "react";

export default function ExerciseApp() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // State for add/edit exercise form
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    equipment: "",
    description: "",
    gifUrl: "",
  });

  // Extract unique categories and equipment types
  const categories =
    exercises.length > 0
      ? ["All", ...new Set(exercises.map((ex) => ex.category))]
      : ["All"];

  const equipmentTypes =
    exercises.length > 0
      ? ["All", ...new Set(exercises.map((ex) => ex.equipment))]
      : ["All"];

  // Load exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        // In a real application, replace this URL with your backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exercises`
        );

        if (!response.ok) {
          throw new Error("Error loading exercises");
        }

        const data = await response.json();
        setExercises(data);
        setError(null);
      } catch (err) {
        setError("Unable to load exercises. Using demonstration data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on selections
  const filteredExercises = exercises.filter((exercise) => {
    return (
      (selectedCategory === "All" || exercise.category === selectedCategory) &&
      (selectedEquipment === "All" || exercise.equipment === selectedEquipment)
    );
  });

  // Handle form input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Open form for adding new exercise
  const openAddForm = () => {
    setEditingExercise(null);
    setFormData({
      name: "",
      category: "",
      equipment: "",
      description: "",
      gifUrl: "",
    });
    setShowForm(true);
  };

  // Open form for editing existing exercise
  const openEditForm = (exercise: any) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      category: exercise.category,
      equipment: exercise.equipment,
      description: exercise.description,
      gifUrl: exercise.photourl || exercise.gifUrl || "",
    });
    setShowForm(true);
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e?: any) => {
    if (e) e.preventDefault();

    try {
      const url = editingExercise
        ? `${process.env.NEXT_PUBLIC_API_URL}/${editingExercise._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/exercises`;

      const method = editingExercise ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          photourl: formData.gifUrl, // Map gifUrl to photourl for consistency
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${editingExercise ? "updating" : "adding"} exercise`
        );
      }

      const exerciseData = await response.json();
      console.log("Returned  exercise:", exerciseData);

      if (editingExercise) {
        setExercises(
          exercises.map((ex) =>
            ex._id === editingExercise._id ? exerciseData.exercise : ex
          )
        );
      } else {
        // Add new exercise to the list
        setExercises([...exercises, exerciseData.exercise]);
      }

      // Reset form and close modal
      setFormData({
        name: "",
        category: "",
        equipment: "",
        description: "",
        gifUrl: "",
      });
      setEditingExercise(null);
      setShowForm(false);
    } catch (err) {
      alert(
        `Error ${editingExercise ? "updating" : "adding"} exercise. Please try again.`
      );
      console.error(err);
    }
  };

  // Delete exercise
  const deleteExercise = async (exerciseId: string) => {
    if (!confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises/${exerciseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting exercise");
      }

      // Remove exercise from the list
      setExercises(exercises.filter((ex) => ex._id !== exerciseId));
    } catch (err) {
      alert("Error deleting exercise. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fitness Exercise Manager</h1>
          <div className="space-x-2">
            <button
              className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded"
              onClick={openAddForm}
            >
              Add Exercise
            </button>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category:
            </label>
            <select
              className="bg-white border border-gray-300 rounded px-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment:
            </label>
            <select
              className="bg-white border border-gray-300 rounded px-3 py-2"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
            >
              {equipmentTypes.map((equip) => (
                <option key={equip} value={equip}>
                  {equip}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading exercises...</p>
            </div>
          </div>
        ) : (
          /* Exercise grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                {/* Exercise image/GIF */}
                <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={exercise.photourl || "/api/placeholder/400/300"}
                    alt={`Animation of ${exercise.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {exercise.name}
                  </h2>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {exercise.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {exercise.equipment}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    {exercise.description}
                  </p>

                  {/* Action buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openEditForm(exercise)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExercise(exercise._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredExercises.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No exercises match the selected filters.
          </div>
        )}
      </div>

      {/* Modal for adding/editing exercise */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingExercise ? "Edit Exercise" : "Add New Exercise"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category:
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment:
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image/GIF URL:
                </label>
                <input
                  type="url"
                  name="gifUrl"
                  value={formData.gifUrl}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editingExercise ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
