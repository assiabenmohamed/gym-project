"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

// Type definitions matching your MongoDB schema
type Duration = "month" | "3 months" | "6 months" | "year";
type Frequency = "2x/week" | "3x/week" | "infinite";
type AccessType = "musculation" | "fitness" | "gold";

interface SubscriptionPlan {
  _id: string;
  duration: Duration;
  frequency: Frequency;
  accessType: AccessType;
  price: number;
  createdAt: string;
  updatedAt?: string;
}

interface FormData {
  duration: Duration | "";
  frequency: Frequency | "";
  accessType: AccessType | "";
  price: string | number;
}

interface BadgeColorMap {
  [key: string]: string;
}

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    duration: "",
    frequency: "",
    accessType: "",
    price: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    async function getplan() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptionPlan`,
          {
            credentials: "include", // ✅ allow sending cookies (JWT)
          }
        );
        const mockPlans = await res.json();
        setPlans(mockPlans);
        console.log(mockPlans);
      } catch (err) {
        console.error("Error fetching plan:", err);
      }
    }

    getplan();
  }, []);

  const durationOptions: Duration[] = ["month", "3 months", "6 months", "year"];
  const frequencyOptions: Frequency[] = ["2x/week", "3x/week", "infinite"];
  const accessTypeOptions: AccessType[] = ["musculation", "fitness", "gold"];

  const resetForm = (): void => {
    setFormData({
      duration: "",
      frequency: "",
      accessType: "",
      price: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    }));
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.duration &&
      formData.frequency &&
      formData.accessType &&
      formData.price
    );
  };

  const handleCreate = async (): Promise<void> => {
    if (isFormValid()) {
      const price = parseFloat(formData.price.toString());

      const newPlan: SubscriptionPlan = {
        _id: crypto.randomUUID(), // ou Date.now().toString()
        duration: formData.duration as Duration,
        frequency: formData.frequency as Frequency,
        accessType: formData.accessType as AccessType,
        price,
        createdAt: new Date().toISOString(),
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptionPlan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // ✅ allow sending cookies (JWT)
            body: JSON.stringify(newPlan),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to create subscription plan"
          );
        }

        setPlans((prev) => [...prev, newPlan]);
        resetForm();
        setIsCreating(false);
      } catch (error) {
        console.error("Error creating subscription plan:", error);
      }
    }
  };

  const handleEdit = (plan: SubscriptionPlan): void => {
    setEditingId(plan._id);
    setFormData({
      duration: plan.duration,
      frequency: plan.frequency,
      accessType: plan.accessType,
      price: plan.price.toString(),
    });
  };

  // const handleUpdate = (): void => {
  //   if (isFormValid() && editingId) {
  //     setPlans((prev) =>
  //       prev.map((plan) =>
  //         plan._id === editingId
  //           ? {
  //               ...plan,
  //               duration: formData.duration as Duration,
  //               frequency: formData.frequency as Frequency,
  //               accessType: formData.accessType as AccessType,
  //               price: parseFloat(formData.price.toString()),
  //               updatedAt: new Date().toISOString(),
  //             }
  //           : plan
  //       )
  //     );
  //     resetForm();
  //     setEditingId(null);
  //   }
  // };
  const handleUpdate = async (id: string) => {
    const payload = {
      duration: formData.duration,
      frequency: formData.frequency,
      accessType: formData.accessType,
      price: parseFloat(formData.price.toString()),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptionPlan/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Plan updated!");

        resetForm();
        setEditingId(null);

        // 🔄 Refresh plans from the server
        const refreshed = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptionPlan`,
          { credentials: "include" }
        );
        const updatedPlans = await refreshed.json();
        setPlans(updatedPlans);
      } else {
        const err = await res.json();
        alert("Update failed: " + err.message);
      }
    } catch (error) {
      console.error("Erreur mise à jour", error);
    }
  };
  const handleDelete = (id: string): void => {
    if (
      window.confirm("Are you sure you want to delete this subscription plan?")
    ) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptionPlan/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setPlans((prev) => prev.filter((plan) => plan._id !== id));
    }
  };

  const handleCancel = (): void => {
    resetForm();
    setIsCreating(false);
    setEditingId(null);
  };

  const getAccessTypeColor = (type: AccessType): string => {
    const colorMap: BadgeColorMap = {
      musculation: "bg-red-100 text-red-800",
      fitness: "bg-emerald-100 text-emerald-800",
      gold: "bg-yellow-100 text-yellow-800",
    };
    return colorMap[type] || "bg-gray-100 text-gray-800";
  };

  const getFrequencyBadge = (frequency: Frequency): string => {
    const colorMap: BadgeColorMap = {
      "2x/week": "bg-orange-100 text-orange-800",
      "3x/week": "	bg-indigo-100 text-indigo-800",
      infinite: "bg-rose-100 text-rose-800",
    };
    return colorMap[frequency] || "bg-gray-100 text-gray-800";
  };

  const getDurationSuffix = (duration: Duration): string => {
    const suffixMap: Record<Duration, string> = {
      month: "/month",
      "3 months": "/3 months",
      "6 months": "/6 months",
      year: "/year",
    };
    return suffixMap[duration];
  };

  return (
    <div className="max-w-6xl mx-auto p-6  min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Subscription Plans
          </h1>
          <button
            onClick={() => setIsCreating(true)}
            className=" px-4 py-2 rounded-lg border border-input text-sm font-medium text-muted-foreground hover:bg-accent hover:text-white transition-colors flex items-center gap-2"
            type="button"
          >
            <Plus size={20} />
            New Plan
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {isCreating ? "Create New Plan" : "Edit Plan"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 "
                  required
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Frequency *
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 "
                  required
                >
                  <option value="">Select frequency</option>
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="accessType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Access Type *
                </label>
                <select
                  id="accessType"
                  name="accessType"
                  value={formData.accessType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 "
                  required
                >
                  <option value="">Select access type</option>
                  {accessTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 "
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={
                  isCreating
                    ? handleCreate
                    : () => editingId && handleUpdate(editingId)
                }
                disabled={!isFormValid()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                type="button"
              >
                <Save size={16} />
                {isCreating ? "Create" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                type="button"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: SubscriptionPlan) => (
            <div
              key={plan._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getAccessTypeColor(plan.accessType)}`}
                  >
                    {plan.accessType.toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getFrequencyBadge(plan.frequency)}`}
                  >
                    {plan.frequency}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-gray-500  hover:bg-gray-100 rounded-lg transition-colors"
                    type="button"
                    aria-label={`Edit ${plan.accessType} plan`}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    type="button"
                    aria-label={`Delete ${plan.accessType} plan`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">
                    {plan.duration} Plan
                  </h3>
                  <p className="text-sm text-gray-600">
                    Duration: {plan.duration}
                  </p>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getDurationSuffix(plan.duration)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t">
                  <div>
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No subscription plans found.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Create your first plan to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
