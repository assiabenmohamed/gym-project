"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Edit3,
  Save,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Target,
  AlertTriangle,
  Users,
} from "lucide-react";
import Image from "next/image";

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  password?: string;
  address: string;
  gender: "male" | "female";
  phoneNumber: string;
  role: "trainer" | "member" | "admin";
  trainerAssigned?: string | null;
  emergencyContact?: EmergencyContact;
  goals: string[];
  medicalRestrictions?: string;
  profileImageUrl: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt?: string;
}

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>({
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
    password: "",
    address: "",
    gender: "male",
    phoneNumber: "",
    role: "member",
    trainerAssigned: null,
    emergencyContact: undefined,
    goals: [],
    medicalRestrictions: "",
    profileImageUrl: "",
    isOnline: false,
    createdAt: "",
    updatedAt: "",
  });

  const [editForm, setEditForm] = useState<UserData>({ ...user });
  const [newGoal, setNewGoal] = useState<string>("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      credentials: "include", // ✅ important
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) {
          setUser(data);
          setEditForm(data);
        }
      });
  }, []);

  const handleEdit = (): void => {
    setIsEditing(true);

    setEditForm({ ...user });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${editForm._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la mise à jour de l'utilisateur."
        );
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Mettre à jour le state avec les nouvelles infos
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleCancel = (): void => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof UserData,
    value: string | boolean
  ): void => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyContactChange = (
    field: keyof EmergencyContact,
    value: string
  ): void => {
    setEditForm((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        name: prev.emergencyContact?.name || "",
        phone: prev.emergencyContact?.phone || "",
        relation: prev.emergencyContact?.relation || "",
        [field]: value,
      },
    }));
  };

  const addGoal = (): void => {
    if (newGoal.trim()) {
      setEditForm((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (index: number): void => {
    setEditForm((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: UserData["role"]): string => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "trainer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="min-h-screen  py-8">
      {user && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r  from-[#ff1313]  to-[#6b21a8] px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profileImageUrl}`}
                        alt="Profile"
                        width={200}
                        height={200}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {/* <User className="w-12 h-12 text-gray-600" /> */}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    )}
                  </div>
                  <div className="text-white">
                    <h1 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-blue-100">{user.email}</p>
                    <div className="flex items-center mt-2">
                      {user && user.role && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phoneNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Birthday
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.birthday}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("birthday", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formatDate(user.birthday)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.gender}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleInputChange(
                            "gender",
                            e.target.value as "male" | "female"
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{user.gender}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact & Health */}
            <div className="space-y-8">
              {/* Emergency Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-red-600" />
                  Emergency Contact
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.emergencyContact?.name || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleEmergencyContactChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.emergencyContact?.name || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.emergencyContact?.phone || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleEmergencyContactChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.emergencyContact?.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.emergencyContact?.relation || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleEmergencyContactChange(
                            "relation",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.emergencyContact?.relation || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Restrictions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Medical Restrictions
                </h2>
                {isEditing ? (
                  <textarea
                    value={editForm.medicalRestrictions || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange("medicalRestrictions", e.target.value)
                    }
                    rows={4}
                    placeholder="Enter any medical restrictions or conditions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.medicalRestrictions || "No restrictions reported"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Fitness Goals
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(isEditing && user.goals ? editForm.goals : user.goals).map(
                  (goal: string, index: number) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    >
                      <span>{goal}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeGoal(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewGoal(e.target.value)
                    }
                    placeholder="Add a new goal..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && addGoal()
                    }
                  />
                  <button
                    onClick={addGoal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Member Since:</span>
                <span className="ml-2 text-gray-900">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${user.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
