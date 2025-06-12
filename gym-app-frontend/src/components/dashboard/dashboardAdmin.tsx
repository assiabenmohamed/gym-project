import React, { useState, useEffect } from "react";
import { Users, DollarSign, Dumbbell } from "lucide-react";
import StatCard from "./statCard";
import { set } from "react-hook-form";
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
  status: "Active" | "Inactive" | "Pending";
  joined: string;
}
const COLORS = ["#FF6384", "#36A2EB"]; // Rose pour femme, bleu pour homme

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
  const [totalTrainers, setTotalTrainers] = useState(0); // [trainer]
  const [newTrainers, setNewTrainers] = useState(0);
  const [monthspayements, setMonthspayements] = useState<any[]>([]);
  // Sample data with proper typing
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/members`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filtrer les utilisateurs créés ce mois-ci
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
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
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
        setTotalTrainers(data.length);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filtrer les utilisateurs créés ce mois-ci
        const usersThisMonth = data.filter((user: any) => {
          const createdAt = new Date(user.createdAt);
          return (
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear
          );
        });
        setNewTrainers(usersThisMonth.length);
        // Filtrer les utilisateurs actifs ce mois-ci
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainer();
  }, []);
  useEffect(() => {
    const fetchPayments = async () => {
      try {
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

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthPayments = data.filter((payment: any) => {
          const date = new Date(payment.createdAt);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
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

        // Regrouper les paiements par mois
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
      }
    };

    fetchPayments();
  }, []);
  const chartData = monthspayements.map((m) => ({
    month: m.label,
    revenue: m.revenue,
  }));
  // Stat Card Component

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-6">
          <StatCard
            title="Total Members"
            value={Total}
            change={newUsers}
            icon={Users}
            color="bg-[#34D399]"
          />
          <StatCard
            title="Total Trainers"
            value={totalTrainers}
            change={newTrainers}
            icon={Dumbbell}
            color="bg-[#60A5FA]"
          />
          <StatCard
            title="Total Revenue"
            value={`$${TotalPayments}`}
            change={MonthlyPayments}
            icon={DollarSign}
            color="bg-[#FBBF24]"
          />
        </div>

        {/* Gender Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100  flex flex-col gap-3 items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Bar dataKey="revenue" fill="#FBBF24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <AttendanceTracker members={users} />
        </div>
      </div>
    </div>
  );
}
