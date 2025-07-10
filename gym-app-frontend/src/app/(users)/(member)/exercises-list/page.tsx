"use client";
import { useState, useEffect } from "react";

export default function ExerciseApp() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // État pour le formulaire d'ajout d'exercicse
  const [showForm, setShowForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    category: "",
    equipment: "",
    description: "",
    gifUrl: "",
  });

  // Extraction des catégories et équipements uniques
  const categories =
    exercises.length > 0
      ? ["All", ...new Set(exercises.map((ex) => ex.category))]
      : ["All"];

  const equipmentTypes =
    exercises.length > 0
      ? ["All", ...new Set(exercises.map((ex) => ex.equipment))]
      : ["All"];

  // Charger les exercises depuis l'API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        // Dans une application réelle, remplacez cette URL par votre backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exercises`
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des exercises");
        }

        const data = await response.json();
        setExercises(data);
        setError(null);
      } catch (err) {
        setError(
          "Impossible de charger les exercises. Utilisation des données de démonstration."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filtrer les exercises en fonction des sélections
  const filteredExercises = exercises.filter((exercise) => {
    return (
      (selectedCategory === "All" || exercise.category === selectedCategory) &&
      (selectedEquipment === "All" || exercise.equipment === selectedEquipment)
    );
  });

  // Gérer le changement du formulaire
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value,
    });
  };

  // Gérer la soumission du formulaire

  return (
    <div className=" min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Exercise List</h1>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie:
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
              Équipement:
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

        {/* État de chargement */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Chargement des exercises...</p>
            </div>
          </div>
        ) : (
          /* Grille d'exercises */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                {/* Image GIF de l'exersice */}
                <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={exercise.photourl || "/api/placeholder/400/300"}
                    alt={`Animation de ${exercise.name}`}
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
                  <p className="text-gray-700 text-sm">
                    {exercise.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredExercises.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun exercise ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>

      {/* Modal pour ajouter un exercise */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un nouvel exercise</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
