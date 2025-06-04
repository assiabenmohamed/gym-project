// "use client";
// import React from "react";
// import { useEffect, useState } from "react";

// export default function page() {
//   const [exercises, setExercises] = useState<any[]>([]);

//   useEffect(() => {
//     async function fetchExercises() {
//       const response = await fetch(
//         "https://exercisedb.p.rapidapi.com/exercises?limit=1000",
//         {
//           method: "GET",
//           headers: {
//             "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
//             "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Erreur lors de la récupération des exercices");
//       }

//       return response.json();
//     }
//     fetchExercises().then(setExercises).catch(console.error);
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Liste des exercices</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {exercises.slice(0, 1000).map((exercise) => (
//           <div key={exercise.id} className="border rounded-xl p-4 shadow-md">
//             <h2 className="text-lg font-semibold">{exercise.name}</h2>
//             <p>
//               <strong>Muscle :</strong> {exercise.target}
//             </p>
//             <p>
//               <strong>Équipement :</strong> {exercise.equipment}
//             </p>
//             <img
//               src={exercise.gifUrl}
//               alt={exercise.name}
//               className="mt-2 w-full h-40 object-contain"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
