import { BodyCompositionData } from "@/app/(users)/types";
import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
type Props = {
  getBodyCompositionData: () => BodyCompositionData[];
};
export function BodyTrackingPiechart({ getBodyCompositionData }: Props) {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Body Composition</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={getBodyCompositionData()}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              className="py-4"
            >
              {getBodyCompositionData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} kg`, "Mass"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
