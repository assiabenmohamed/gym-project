"use client";
import React, { useEffect, useState } from "react";
import { Users, TrendingUp } from "lucide-react";
import { User } from "@/app/page";

// Types et interfaces
interface Member {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  phone: string;
  isOnline: boolean;
  trainerAssigned: string;
}

interface Stats {
  totalMembers: number;
  activeMembers: number;
}

type TabType = "overview" | "members";

export default function DashboardTrainer({ userme }: { userme: User }) {
  const [members, setMembers] = useState<Member[]>([]);

  const stats: Stats = {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.isOnline === true).length,
  };
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }
  useEffect(() => {
    async function fetchData() {
      try {
        //Charger tous les membres
        const membersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/members`,
          {
            credentials: "include",
          }
        );

        if (!membersRes.ok) {
          console.error("Failed to fetch members data");
          return;
        }

        const membersData = await membersRes.json();

        // 3. Transformer les données au format User[]
        const usersData: Member[] = membersData.map((user: any) => ({
          id: user._id,
          name: `${user.lastName} ${user.firstName}`,
          email: user.email,

          joinDate: user.joinDate,
          phone: user.phoneNumber,
          isOnline: user.isOnline,
          trainerAssigned: user.trainerAssigned,
        }));

        // 4. Filtrer les membres assignés à l'entraîneur connecté
        const filteredUsers = usersData.filter(
          (user) => user.trainerAssigned === userme._id
        );

        setMembers(filteredUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="min-h-screen  space-y-6 p-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Trainer Dashboard
              </h1>
              {userme && (
                <p className="text-gray-600 text-sm mt-1">
                  👋 {getGreeting()}, {userme.lastName} {userme.firstName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Main Statistics */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-gradient-to-br from-accent to-accent/90 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Total Members</p>
                <p className="text-3xl font-bold">{stats.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent to-accent/90 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Active Members</p>
                <p className="text-3xl font-bold">{stats.activeMembers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Members List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member: Member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            member.isOnline === true
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.isOnline === true ? "Actif" : "Inactif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
