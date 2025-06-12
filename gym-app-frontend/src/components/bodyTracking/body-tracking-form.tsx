import { BodyTrackingEntry, FormData } from "@/app/(users)/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Plus } from "lucide-react";
import { useState } from "react";
type BodyTrackingFormProps = {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onSubmit?: () => void;
  editingEntry?: any;
  entry?: BodyTrackingEntry;
  handleEdit?: (entry: BodyTrackingEntry) => void;
  add: boolean;
};
export function BodyTrackingForm({
  formData,
  onChange,
  onSubmit,
  editingEntry,
  entry,
  handleEdit,
  add,
}: BodyTrackingFormProps) {
  const [open, setOpen] = useState(false);
  const handleSubmitAndClose = () => {
    onSubmit?.();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {add ? (
          <button className="bg-gradient-to-r from-accent/70 to-accent text-white px-6 py-2 rounded-lg hover:from-accent/60 hover:to-accent/90 flex items-center space-x-2 transition-all shadow-sm">
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        ) : (
          <button
            onClick={() => handleEdit?.(entry!)}
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
            {editingEntry ? "Edit Entry" : "Add New Entry"}
          </DialogTitle>
          <p className="text-gray-600 mt-1">
            {editingEntry
              ? "Update your body tracking data"
              : "Record your latest measurements"}
          </p>
        </DialogHeader>
        <div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => onChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => onChange("weight", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="75.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat Mass (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fatMass}
                  onChange={(e) => onChange("fatMass", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="15.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Muscle Mass (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.muscleMass}
                  onChange={(e) => onChange("muscleMass", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="42.8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bone Mass (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.boneMass}
                  onChange={(e) => onChange("boneMass", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="3.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visceral Fat
                </label>
                <input
                  type="number"
                  value={formData.visceralFat}
                  onChange={(e) => onChange("visceralFat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metabolic Rate (kcal)
                </label>
                <input
                  type="number"
                  value={formData.metabolicRate}
                  onChange={(e) => onChange("metabolicRate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="1650"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metabolic Age (years)
                </label>
                <input
                  type="number"
                  value={formData.metabolicAge}
                  onChange={(e) => onChange("metabolicAge", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="28"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Mass (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waterMass}
                  onChange={(e) => onChange("waterMass", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="55.8"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => onChange("note", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Add any notes about this measurement..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmitAndClose}
                disabled={!formData.weight}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {editingEntry ? "Update Entry" : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
