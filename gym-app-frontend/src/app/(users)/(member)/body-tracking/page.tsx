"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { Calendar, TrendingUp, Activity, Target } from "lucide-react";
import type {
  BodyTrackingEntry,
  FormData,
  ChartDataPoint,
  BodyCompositionData,
  ProgressSummary,
  GoalInfo,
  UserRole,
  ActiveTab,
  User,
} from "../../types";
import BodyTrackingList from "@/components/bodyTracking/body-tracking-list";
import BodyTrackingChart from "@/components/bodyTracking/body-tracking-chart";
import StatsOverview from "@/components/bodyTracking/stats-overview";

export default function BodyTrackingSystem() {
  const [userRole, setUserRole] = useState<UserRole>("member");
  const [userId, setUserId] = useState<string>(""); // Correction: String -> string
  const [mockBodyData, setMockBodyData] = useState<BodyTrackingEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
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
    async function fetchData() {
      try {
        // 1. Charger l'utilisateur connecté
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            credentials: "include",
          }
        );

        if (!userRes.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const userData = await userRes.json();
        setUserRole(userData.role);
        setUserId(userData._id);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, []);

  // 1. Récupérer les données et les stocker dans mockBodyData
  useEffect(() => {
    async function fetchBody() {
      if (!userId) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bodyTracking/${userId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch body tracking data");
          return;
        }

        const data = await response.json();

        const formattedData = data.map((entry: any) => ({
          id: entry._id,
          user: entry.user,
          date: entry.date,
          weight: entry.weight,
          fatMass: entry.fatMass,
          muscleMass: entry.muscleMass,
          boneMass: entry.bonMass,
          visceralFat: entry.visceralFat,
          metabolicRate: entry.metabolicRate,
          metabolicAge: entry.metabolicAge,
          waterMass: entry.waterMass,
          note: entry.note,
        }));

        console.log("✅ formattedData", formattedData);
        setMockBodyData(formattedData);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error);
      }
    }

    fetchBody();
  }, [userId]);

  // 2. Trier les données une fois mockBodyData mis à jour
  useEffect(() => {
    console.log("📊 Données non triées :", mockBodyData);
    if (!userId || mockBodyData.length === 0) {
      setBodyTrackingData([]);
      return;
    }
    const sorted = [...mockBodyData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    console.log("📊 Données triées :", sorted);
    setBodyTrackingData(sorted);
  }, [mockBodyData, userId]);
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

  const getGoalBadge = (goal: any): React.ReactElement | null => {
    const goals: Record<any, GoalInfo> = {
      muscle_gain: {
        label: "Muscle Gain",
        color: "bg-green-100 text-green-800",
      },
      fat_loss: { label: "Fat Loss", color: "bg-red-100 text-red-800" },
      maintenance: { label: "Maintenance", color: "bg-blue-100 text-blue-800" },
    };

    const goalInfo = goals[goal];
    if (!goalInfo) return null;

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
      {user ? (
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
            </div>

            <div className="bg-gradient-to-r from-[#ffcccc]  to-[#f8d5d5] rounded-lg p-4 border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-[#a00000] mb-1">
                    Your Profile
                    {user.name}
                  </h2>
                  <p className="text-accent">{user.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {getGoalBadge(user.goal)}
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
            <StatsOverview
              calculateProgress={calculateProgress}
              getLatestMetrics={getLatestMetrics}
              getProgressIndicator={getProgressIndicator}
              bodyTrackingData={bodyTrackingData}
              getBodyCompositionData={getBodyCompositionData}
            />
          )}

          {/* Analytics Tab */}
          {activeTab === "chart" && <BodyTrackingChart chartData={chartData} />}

          {/* History Tab */}
          {activeTab === "history" && (
            <BodyTrackingList
              formData={formData}
              onChange={handleFormDataChange}
              editingEntry={editingEntry}
              bodyTrackingData={bodyTrackingData}
              role={userRole}
            />
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Target className="text-gray-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Users Found
              </h2>
              <p className="text-gray-600 mb-6">
                No members assigned yet. An admin needs to assign members before
                you can begin tracking progress.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Welcome to Body Tracking System
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Track weight & measurements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Monitor progress over time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Analyze body composition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
