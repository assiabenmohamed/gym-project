"use client";
import { useState, useEffect } from "react";
import type React from "react";

import {
  Calendar,
  TrendingUp,
  Activity,
  Weight,
  Droplet,
  Zap,
  Target,
  Heart,
  BicepsFlexed,
} from "lucide-react";
import type {
  BodyTrackingEntry,
  FormData,
  ChartDataPoint,
  BodyCompositionData,
  ProgressSummary,
  GoalInfo,
  UserRole,
  ActiveTab,
} from "../../types";
import { BodyTrackingForm } from "@/components/bodyTracking/body-tracking-form";
import BodyTrackingList from "@/components/bodyTracking/body-tracking-list";
import { BodyTrackingPiechart } from "@/components/bodyTracking/body-tracking-piechart";
import BodyTrackingChart from "@/components/bodyTracking/body-tracking-chart";
import StatsOverview from "@/components/bodyTracking/stats-overview";

const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    goal: "muscle_gain",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    goal: "fat_loss",
  },
  {
    id: "user3",
    name: "Mike Johnson",
    email: "mike@example.com",
    goal: "maintenance",
  },
];

const mockBodyData: BodyTrackingEntry[] = [
  {
    id: "1",
    user: "user1",
    date: "2024-01-15",
    weight: 75.5,
    fatMass: 15.2,
    muscleMass: 42.8,
    boneMass: 3.2,
    visceralFat: 8,
    metabolicRate: 1650,
    metabolicAge: 28,
    waterMass: 55.8,
    note: "Feeling good, consistent training",
  },
  {
    id: "2",
    user: "user1",
    date: "2024-01-22",
    weight: 74.8,
    fatMass: 16.8,
    muscleMass: 43.2,
    boneMass: 3.2,
    visceralFat: 7,
    metabolicRate: 1680,
    metabolicAge: 27,
    waterMass: 56.2,
    note: "Good progress this week",
  },
  {
    id: "3",
    user: "user1",
    date: "2024-01-29",
    weight: 74.2,
    fatMass: 14.3,
    muscleMass: 43.8,
    boneMass: 3.3,
    visceralFat: 6,
    metabolicRate: 1710,
    metabolicAge: 26,
    waterMass: 56.8,
    note: "Excellent results!",
  },
  {
    id: "4",
    user: "user1",
    date: "2024-02-05",
    weight: 73.9,
    fatMass: 13.8,
    muscleMass: 44.2,
    boneMass: 3.3,
    visceralFat: 5,
    metabolicRate: 1740,
    metabolicAge: 25,
    waterMass: 57.1,
    note: "Best results yet!",
  },
];

