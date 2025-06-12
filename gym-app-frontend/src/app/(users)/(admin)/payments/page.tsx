"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
} from "lucide-react";

// Type definitions matching your MongoDB schema
type PaymentMethod = "card" | "cash";
type PaymentStatus = "paid" | "pending" | "failed";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SubscriptionPlan {
  _id: string;
  duration: string;
  frequency: string;
  accessType: string;
  price: number;
}

interface Payment {
  _id: string;
  user: User;
  subscriptionPlan: SubscriptionPlan;
  amount: number;
  method: PaymentMethod;
  date: string;
  status: PaymentStatus;
  paidAt: string;
  createdAt: string;
  updatedAt?: string;
}

interface FormData {
  user: string;
  subscriptionPlan: string;
  amount: string | number;
  method: PaymentMethod | "";
  date: string;
  status: PaymentStatus;
}

interface FilterState {
  status: PaymentStatus | "all";
  method: PaymentMethod | "all";
  dateRange: "all" | "today" | "week" | "month";
  searchTerm: string;
}

export default function PaymentManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    method: "all",
    dateRange: "all",
    searchTerm: "",
  });
  const [formData, setFormData] = useState<FormData>({
    user: "",
    subscriptionPlan: "",
    amount: "",
    method: "",
    date: new Date().toISOString().split("T")[0],
    status: "paid",
  });

  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, plansRes, paymentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/members`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptionPlan`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
            credentials: "include",
          }),
        ]);
        // 👉 Debug : afficher les statuts HTTP
        console.log("usersRes:", usersRes.status);
        console.log("plansRes:", plansRes.status);
        console.log("paymentsRes:", paymentsRes.status);

        if (!usersRes.ok || !plansRes.ok || !paymentsRes.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération des données."
          );
        }

        const [usersData, plansData, paymentsData] = await Promise.all([
          usersRes.json(),
          plansRes.json(),
          paymentsRes.json(),
        ]);

        setUsers(usersData);
        setSubscriptionPlans(plansData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  const paymentMethods: PaymentMethod[] = ["card", "cash"];
  const paymentStatuses: PaymentStatus[] = ["paid", "pending", "failed"];

  const resetForm = (): void => {
    setFormData({
      user: "",
      subscriptionPlan: "",
      amount: "",
      method: "",
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.user &&
      formData.subscriptionPlan &&
      formData.amount &&
      formData.method &&
      formData.date
    );
  };

  const handleCreate = async (): Promise<void> => {
    if (!isFormValid()) return;

    const selectedUser = users.find((u) => u._id === formData.user);
    const selectedPlan = subscriptionPlans.find(
      (p) => p._id === formData.subscriptionPlan
    );

    if (!selectedUser || !selectedPlan) {
      console.warn("Utilisateur ou plan non trouvé.");
      return;
    }

    const newPaymentData = {
      email: selectedUser.email,
      subscriptionPlanId: selectedPlan._id,
      method: formData.method,
      date: formData.date,
      status: formData.status,
      amount: formData.amount,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newPaymentData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Erreur lors de la création du paiement"
        );
      }

      // Affichage conditionnel selon la réponse backend
      if (result.payment) {
        setPayments((prev) => [...prev, result.payment]);
        resetForm();
        setIsCreating(false);

        if (result.subscriptionEndDate) {
          console.log(
            `Abonnement actif jusqu’au ${new Date(result.subscriptionEndDate).toLocaleDateString()}`
          );
        } else {
          console.log("Paiement enregistré sans création d’abonnement.");
        }
      }
    } catch (error: unknown) {
      console.error("Erreur paiement :", error);

      let message = "Erreur lors de la création du paiement.";
      if (error instanceof Error) {
        message = error.message;
      }

      alert(message);
    }
  };

  const handleEdit = (payment: Payment): void => {
    setEditingId(payment._id);
    setFormData({
      user: payment.user._id,
      subscriptionPlan: payment.subscriptionPlan._id,
      amount: payment.amount.toString(),
      method: payment.method,
      date: payment.date.split("T")[0],
      status: payment.status,
    });
  };

  const handleUpdate = async (): Promise<void> => {
    if (!isFormValid() || !editingId) return;

    const selectedUser = users.find((u) => u._id === formData.user);
    const selectedPlan = subscriptionPlans.find(
      (p) => p._id === formData.subscriptionPlan
    );

    if (!selectedUser || !selectedPlan) {
      alert("Utilisateur ou plan d'abonnement non trouvé.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            amount: formData.amount,
            method: formData.method,
            date: formData.date,
            status: formData.status,
            subscriptionPlan: formData.subscriptionPlan,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Erreur lors de la mise à jour du paiement"
        );
      }

      // Mise à jour du state local avec la réponse backend (paiement mis à jour)
      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === editingId ? result.payment : payment
        )
      );

      resetForm();
      setEditingId(null);
    } catch (error: unknown) {
      let message = "Erreur lors de la mise à jour du paiement.";
      if (error instanceof Error) {
        message = error.message;
      }
      alert(message);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Erreur lors de la suppression du paiement"
          );
        }

        // ✅ Suppression locale après succès backend
        setPayments((prev) => prev.filter((payment) => payment._id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Échec de la suppression du paiement.");
      }
    }
  };

  const handleCancel = (): void => {
    resetForm();
    setIsCreating(false);
    setEditingId(null);
  };

  const getStatusColor = (status: PaymentStatus): string => {
    const colorMap: Record<PaymentStatus, string> = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return colorMap[status];
  };

  const getStatusIcon = (status: PaymentStatus): React.ReactElement => {
    const iconMap: Record<PaymentStatus, React.ReactElement> = {
      paid: <CheckCircle size={16} className="text-green-600" />,
      pending: <Clock size={16} className="text-yellow-600" />,
      failed: <XCircle size={16} className="text-red-600" />,
    };
    return iconMap[status];
  };

  const getMethodIcon = (method: PaymentMethod): React.ReactElement => {
    return method === "card" ? (
      <CreditCard size={16} />
    ) : (
      <Banknote size={16} />
    );
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      filters.status === "all" || payment.status === filters.status;
    const matchesMethod =
      filters.method === "all" || payment.method === filters.method;
    const matchesSearch =
      filters.searchTerm === "" ||
      payment.user.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      payment.user.email
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    let matchesDate = true;
    const paymentDate = new Date(payment.date);
    const now = new Date();

    switch (filters.dateRange) {
      case "today":
        matchesDate = paymentDate.toDateString() === now.toDateString();
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = paymentDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = paymentDate >= monthAgo;
        break;
    }

    return matchesStatus && matchesMethod && matchesSearch && matchesDate;
  });

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const paidAmount = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Payment Management
            </h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>Total: ${totalAmount.toFixed(2)}</span>
              <span>Paid: ${paidAmount.toFixed(2)}</span>
              <span>Count: {filteredPayments.length}</span>
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            type="button"
          >
            <Plus size={20} />
            New Payment
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                name="method"
                value={filters.method}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    status: "all",
                    method: "all",
                    dateRange: "all",
                    searchTerm: "",
                  })
                }
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                type="button"
              >
                <Filter size={16} />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {isCreating ? "Create New Payment" : "Edit Payment"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User *
                </label>
                <select
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="SubscriptionPlan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subscription Plan *
                </label>
                <select
                  id="subscriptionPlan"
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select plan</option>
                  {subscriptionPlans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.accessType} - {plan.duration} (${plan.price})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount ($) *
                </label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="method"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Payment Method *
                </label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select method</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Payment Date *
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={isCreating ? handleCreate : handleUpdate}
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

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-semibold text-gray-700">
                  User
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Plan
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Method
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.subscriptionPlan?.accessType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.subscriptionPlan.duration} •{" "}
                        {payment.subscriptionPlan.frequency}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(payment.method)}
                      <span className="capitalize">{payment.method}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        type="button"
                        aria-label={`Edit payment for ${payment.user.name}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        type="button"
                        aria-label={`Delete payment for ${payment.user.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payments found.</p>
            <p className="text-gray-400 text-sm mt-2">
              {payments.length === 0
                ? "Create your first payment to get started."
                : "Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
