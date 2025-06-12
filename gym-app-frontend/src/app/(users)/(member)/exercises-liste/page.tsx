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
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Dans une application réelle, envoyez les données au backend
      const response = await fetch("http://localhost:5000/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExercise),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'exercise");
      }

      const addedExercise = await response.json();

      // Ajouter le nouvel exercise à la liste
      setExercises([...exercises, addedExercise]);

      // Réinitialiser le formulaire
      setNewExercise({
        name: "",
        category: "",
        equipment: "",
        description: "",
        gifUrl: "",
      });

      setShowForm(false);
    } catch (err) {
      alert("Erreur lors de l'ajout de l'exercise. Veuillez réessayer.");
      console.error(err);
    }
  };

  // Créer une graine avec les données initiales
  const seedDatabase = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/seed", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de l'initialisation de la base de données"
        );
      }

      alert("Base de données initialisée avec succès!");
      // Recharger les exercises
      window.location.reload();
    } catch (err) {
      alert("Erreur lors de l'initialisation de la base de données");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Application d'Exercises de Fitness
          </h1>
          <div className="space-x-2">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => setShowForm(true)}
            >
              Ajouter un exercise
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={seedDatabase}
            >
              Initialiser la DB
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

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'exercise:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newExercise.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie:
                </label>
                <input
                  type="text"
                  name="category"
                  value={newExercise.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Équipement:
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={newExercise.equipment}
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
                  value={newExercise.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL du GIF:
                </label>
                <input
                  type="url"
                  name="gifUrl"
                  value={newExercise.gifUrl}
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
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
