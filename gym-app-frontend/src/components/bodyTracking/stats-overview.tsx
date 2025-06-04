import {
  Activity,
  BicepsFlexed,
  Droplet,
  Heart,
  Weight,
  Zap,
} from "lucide-react";
import React from "react";
import { BodyTrackingPiechart } from "./body-tracking-piechart";
import {
  BodyCompositionData,
  BodyTrackingEntry,
  ProgressSummary,
} from "@/app/(users)/types";
type Props = {
  calculateProgress: () => ProgressSummary | null;
  getLatestMetrics: () => BodyTrackingEntry | null;
  getProgressIndicator: (
    current: number | null,
    previous: number | null,
    inverse?: boolean
  ) => React.ReactElement | null;
  bodyTrackingData: BodyTrackingEntry[];
  getBodyCompositionData: () => BodyCompositionData[];
};
export default function StatsOverview({
  calculateProgress,
  getLatestMetrics,
  getProgressIndicator,
  bodyTrackingData,
  getBodyCompositionData,
}: Props) {
  return (
    <div>
      <div className="space-y-6">
        {/* Progress Summary */}
        {calculateProgress() && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="mr-2 text-red-500" />
              Progress Summary ({calculateProgress()!.days} days)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-2xl font-bold text-purple-900">
                  {calculateProgress()!.weightChange > 0 ? "+" : ""}
                  {calculateProgress()!.weightChange.toFixed(1)} kg
                </p>
                <p className="text-purple-600 text-sm">Weight Change</p>
              </div>
              <div
                className={`${calculateProgress()!.fatLoss > 0 ? "bg-red-50 p-4 rounded-lg border border-red-100 text-red-900" : "bg-green-50 p-4 rounded-lg border border-green-100 text-green-900"}`}
              >
                <p className="text-2xl font-bold ">
                  {calculateProgress()!.fatLoss > 0 ? "+" : ""}
                  {calculateProgress()!.fatLoss.toFixed(1)} kg
                </p>
                {calculateProgress()!.fatLoss > 0 ? (
                  <p className="text-red-600 text-sm">Fat Gain</p>
                ) : (
                  <p className="text-green-600 text-sm">Fat Loss</p>
                )}
              </div>
              <div
                className={`${calculateProgress()!.muscleGain < 0 ? "bg-red-50 p-4 rounded-lg border border-red-100 text-red-900" : "bg-green-50 p-4 rounded-lg border border-green-100 text-green-900"}`}
              >
                <p className="text-2xl font-bold ">
                  {calculateProgress()!.muscleGain < 0 ? "" : "+"}
                  {calculateProgress()!.muscleGain.toFixed(1)} kg
                </p>
                {calculateProgress()!.muscleGain < 0 ? (
                  <p className="text-red-600 text-sm">Muscle Loss</p>
                ) : (
                  <p className="text-green-600 text-sm">Muscle Gain</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Metrics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="mr-2" />
                Latest Metrics
              </h3>
              {getLatestMetrics() ? (
                <div className="grid grid-cols-2  gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <Weight className="text-purple-600" size={20} />
                      {bodyTrackingData.length > 1 &&
                        getProgressIndicator(
                          getLatestMetrics()!.weight,
                          bodyTrackingData[bodyTrackingData.length - 2].weight
                        )}
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {getLatestMetrics()!.weight} kg
                    </p>
                    <p className="text-blue-600 text-sm">Weight</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <BicepsFlexed className="text-green-600" size={20} />
                      {bodyTrackingData.length > 1 &&
                        getProgressIndicator(
                          getLatestMetrics()!.muscleMass,
                          bodyTrackingData[bodyTrackingData.length - 2]
                            .muscleMass
                        )}
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {getLatestMetrics()!.muscleMass} kg
                    </p>
                    <p className="text-green-600 text-sm">Muscle Mass</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <Droplet className="text-red-600 " size={20} />
                      {bodyTrackingData.length > 1 &&
                        getProgressIndicator(
                          bodyTrackingData[bodyTrackingData.length - 2].fatMass,
                          getLatestMetrics()!.fatMass
                        )}
                    </div>
                    <p className="text-2xl font-bold text-red-900">
                      {getLatestMetrics()!.fatMass} kg
                    </p>
                    <p className="text-red-600 text-sm">Fat Mass</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Droplet className="text-blue-600" size={20} />
                      {bodyTrackingData.length > 1 &&
                        getProgressIndicator(
                          getLatestMetrics()!.waterMass,
                          bodyTrackingData[bodyTrackingData.length - 2]
                            .waterMass
                        )}
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {getLatestMetrics()!.waterMass} kg
                    </p>
                    <p className="text-blue-600 text-sm">Water Mass</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">
                    No data available. Add your first entry!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Health Indicators */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2" />
                Health Indicators
              </h3>
              {getLatestMetrics() ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Visceral Fat</span>
                    <span className="font-semibold">
                      {getLatestMetrics()!.visceralFat}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Metabolic Rate</span>
                    <span className="font-semibold">
                      {getLatestMetrics()!.metabolicRate} kcal
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Metabolic Age</span>
                    <span className="font-semibold">
                      {getLatestMetrics()!.metabolicAge} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Bone Mass</span>
                    <span className="font-semibold">
                      {getLatestMetrics()!.boneMass} kg
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No data available
                </p>
              )}
            </div>
          </div>
          {/* Body Composition Pie Chart */}
          {getBodyCompositionData().length > 0 && (
            <BodyTrackingPiechart
              getBodyCompositionData={getBodyCompositionData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
