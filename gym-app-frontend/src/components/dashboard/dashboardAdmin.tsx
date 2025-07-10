import React, { useState, useEffect } from "react";
import { Users, DollarSign, Dumbbell, AlertCircle } from "lucide-react";
import StatCard from "./statCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AttendanceTracker from "./atendance-track";

// Type definitions
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  joined: string;
}

const COLORS = ["#FF6384", "#36A2EB"]; // Rose pour femme, bleu pour homme

// Not Found Component
const NotFound = ({ type, onRetry }: { type: string; onRetry: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No {type} Found
    </h3>
    <p className="text-gray-500 mb-4">
      We couldn't find any {type.toLowerCase()} data. This might be due to a
      connection issue or no data available.
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Loading Component
const LoadingCard = ({ title }: { title: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
    <p className="text-center text-gray-500 mt-2">Loading {title}...</p>
  </div>
);

// Dashboard Component
export default function DashboardAdmin({
  title = "Admin Dashboard",
  theme = "light",
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [Total, setTotal] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [TotalPayments, setTotalPayments] = useState(0);
  const [MonthlyPayments, setMonthlyPayments] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [newTrainers, setNewTrainers] = useState(0);
  const [monthspayements, setMonthspayements] = useState<any[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState({
    users: true,
    trainers: true,
    payments: true,
  });

  const [errors, setErrors] = useState({
    users: false,
    trainers: false,
    payments: false,
  });

  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      setErrors((prev) => ({ ...prev, users: false }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/members`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setErrors((prev) => ({ ...prev, users: true }));
        return;
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const usersThisMonth = data.filter((user: any) => {
        const createdAt = new Date(user.createdAt);
        return (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      });

      const femaleCount = data.filter(
        (user: any) => user.gender === "female"
      ).length;
      const maleCount = data.filter(
        (user: any) => user.gender === "male"
      ).length;

      setData([
        { name: "Females", value: femaleCount },
        { name: "Males", value: maleCount },
      ]);
      setUsers(data);
      setTotal(data.length);
      setNewUsers(usersThisMonth.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrors((prev) => ({ ...prev, users: true }));
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchTrainer = async () => {
    try {
      setLoading((prev) => ({ ...prev, trainers: true }));
      setErrors((prev) => ({ ...prev, trainers: false }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/trainers`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trainers");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setErrors((prev) => ({ ...prev, trainers: true }));
        return;
      }

      setTotalTrainers(data.length);
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const usersThisMonth = data.filter((user: any) => {
        const createdAt = new Date(user.createdAt);
        return (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      });
      setNewTrainers(usersThisMonth.length);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setErrors((prev) => ({ ...prev, trainers: true }));
    } finally {
      setLoading((prev) => ({ ...prev, trainers: false }));
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading((prev) => ({ ...prev, payments: true }));
      setErrors((prev) => ({ ...prev, payments: false }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setErrors((prev) => ({ ...prev, payments: true }));
        return;
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthPayments = data.filter((payment: any) => {
        const date = new Date(payment.createdAt);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      });

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].amount;
      }
      setTotalPayments(sum);
      sum = 0;
      for (let i = 0; i < thisMonthPayments.length; i++) {
        sum += thisMonthPayments[i].amount;
      }
      setMonthlyPayments(sum);

      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          label: date.toLocaleString("default", { month: "short" }),
          revenue: 0,
        };
      }).reverse();

      data.forEach((p: any) => {
        const date = new Date(p.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const month = months.find((m) => m.key === key);
        if (month) {
          month.revenue += p.amount || 0;
        }
      });
      setMonthspayements(months);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setErrors((prev) => ({ ...prev, payments: true }));
    } finally {
      setLoading((prev) => ({ ...prev, payments: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTrainer();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, []);

  const chartData = monthspayements.map((m) => ({
    month: m.label,
    revenue: m.revenue,
  }));

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-6">
          {loading.users ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : errors.users ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Failed to load members
              </p>
              <button
                onClick={fetchUsers}
                className="px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <StatCard
              title="Total Members"
              value={Total}
              change={newUsers}
              icon={Users}
              color="bg-accent"
            />
          )}

          {loading.trainers ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : errors.trainers ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Failed to load trainers
              </p>
              <button
                onClick={fetchTrainer}
                className="px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <StatCard
              title="Total Trainers"
              value={totalTrainers}
              change={newTrainers}
              icon={Dumbbell}
              color="bg-accent"
            />
          )}

          {loading.payments ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : errors.payments ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Failed to load payments
              </p>
              <button
                onClick={fetchPayments}
                className="px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <StatCard
              title="Total Revenue"
              value={`$${TotalPayments}`}
              change={MonthlyPayments}
              icon={DollarSign}
              color="bg-accent"
            />
          )}
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col gap-3 items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Gender Distribution Chart */}
            {loading.users ? (
              <LoadingCard title="Gender Distribution" />
            ) : errors.users ? (
              <NotFound type="Members" onRetry={fetchUsers} />
            ) : data.length === 0 ? (
              <NotFound type="Gender Data" onRetry={fetchUsers} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gender Distribution
                </h3>
                <PieChart width={300} height={300}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            )}

            {/* Monthly Revenue Chart */}
            {loading.payments ? (
              <LoadingCard title="Monthly Revenue" />
            ) : errors.payments ? (
              <NotFound type="Payment Data" onRetry={fetchPayments} />
            ) : chartData.length === 0 ? (
              <NotFound type="Revenue Data" onRetry={fetchPayments} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Revenue (Last 6 Months)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#ff1313" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Attendance Tracker */}
          {loading.users ? (
            <LoadingCard title="Attendance Data" />
          ) : errors.users ? (
            <NotFound type="Attendance Data" onRetry={fetchUsers} />
          ) : users.length === 0 ? (
            <NotFound type="Member Data" onRetry={fetchUsers} />
          ) : (
            <AttendanceTracker members={users} />
          )}
        </div>
      </div>
    </div>
  );
}