export default function BodyTrackingSystem() {
  const [userRole, setUserRole] = useState<UserRole>("member");
  const [selectedUserId, setSelectedUserId] = useState<string>("user1");
  const [bodyTrackingData, setBodyTrackingData] = useState<BodyTrackingEntry[]>(
    []
  );
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<BodyTrackingEntry | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    fatMass: "",
    muscleMass: "",
    boneMass: "",
    visceralFat: "",
    metabolicRate: "",
    metabolicAge: "",
    waterMass: "",
    note: "",
  });

  useEffect(() => {
    const filteredData = mockBodyData.filter((entry) =>
      userRole === "coach"
        ? entry.user === selectedUserId
        : entry.user === "user1"
    );
    setBodyTrackingData(
      filteredData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  }, [selectedUserId, userRole]);

  const handleSubmit = (): void => {
    if (!formData.weight) return;

    const newEntry: BodyTrackingEntry = {
      id: Date.now().toString(),
      user: userRole === "coach" ? selectedUserId : "user1",
      date: formData.date,
      weight: Number.parseFloat(formData.weight),
      fatMass: formData.fatMass ? Number.parseFloat(formData.fatMass) : null,
      muscleMass: formData.muscleMass
        ? Number.parseFloat(formData.muscleMass)
        : null,
      boneMass: formData.boneMass ? Number.parseFloat(formData.boneMass) : null,
      visceralFat: formData.visceralFat
        ? Number.parseFloat(formData.visceralFat)
        : null,
      metabolicRate: formData.metabolicRate
        ? Number.parseFloat(formData.metabolicRate)
        : null,
      metabolicAge: formData.metabolicAge
        ? Number.parseFloat(formData.metabolicAge)
        : null,
      waterMass: formData.waterMass
        ? Number.parseFloat(formData.waterMass)
        : null,
      note: formData.note,
    };

    if (editingEntry) {
      setBodyTrackingData((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry.id
            ? { ...newEntry, id: editingEntry.id }
            : entry
        )
      );
      setEditingEntry(null);
    } else {
      setBodyTrackingData((prev) =>
        [...prev, newEntry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    }

    resetForm();
  };

  const resetForm = (): void => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      weight: "",
      fatMass: "",
      muscleMass: "",
      boneMass: "",
      visceralFat: "",
      metabolicRate: "",
      metabolicAge: "",
      waterMass: "",
      note: "",
    });
    setShowForm(false);
  };

  const handleEdit = (entry: BodyTrackingEntry): void => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      weight: entry.weight.toString(),
      fatMass: entry.fatMass ? entry.fatMass.toString() : "",
      muscleMass: entry.muscleMass ? entry.muscleMass.toString() : "",
      boneMass: entry.boneMass ? entry.boneMass.toString() : "",
      visceralFat: entry.visceralFat ? entry.visceralFat.toString() : "",
      metabolicRate: entry.metabolicRate ? entry.metabolicRate.toString() : "",
      metabolicAge: entry.metabolicAge ? entry.metabolicAge.toString() : "",
      waterMass: entry.waterMass ? entry.waterMass.toString() : "",
      note: entry.note || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setBodyTrackingData((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const chartData: ChartDataPoint[] = bodyTrackingData.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weight: entry.weight,
    fatMass: entry.fatMass,
    muscleMass: entry.muscleMass,
    waterMass: entry.waterMass,
    metabolicRate: entry.metabolicRate,
  }));

  const getCurrentUser = (): any => {
    return mockUsers.find((user) => user.id === selectedUserId) || mockUsers[0];
  };

  const getLatestMetrics = (): BodyTrackingEntry | null => {
    if (bodyTrackingData.length === 0) return null;
    return bodyTrackingData[bodyTrackingData.length - 1];
  };

  const getProgressIndicator = (
    current: number | null,
    previous: number | null,
    inverse = false
  ): React.ReactElement | null => {
    if (!previous || !current) return null;
    const diff = current - previous;
    const isPositive = inverse ? diff < 0 : diff > 0;
    return (
      <span
        className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? "↗" : "↘"} {Math.abs(diff).toFixed(1)}
      </span>
    );
  };

  const getBodyCompositionData = (): BodyCompositionData[] => {
    const latest = getLatestMetrics();
    if (!latest) return [];

    return [
      { name: "Muscle Mass", value: latest.muscleMass || 0, color: "#10B981" },
      { name: "Fat Mass", value: latest.fatMass || 0, color: "#EF4444" },
      { name: "Water Mass", value: latest.waterMass || 0, color: "#3B82F6" },
      { name: "Bone Mass", value: latest.boneMass || 0, color: "#8B5CF6" },
    ].filter((item) => item.value > 0);
  };

  const getGoalBadge = (goal: any): React.ReactElement => {
    const goals: Record<any, GoalInfo> = {
      muscle_gain: {
        label: "Muscle Gain",
        color: "bg-green-100 text-green-800",
      },
      fat_loss: { label: "Fat Loss", color: "bg-red-100 text-red-800" },
      maintenance: { label: "Maintenance", color: "bg-blue-100 text-blue-800" },
    };

    const goalInfo = goals[goal];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${goalInfo.color}`}
      >
        {goalInfo.label}
      </span>
    );
  };

  const calculateProgress = (): ProgressSummary | null => {
    if (bodyTrackingData.length < 2) return null;

    const first = bodyTrackingData[0];
    const latest = bodyTrackingData[bodyTrackingData.length - 1];

    return {
      weightChange: latest.weight - first.weight,
      fatLoss: -1 * ((first.fatMass || 0) - (latest.fatMass || 0)),
      muscleGain: (latest.muscleMass || 0) - (first.muscleMass || 0),
      days: Math.ceil(
        (new Date(latest.date).getTime() - new Date(first.date).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };
  };

  const handleFormDataChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Activity },
    { id: "chart" as const, label: "Analytics", icon: TrendingUp },
    { id: "history" as const, label: "History", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Body Tracking System
              </h1>
              <p className="text-gray-600">
                Track your fitness journey with precision
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <BodyTrackingForm
                formData={formData}
                onChange={handleFormDataChange}
                onSubmit={handleSubmit}
                editingEntry={editingEntry}
                add={true}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#ffcccc]  to-[#f8d5d5] rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-[#a00000] mb-1">
                  Managing: {getCurrentUser().name}
                </h2>
                <p className="text-accent">{getCurrentUser().email}</p>
              </div>
              <div className="flex items-center space-x-3">
                {getGoalBadge(getCurrentUser().goal)}
                <Target className="text-accent" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          //   <div className="space-y-6">
          //     {/* Progress Summary */}
          //     {calculateProgress() && (
          //       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          //         <h3 className="text-xl font-semibold mb-4 flex items-center">
          //           <Heart className="mr-2 text-red-500" />
          //           Progress Summary ({calculateProgress()!.days} days)
          //         </h3>
          //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          //           <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          //             <p className="text-2xl font-bold text-purple-900">
          //               {calculateProgress()!.weightChange > 0 ? "+" : ""}
          //               {calculateProgress()!.weightChange.toFixed(1)} kg
          //             </p>
          //             <p className="text-purple-600 text-sm">Weight Change</p>
          //           </div>
          //           <div
          //             className={`${calculateProgress()!.fatLoss > 0 ? "bg-red-50 p-4 rounded-lg border border-red-100 text-red-900" : "bg-green-50 p-4 rounded-lg border border-green-100 text-green-900"}`}
          //           >
          //             <p className="text-2xl font-bold ">
          //               {calculateProgress()!.fatLoss > 0 ? "+" : ""}
          //               {calculateProgress()!.fatLoss.toFixed(1)} kg
          //             </p>
          //             {calculateProgress()!.fatLoss > 0 ? (
          //               <p className="text-red-600 text-sm">Fat Gain</p>
          //             ) : (
          //               <p className="text-green-600 text-sm">Fat Loss</p>
          //             )}
          //           </div>
          //           <div
          //             className={`${calculateProgress()!.muscleGain < 0 ? "bg-red-50 p-4 rounded-lg border border-red-100 text-red-900" : "bg-green-50 p-4 rounded-lg border border-green-100 text-green-900"}`}
          //           >
          //             <p className="text-2xl font-bold ">
          //               {calculateProgress()!.muscleGain < 0 ? "" : "+"}
          //               {calculateProgress()!.muscleGain.toFixed(1)} kg
          //             </p>
          //             {calculateProgress()!.muscleGain < 0 ? (
          //               <p className="text-red-600 text-sm">Muscle Loss</p>
          //             ) : (
          //               <p className="text-green-600 text-sm">Muscle Gain</p>
          //             )}
          //           </div>
          //         </div>
          //       </div>
          //     )}

          //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          //       {/* Latest Metrics */}
          //       <div className="lg:col-span-1">
          //         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          //           <h3 className="text-xl font-semibold mb-4 flex items-center">
          //             <Activity className="mr-2" />
          //             Latest Metrics
          //           </h3>
          //           {getLatestMetrics() ? (
          //             <div className="grid grid-cols-2  gap-4">
          //               <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          //                 <div className="flex items-center justify-between mb-2">
          //                   <Weight className="text-purple-600" size={20} />
          //                   {bodyTrackingData.length > 1 &&
          //                     getProgressIndicator(
          //                       getLatestMetrics()!.weight,
          //                       bodyTrackingData[bodyTrackingData.length - 2]
          //                         .weight
          //                     )}
          //                 </div>
          //                 <p className="text-2xl font-bold text-blue-900">
          //                   {getLatestMetrics()!.weight} kg
          //                 </p>
          //                 <p className="text-blue-600 text-sm">Weight</p>
          //               </div>
          //               <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          //                 <div className="flex items-center justify-between mb-2">
          //                   <BicepsFlexed className="text-green-600" size={20} />
          //                   {bodyTrackingData.length > 1 &&
          //                     getProgressIndicator(
          //                       getLatestMetrics()!.muscleMass,
          //                       bodyTrackingData[bodyTrackingData.length - 2]
          //                         .muscleMass
          //                     )}
          //                 </div>
          //                 <p className="text-2xl font-bold text-green-900">
          //                   {getLatestMetrics()!.muscleMass} kg
          //                 </p>
          //                 <p className="text-green-600 text-sm">Muscle Mass</p>
          //               </div>
          //               <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          //                 <div className="flex items-center justify-between mb-2">
          //                   <Droplet className="text-red-600 " size={20} />
          //                   {bodyTrackingData.length > 1 &&
          //                     getProgressIndicator(
          //                       bodyTrackingData[bodyTrackingData.length - 2]
          //                         .fatMass,
          //                       getLatestMetrics()!.fatMass
          //                     )}
          //                 </div>
          //                 <p className="text-2xl font-bold text-red-900">
          //                   {getLatestMetrics()!.fatMass} kg
          //                 </p>
          //                 <p className="text-red-600 text-sm">Fat Mass</p>
          //               </div>
          //               <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          //                 <div className="flex items-center justify-between mb-2">
          //                   <Droplet className="text-blue-600" size={20} />
          //                   {bodyTrackingData.length > 1 &&
          //                     getProgressIndicator(
          //                       getLatestMetrics()!.waterMass,
          //                       bodyTrackingData[bodyTrackingData.length - 2]
          //                         .waterMass
          //                     )}
          //                 </div>
          //                 <p className="text-2xl font-bold text-blue-900">
          //                   {getLatestMetrics()!.waterMass} kg
          //                 </p>
          //                 <p className="text-blue-600 text-sm">Water Mass</p>
          //               </div>
          //             </div>
          //           ) : (
          //             <div className="text-center py-8">
          //               <Activity
          //                 className="mx-auto text-gray-400 mb-4"
          //                 size={48}
          //               />
          //               <p className="text-gray-500">
          //                 No data available. Add your first entry!
          //               </p>
          //             </div>
          //           )}
          //         </div>
          //       </div>

          //       {/* Health Indicators */}
          //       <div className="space-y-6">
          //         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          //           <h3 className="text-xl font-semibold mb-4 flex items-center">
          //             <Zap className="mr-2" />
          //             Health Indicators
          //           </h3>
          //           {getLatestMetrics() ? (
          //             <div className="space-y-4">
          //               <div className="flex justify-between items-center py-2 border-b border-gray-100">
          //                 <span className="text-gray-600">Visceral Fat</span>
          //                 <span className="font-semibold">
          //                   {getLatestMetrics()!.visceralFat}
          //                 </span>
          //               </div>
          //               <div className="flex justify-between items-center py-2 border-b border-gray-100">
          //                 <span className="text-gray-600">Metabolic Rate</span>
          //                 <span className="font-semibold">
          //                   {getLatestMetrics()!.metabolicRate} kcal
          //                 </span>
          //               </div>
          //               <div className="flex justify-between items-center py-2 border-b border-gray-100">
          //                 <span className="text-gray-600">Metabolic Age</span>
          //                 <span className="font-semibold">
          //                   {getLatestMetrics()!.metabolicAge} years
          //                 </span>
          //               </div>
          //               <div className="flex justify-between items-center py-2">
          //                 <span className="text-gray-600">Bone Mass</span>
          //                 <span className="font-semibold">
          //                   {getLatestMetrics()!.boneMass} kg
          //                 </span>
          //               </div>
          //             </div>
          //           ) : (
          //             <p className="text-gray-500 text-center py-4">
          //               No data available
          //             </p>
          //           )}
          //         </div>
          //       </div>
          //       {/* Body Composition Pie Chart */}
          //       {getBodyCompositionData().length > 0 && (
          //         <BodyTrackingPiechart
          //           getBodyCompositionData={getBodyCompositionData}
          //         />
          //       )}
          //     </div>
          //   </div>
          <StatsOverview
            calculateProgress={calculateProgress}
            getLatestMetrics={getLatestMetrics}
            getProgressIndicator={getProgressIndicator}
            bodyTrackingData={bodyTrackingData}
            getBodyCompositionData={getBodyCompositionData}
          ></StatsOverview>
        )}

        {/* Analytics Tab */}
        {activeTab === "chart" && (
          <BodyTrackingChart chartData={chartData}></BodyTrackingChart>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <BodyTrackingList
            formData={formData}
            onChange={handleFormDataChange}
            onSubmit={handleSubmit}
            editingEntry={editingEntry}
            bodyTrackingData={bodyTrackingData}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
