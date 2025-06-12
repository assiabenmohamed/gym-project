import type React from "react";
import { Edit2, Trash2, Target, Clock, User } from "lucide-react";
import { Exercise, Program, User as User1 } from "@/app/(users)/types/program";
import { ProgramModal } from "./program-modal";

interface ProgramCardProps {
  program: Program;
  onEdit: (program: Program) => void;
  onDelete: (id: string) => void;
  getUserName: (userId: string) => string;
  onSave: (
    programData: Partial<Program>,
    editingProgram: Program | null
  ) => Promise<void>;
  editingProgram: Program | null;
  users: User1[];
  exercises: Exercise[];
}

export default function ProgramCard({
  program,
  onEdit,
  onDelete,
  getUserName,
  onSave,
  editingProgram,
  users,
  exercises,
}: ProgramCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
        <div className="flex gap-2">
          {/* <button
            onClick={() => onEdit(program)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 size={18} />
          </button> */}
          <ProgramModal
            onSave={onSave}
            editingProgram={program}
            users={users}
            exercises={exercises}
            onEdit={onEdit}
            create={false}
          />
          <button
            onClick={() => onDelete(program._id!)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>Client: {getUserName(program.user)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>Duration: {program.duration} weeks</span>
        </div>
        {program.objective && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target size={16} />
            <span>Goal: {program.objective}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            program.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {program.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>{program.structure.length} workout(s) planned</p>
      </div>
    </div>
  );
}
