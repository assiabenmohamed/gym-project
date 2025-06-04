"use client";
import { useState, useEffect } from "react";
import type React from "react";

import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  UserIcon,
  Users,
  TrendingUp,
  Activity,
  Weight,
  Droplet,
  Zap,
  Target,
  Heart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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
    fatMass: 14.8,
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
      fatLoss: (first.fatMass || 0) - (latest.fatMass || 0),
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
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUserRole("member")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                    userRole === "member"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <UserIcon size={16} />
                  <span>Member</span>
                </button>
                <button
                  onClick={() => setUserRole("coach")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                    userRole === "coach"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Users size={16} />
                  <span>Coach</span>
                </button>
              </div>

              {userRole === "coach" && (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 transition-all shadow-sm"
              >
                <Plus size={16} />
                <span>Add Entry</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-1">
                  {userRole === "coach"
                    ? `Managing: ${getCurrentUser().name}`
                    : "Your Profile"}
                </h2>
                <p className="text-blue-700">{getCurrentUser().email}</p>
              </div>
              <div className="flex items-center space-x-3">
                {getGoalBadge(getCurrentUser().goal)}
                <Target className="text-blue-600" size={20} />
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
                      ? "border-blue-500 text-blue-600"
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
          <div className="space-y-6">
            {/* Progress Summary */}
            {calculateProgress() && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Heart className="mr-2 text-red-500" />
                  Progress Summary ({calculateProgress()!.days} days)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-2xl font-bold text-blue-900">
                      {calculateProgress()!.weightChange > 0 ? "+" : ""}
                      {calculateProgress()!.weightChange.toFixed(1)} kg
                    </p>
                    <p className="text-blue-600 text-sm">Weight Change</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-2xl font-bold text-red-900">
                      -{calculateProgress()!.fatLoss.toFixed(1)} kg
                    </p>
                    <p className="text-red-600 text-sm">Fat Loss</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-2xl font-bold text-green-900">
                      +{calculateProgress()!.muscleGain.toFixed(1)} kg
                    </p>
                    <p className="text-green-600 text-sm">Muscle Gain</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest Metrics */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Activity className="mr-2" />
                    Latest Metrics
                  </h3>
                  {getLatestMetrics() ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <Weight className="text-blue-600" size={20} />
                          {bodyTrackingData.length > 1 &&
                            getProgressIndicator(
                              getLatestMetrics()!.weight,
                              bodyTrackingData[bodyTrackingData.length - 2]
                                .weight
                            )}
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {getLatestMetrics()!.weight} kg
                        </p>
                        <p className="text-blue-600 text-sm">Weight</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="text-green-600" size={20} />
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
                          <Activity className="text-red-600" size={20} />
                          {bodyTrackingData.length > 1 &&
                            getProgressIndicator(
                              bodyTrackingData[bodyTrackingData.length - 2]
                                .fatMass,
                              getLatestMetrics()!.fatMass
                            )}
                        </div>
                        <p className="text-2xl font-bold text-red-900">
                          {getLatestMetrics()!.fatMass} kg
                        </p>
                        <p className="text-red-600 text-sm">Fat Mass</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <Droplet className="text-purple-600" size={20} />
                          {bodyTrackingData.length > 1 &&
                            getProgressIndicator(
                              getLatestMetrics()!.waterMass,
                              bodyTrackingData[bodyTrackingData.length - 2]
                                .waterMass
                            )}
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {getLatestMetrics()!.waterMass} kg
                        </p>
                        <p className="text-purple-600 text-sm">Water Mass</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
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

                {/* Body Composition Pie Chart */}
                {getBodyCompositionData().length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      Body Composition
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={getBodyCompositionData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getBodyCompositionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} kg`, "Mass"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "chart" && (
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
                        formatter={(value) => [
                          `${value} kcal`,
                          "Metabolic Rate",
                        ]}
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
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Entry History</h3>
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
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-blue-600 hover:text-blue-900 mr-3 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Edit entry"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
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
                        <p className="text-gray-500 text-lg">
                          No entries found
                        </p>
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
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold">
                  {editingEntry ? "Edit Entry" : "Add New Entry"}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingEntry
                    ? "Update your body tracking data"
                    : "Record your latest measurements"}
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleFormDataChange("date", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("weight", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("fatMass", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("muscleMass", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("boneMass", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("visceralFat", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("metabolicRate", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("metabolicAge", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormDataChange("waterMass", e.target.value)
                      }
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
                    onChange={(e) =>
                      handleFormDataChange("note", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Add any notes about this measurement..."
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingEntry(null);
                      resetForm();
                    }}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.weight}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {editingEntry ? "Update Entry" : "Add Entry"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
