import { ChartDataPoint } from "@/app/(users)/types";
import { TrendingUp } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type Props = {
  chartData: any;
};
export default function BodyTrackingChart({ chartData }: Props) {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-6">Progress Analytics</h3>
        {chartData.length > 0 ? (
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-medium mb-4">
                Weight & Body Composition Trends
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Weight (kg)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fatMass"
                    stroke="#EF4444"
                    strokeWidth={3}
                    name="Fat Mass (kg)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="muscleMass"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Muscle Mass (kg)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waterMass"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    name="Water Mass (kg)"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">
                Metabolic Rate Progress
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [`${value} kcal`, "Metabolic Rate"]}
                  />
                  <Bar
                    dataKey="metabolicRate"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">
              No data available for analytics
            </p>
            <p className="text-gray-400">
              Add some entries to see your progress charts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
