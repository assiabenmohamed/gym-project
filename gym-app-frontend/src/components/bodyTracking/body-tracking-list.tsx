import React from "react";
import { BodyTrackingForm } from "./body-tracking-form";
import { Calendar, Trash2 } from "lucide-react";
import { BodyTrackingEntry, FormData } from "@/app/(users)/types";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import BodyTrackingPDF from "./body-tracking-pdf";
type BodyTrackingListProps = {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  editingEntry?: any;
  handleEdit?: (entry: BodyTrackingEntry) => void;
  bodyTrackingData: BodyTrackingEntry[];
  handleDelete?: (id: string) => void;
};

export default function BodyTrackingList({
  formData,
  onChange,
  onSubmit,
  editingEntry,
  handleEdit,
  bodyTrackingData,
  handleDelete,
}: BodyTrackingListProps) {
  const handleOpenPdf = async () => {
    const doc = <BodyTrackingPDF bodyTrackingData={bodyTrackingData} />;
    const blob = await pdf(doc).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between"> 
          <h3 className="text-xl font-semibold">Entry History</h3>

          <button
            onClick={handleOpenPdf}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
          >
            open form pdf
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fat Mass
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Muscle Mass
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metabolic Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bodyTrackingData.length > 0 ? (
                bodyTrackingData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.weight} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.fatMass || "-"} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.muscleMass || "-"} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.metabolicRate || "-"} kcal
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {entry.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <BodyTrackingForm
                        formData={formData}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        editingEntry={editingEntry}
                        entry={entry}
                        handleEdit={handleEdit}
                        add={false}
                      />

                      <button
                        onClick={() => handleDelete?.(entry.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Calendar
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <p className="text-gray-500 text-lg">No entries found</p>
                    <p className="text-gray-400">
                      Add your first body tracking entry!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
