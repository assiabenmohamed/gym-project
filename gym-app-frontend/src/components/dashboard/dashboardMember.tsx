import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Weight,
  Activity,
  LucideIcon,
} from "lucide-react";
import { User } from "@/app/page";

interface Stats {
  daysSinceRegistration: number;
  totalWeighIns: number;
  goalsAchieved: number;
  totalSessions: number;
}

interface MemberData {
  name: string;
  email: string;
  photo: string;
  subscriptionType: "gold" | "fitness" | "musculation";
  expirationDate: string;
  registrationDate: string;
  initialWeight: number;
  currentWeight: number;
  sesionsrest: number;
  stats: Stats;
}

interface SubscriptionColors {
  bg: string;
  text: string;
}

interface ExpirationStatus {
  status: string;
  color: string;
  bgColor: string;
}

interface WeightEvolution {
  icon: LucideIcon;
  color: string;
  text: string;
}

export function DashboardMember({ user }: { user: User }) {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch body tracking data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bodyTracking/${user._id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch body tracking data");
          return;
        }

        const data = await response.json();
        const bodysort = data.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        // Fetch subscription data
        const subres = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscription/user/${user._id}`,
          {
            credentials: "include",
          }
        );

        if (!subres.ok) {
          console.error("Failed to fetch subscription data");
          return;
        }

        const subdata = await subres.json();
        console.log("subdata", subdata);
        const filtersub = subdata.filter((sub: any) => sub.isActive);
        const activeSub = filtersub[0]; // Get the first active subscription
        console.log(activeSub);

        // Fetch session data
        const session = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions/user/${user._id}`,

          {
            credentials: "include",
          }
        );

        if (!session.ok) {
          console.error("Failed to fetch session data");
          return;
        }

        const sessiondata = await session.json();

        // Calculate days since registration
        const daysSinceRegistration = Math.floor(
          (new Date().getTime() - new Date(user.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        setMemberData({
          name: user.firstName + " " + user.lastName,
          email: user.email,
          photo:
            user.firstName.charAt(0).toUpperCase() +
            user.lastName.charAt(0).toUpperCase(),
          subscriptionType: activeSub?.plan?.accessType,
          expirationDate: activeSub?.endDate || new Date().toISOString(),
          registrationDate: user.createdAt,
          initialWeight:
            bodysort.length > 0 ? bodysort[bodysort.length - 1].weight : 0,
          currentWeight: bodysort.length > 0 ? bodysort[0].weight : 0,
          sesionsrest: activeSub?.remainingSessions,
          stats: {
            daysSinceRegistration,
            totalWeighIns: bodysort.length,
            totalSessions: sessiondata.length,
            goalsAchieved: 0,
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getSubscriptionColor = (
    type: MemberData["subscriptionType"]
  ): SubscriptionColors => {
    switch (type) {
      case "gold":
        return {
          bg: "bg-gradient-to-r from-yellow-400 to-orange-500",
          text: "text-yellow-600",
        };
      case "fitness":
        return {
          bg: "bg-gradient-to-r from-green-400 to-green-600",
          text: "text-blue-600",
        };
      case "musculation":
        return {
          bg: "bg-gradient-to-r from-red-400 to-red-600",
          text: "text-gray-600",
        };
      default:
        return { bg: "bg-gray-500", text: "text-gray-600" };
    }
  };

  const getExpirationStatus = (expDate: string): ExpirationStatus => {
    const today = new Date();
    const expiration = new Date(expDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        status: "Expired",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    if (diffDays <= 30)
      return {
        status: `Expires in ${diffDays} days`,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      };
    return {
      status: `${diffDays} days remaining`,
      color: "text-green-600",
      bgColor: "bg-green-100",
    };
  };

  const getWeightEvolution = (): WeightEvolution => {
    if (!memberData)
      return { icon: Target, color: "text-gray-500", text: "0kg" };

    const diff = memberData.currentWeight - memberData.initialWeight;
    if (diff > 0)
      return {
        icon: TrendingUp,
        color: "text-red-500",
        text: `+${diff.toFixed(1)}kg`,
      };
    if (diff < 0)
      return {
        icon: TrendingDown,
        color: "text-green-500",
        text: `${diff.toFixed(1)}kg`,
      };
    return { icon: Target, color: "text-gray-500", text: "0kg" };
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load member data</p>
        </div>
      </div>
    );
  }

  const subscriptionColors = getSubscriptionColor(memberData.subscriptionType);
  const expirationInfo = getExpirationStatus(memberData.expirationDate);
  const weightEvolution = getWeightEvolution();
  const IconEvolution = weightEvolution.icon;

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with profile */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className={`h-32 ${subscriptionColors.bg} relative`}>
            <div className="absolute top-4 right-4">
              <span className="px-4 py-2 bg-white bg-opacity-20  text-sm font-semibold rounded-full text-accent">
                {memberData?.subscriptionType
                  ? memberData.subscriptionType.charAt(0).toUpperCase() +
                    memberData.subscriptionType.slice(1)
                  : "N/A"}
              </span>
            </div>
            <div className="absolute -bottom-8 left-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-lg font-bold text-gray-700">
                  {memberData.photo}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-12 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Hello, {memberData.name}!
                </h1>
                <p className="text-gray-600">{memberData.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {formatDate(memberData.registrationDate)}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <div
                  className={`px-4 py-2 rounded-lg ${expirationInfo.bgColor}`}
                >
                  <p
                    className={`text-sm font-semibold ${expirationInfo.color}`}
                  >
                    {expirationInfo.status}
                  </p>
                  <p className="text-xs text-gray-600">
                    {memberData.sesionsrest !== null
                      ? memberData.sesionsrest + " sessions left"
                      : "infinite"}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Days of Activity
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {memberData.stats.daysSinceRegistration}
                </p>
              </div>
              <Clock className="h-10 w-10 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Weigh-ins Completed
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {memberData.stats.totalWeighIns}
                </p>
              </div>
              <Weight className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {memberData.stats.totalSessions}
                </p>
              </div>
              <Activity className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="flex gap-8 justify-center">
          {/* Weight tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Weight className="h-6 w-6 mr-2 text-blue-500" />
              My Weight Tracking
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Initial Weight</p>
                <p className="text-2xl font-bold text-gray-800">
                  {memberData.initialWeight}kg
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Current Weight</p>
                <p className="text-2xl font-bold text-blue-600">
                  {memberData.currentWeight}kg
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <IconEvolution
                  className={`h-5 w-5 mr-2 ${weightEvolution.color}`}
                />
                <span className={`font-semibold ${weightEvolution.color}`}>
                  Progress: {weightEvolution.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
