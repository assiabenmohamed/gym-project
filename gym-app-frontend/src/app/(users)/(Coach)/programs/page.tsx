"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Exercise, Program, User } from "../../types/program";
import ProgramCard from "@/components/program/program-card";
import { ProgramModal } from "@/components/program/program-modal";

export default function Page() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exerciseRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exercises`
        );

        if (!exerciseRes.ok) {
          console.error("Failed to fetch exercises");
          return;
        }

        const exercises = await exerciseRes.json();
        const sortedExercises = exercises.sort((a: Exercise, b: Exercise) =>
          a.name.localeCompare(b.name)
        );
        setExercises(sortedExercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  // Fetch user data and members
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch current user
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

        const currentUser = await userRes.json();
        setUserData(currentUser);

        // 2. Fetch all members
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

        // 3. Transform data to User[] format
        const usersData: User[] = membersData.map((user: any) => ({
          _id: user._id,
          name: `${user.lastName} ${user.firstName}`,
          email: user.email,
          trainerAssigned: user.trainerAssigned,
        }));

        // 4. Filter members assigned to current trainer
        const filteredUsers = usersData.filter(
          (user) => user.trainerAssigned === currentUser._id
        );

        setUsers(filteredUsers);

        // 5. Auto-select first user if available
        if (filteredUsers.length > 0 && !selectedUserId) {
          setSelectedUserId(filteredUsers[0]._id);
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersData();
  }, [selectedUserId]);

  // Fetch programs when user is selected
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!selectedUserId || !userData) return;

      try {
        console.log("Fetching programs for trainer:", userData._id);
        const programRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/programs/trainer/${userData._id}`,
          {
            credentials: "include",
          }
        );

        if (!programRes.ok) {
          console.error("Failed to fetch programs");
          return;
        }

        const programs = await programRes.json();
        setPrograms(programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, [selectedUserId, userData]);

  // Filter programs based on selected user
  useEffect(() => {
    if (selectedUserId) {
      setFilteredPrograms(
        programs.filter((program) => program.user === selectedUserId)
      );
    } else {
      setFilteredPrograms(programs);
    }
  }, [selectedUserId, programs]);

  const getUserName = (userId: string): string => {
    return users.find((u) => u._id === userId)?.name || "Unknown";
  };

  const getExerciseName = (exerciseId: string): string => {
    return (
      exercises.find((e) => e._id === exerciseId)?.name || "Unknown Exercise"
    );
  };

  const deleteProgram = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/programs/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete program");
        }

        setPrograms(programs.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting program:", error);
        alert("Failed to delete program. Please try again.");
      }
    }
  };

  const saveProgram = async (
    programData: Partial<Program>,
    editingProgram: Program | null
  ) => {
    if (!userData) {
      console.error("User data not available");
      return;
    }

    try {
      if (editingProgram) {
        // Update existing program
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/programs/${editingProgram._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(programData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update program");
        }
        const { program } = await response.json();

        // 🧠 Ajout du nouveau programme à la liste
        setPrograms(
          programs.map((p) => (p._id === editingProgram._id ? program : p))
        );
      } else {
        // Create new program
        const newProgram = {
          ...programData,
          user: selectedUserId,
          trainer: userData._id,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/programs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newProgram),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create program");
        }

        const { program } = await response.json();

        // 🧠 Ajout du nouveau programme à la liste
        setPrograms([...programs, program]);
        console.log("Program created:", program);
      }
    } catch (error) {
      console.error("Error saving program:", error);
      alert("Failed to save program. Please try again.");
    }
  };

  const handleCreateProgram = () => {
    setEditingProgram(null);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
  };

  const handleSaveProgram = async (
    programData: Partial<Program>,
    editingProgram: Program | null
  ) => {
    await saveProgram(programData, editingProgram);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Training Programs</h1>
        <ProgramModal
          onSave={handleSaveProgram}
          editingProgram={editingProgram}
          users={users}
          exercises={exercises}
          create={true}
          onCreate={handleCreateProgram}
        />
      </div>

      {/* Member Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-gray-500" />
          <h2 className="text-lg font-medium">Filter Programs</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-1/3">
            <label
              htmlFor="member-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Member
            </label>
            <select
              id="member-select"
              value={selectedUserId}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a member...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 sm:mt-0">
            {selectedUserId && (
              <div className="text-sm text-gray-600">
                Showing {filteredPrograms.length} program(s) for{" "}
                {getUserName(selectedUserId)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <ProgramCard
              key={program._id}
              program={program}
              onEdit={handleEditProgram}
              onDelete={deleteProgram}
              getUserName={getUserName}
              onSave={handleSaveProgram}
              editingProgram={editingProgram}
              users={users}
              exercises={exercises}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            {selectedUserId ? (
              <p>
                No programs found for this member. Create one to get started.
              </p>
            ) : (
              <p>Select a member to view their programs.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
