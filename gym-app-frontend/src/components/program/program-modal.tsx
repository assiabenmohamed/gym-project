import { Exercise, Program, User } from "@/app/(users)/types/program";
import type React from "react";
import { useState, useEffect } from "react";
import { WorkoutStructureForm } from "./workout-structure-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Edit3, Plus } from "lucide-react";

interface ProgramModalProps {
  onSave: (
    programData: Partial<Program>,
    editingProgram: Program | null
  ) => Promise<void>;
  editingProgram: Program | null;
  users: User[];
  exercises: Exercise[];
  onEdit?: (program: Program) => void;
  create: boolean;
  onCreate?: () => void;
}

export function ProgramModal({
  onSave,
  editingProgram,
  users,
  exercises,
  onEdit,
  create,
  onCreate,
}: ProgramModalProps) {
  const [formData, setFormData] = useState<Partial<Program>>({
    name: "",
    duration: 8,
    isActive: true,
    objective: "",
    user: "",
    trainer: "",
    structure: [],
  });
  console.log("Liste des utilisateurs : ", users);

  useEffect(() => {
    if (editingProgram) {
      setFormData(editingProgram);
    } else {
      setFormData({
        name: "",
        duration: 8,
        isActive: true,
        objective: "",
        user: "",
        trainer: "",
        structure: [],
      });
    }
  }, [editingProgram]);

  const [open, setOpen] = useState(false);
  const handleSubmitAndClose = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, editingProgram);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {create ? (
          <button
            className="bg-gradient-to-r from-accent/70 to-accent text-white px-6 py-2 rounded-lg hover:from-accent/60 hover:to-accent/90 flex items-center space-x-2 transition-all shadow-sm"
            onClick={onCreate}
          >
            <Plus size={16} />
            <span>Create Program</span>
          </button>
        ) : (
          <button
            onClick={() => onEdit!(editingProgram!)}
            className="text-blue-600 hover:text-blue-900 mr-3 p-1 hover:bg-blue-50 rounded transition-colors"
            title="Edit entry"
          >
            <Edit3 size={16} />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold">
            {editingProgram ? "Edit Program" : "Create New Program"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitAndClose} className="space-y-6">
          <div className="grid grid-cols-1  gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (weeks)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: Number.parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objective
            </label>
            <textarea
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Active Program
              </span>
            </label>
          </div>

          <WorkoutStructureForm
            workoutStructure={formData.structure || []}
            exercises={exercises}
            onChange={(structure) =>
              setFormData({ ...formData, structure: structure })
            }
          />

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingProgram ? "Update" : "Create"} Program
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
