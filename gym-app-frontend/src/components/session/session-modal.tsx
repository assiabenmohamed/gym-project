import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Target } from "lucide-react";
import { Exercise, Program, Session, User } from "@/app/(users)/types/session";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: Partial<Session>;
  setCurrentSession: (session: Partial<Session>) => void;
  selectedProgram: Program | null;
  programs: Program[];
  user: User;
  exercises: Exercise[];
  onSave: () => void;
  onProgramSelect: (programId: string) => void;
}

export default function SessionModal({
  isOpen,
  onClose,
  currentSession,
  setCurrentSession,
  selectedProgram,
  programs,
  exercises,
  onSave,
  onProgramSelect,
}: SessionModalProps) {
  const getExerciseName = (exerciseId: string) => {
    return (
      exercises.find((e) => e._id === exerciseId)?.name || "Unknown Exercise"
    );
  };

  // Fonction pour obtenir les répétitions du programme
  const getProgramRepetitions = (
    categoryIndex: number,
    exerciseIndex: number,
    setIndex: number
  ) => {
    if (!selectedProgram?.structure) return 0;

    const programCategory = selectedProgram.structure[categoryIndex];
    if (!programCategory?.exercises) return 0;

    const programExercise = programCategory.exercises[exerciseIndex];
    if (!programExercise?.sets) return 0;

    const programSet = programExercise.sets[setIndex];
    return programSet?.repetition || 0;
  };

  const updateSetData = (
    categoryIndex: number,
    exerciseIndex: number,
    setIndex: number,
    field: "repetition" | "weight",
    value: number
  ) => {
    const updatedCategories = [...(currentSession.categories || [])];
    updatedCategories[categoryIndex].exercises[exerciseIndex].sets[setIndex][
      field
    ] = value;
    setCurrentSession({
      ...currentSession,
      categories: updatedCategories,
    });
  };

  // Fonction pour initialiser les valeurs avec celles du programme
  const getDisplayValue = (
    set: any,
    field: "repetition" | "weight",
    programValue: number
  ) => {
    // Si la valeur du set est 0 ou undefined, utiliser la valeur du programme
    if (field === "repetition") {
      return set.repetition === 0 || set.repetition === undefined
        ? programValue
        : set.repetition;
    }
    return set[field] || 0;
  };

  // Fonction pour initialiser une session avec les valeurs du programme
  const initializeSessionWithProgramValues = () => {
    if (!selectedProgram || !currentSession.categories) return;

    const updatedCategories = currentSession.categories.map(
      (category, categoryIndex) => ({
        ...category,
        exercises: category.exercises.map((exercise, exerciseIndex) => ({
          ...exercise,
          sets: exercise.sets.map((set, setIndex) => {
            const programReps = getProgramRepetitions(
              categoryIndex,
              exerciseIndex,
              setIndex
            );
            return {
              ...set,
              repetition:
                set.repetition === 0 || set.repetition === undefined
                  ? programReps
                  : set.repetition,
            };
          }),
        })),
      })
    );

    setCurrentSession({
      ...currentSession,
      categories: updatedCategories,
    });
  };

  // Effect pour initialiser les valeurs quand le programme change
  React.useEffect(() => {
    if (selectedProgram && currentSession.categories) {
      initializeSessionWithProgramValues();
    }
  }, [selectedProgram?._id]); // Déclenché seulement quand le programme change

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentSession._id ? "Edit Session" : "New Workout Session"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Select Program</Label>
              <Select
                value={currentSession.program}
                onValueChange={onProgramSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs
                    .filter((p) => p.isActive)
                    .map((program) => (
                      <SelectItem key={program._id} value={program._id}>
                        {program.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={
                  currentSession.date
                    ? new Date(currentSession.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setCurrentSession({
                    ...currentSession,
                    date: new Date(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Workout Categories */}
          {selectedProgram && currentSession.categories && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Workout Structure
              </h3>

              {currentSession.categories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target size={20} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="bg-muted rounded-lg p-4"
                      >
                        <h5 className="font-medium text-gray-700 mb-3">
                          {getExerciseName(exercise.name)}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {exercise.sets.map((set, setIndex) => {
                            const programReps = getProgramRepetitions(
                              categoryIndex,
                              exerciseIndex,
                              setIndex
                            );

                            return (
                              <Card key={setIndex}>
                                <CardContent className="p-3">
                                  <div className="text-sm font-medium text-muted-foreground mb-2">
                                    Set {setIndex + 1}
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <Label className="text-xs">
                                        Reps (Target: {programReps})
                                      </Label>
                                      <Input
                                        type="number"
                                        value={set.repetition || programReps}
                                        onChange={(e) =>
                                          updateSetData(
                                            categoryIndex,
                                            exerciseIndex,
                                            setIndex,
                                            "repetition",
                                            Number.parseInt(e.target.value) ||
                                              programReps
                                          )
                                        }
                                        min="0"
                                        className="h-8"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">
                                        Weight (kg)
                                      </Label>
                                      <Input
                                        type="number"
                                        value={set.weight || 0}
                                        onChange={(e) =>
                                          updateSetData(
                                            categoryIndex,
                                            exerciseIndex,
                                            setIndex,
                                            "weight",
                                            Number.parseFloat(e.target.value) ||
                                              0
                                          )
                                        }
                                        min="0"
                                        step="0.5"
                                        className="h-8"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={!selectedProgram || !currentSession.user}
            >
              <Save size={18} className="mr-2" />
              Save Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
