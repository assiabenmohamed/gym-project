"use client";
import { EditMember } from "@/components/login/Edit";
import PaginationUsers from "@/components/login/Paginationusers";
import { Button } from "@/components/ui/button";
import { BiChevronDown, BiChevronUp, BiSort } from "react-icons/bi";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Search, EllipsisVertical, Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdOutlinePersonSearch } from "react-icons/md";
import { AddMember } from "@/components/login/AddMember";
import { io } from "socket.io-client";
import MobileMemberCard from "@/components/login/MobileCard";

// Define the User interface (adjust to your schema)
interface Userall {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  address: string;
  gender: string;
  phoneNumber: string;
  trainerAssigned: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  goals: string[];
  medicalRestrictions: string;
  isOnline?: boolean;
}

export default function Page() {
  const [users, setUsers] = useState<Userall[] | null>(null);
  const [allUsers, setAllUsers] = useState<Userall[]>([]);
  const [trainer, setTrainer] = useState<Userall[]>([]);
  const [page, setPage] = useState(1); // Default starting page is 1
  const [usersPerPage, setUsersPerPage] = useState(4); // Number of users to display per page
  const [subscription, setSubscription] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState<null | "asc" | "desc">(
    null
  );
  const [open, setOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Userall | null>(null);

  async function getUsers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/members`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const usersData = await response.json();
      setAllUsers(usersData);
      setUsers(usersData);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des utilisateurs:", err);
    }
  }

  useEffect(() => {
    // Initialiser la socket
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
      withCredentials: true,
    });

    async function getTrainers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/trainers`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const trainerData = await response.json();
        setTrainer(trainerData);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des trainers:", err);
      }
    }

    // Charger les données initiales
    getUsers();
    getTrainers();

    // Écouter les mises à jour de statut en ligne
    socket.on("update_online_status", (data) => {
      console.log(
        `🔄 Mise à jour statut: ${data.userId} - ${data.isOnline ? "en ligne" : "hors ligne"}`
      );

      // Mettre à jour le statut dans allUsers
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === data.userId ? { ...user, isOnline: data.isOnline } : user
        )
      );

      // Mettre à jour le statut dans users
      setUsers((prevUsers) =>
        prevUsers!.map((user) =>
          user._id === data.userId ? { ...user, isOnline: data.isOnline } : user
        )
      );

      // Mettre à jour le statut dans trainer
      setTrainer((prevTrainers) =>
        prevTrainers.map((trainer) =>
          trainer._id === data.userId
            ? { ...trainer, isOnline: data.isOnline }
            : trainer
        )
      );
    });

    socket.on("connect", () => {
      console.log("✅ Socket connecté pour les mises à jour:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket déconnecté");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erreur de connexion socket:", error);
    });

    // Nettoyage
    return () => {
      socket.disconnect();
      console.log("🔌 Socket déconnectée (useEffect users)");
    };
  }, []);
  async function handleDelete(id: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Optionally refresh state or UI
        console.log("Item deleted successfully");
        setUsers((prevUsers) =>
          prevUsers!.filter((user: any) => user._id !== id)
        );
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("An error occurred while deleting:", error);
    }
  }
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value.toLowerCase().trim();
    if (!query) {
      // Si recherche vide, affiche toute la liste
      setUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query)
    );
    setUsers(filtered);
  }
  // Get the current page's users to display
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    ? users.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const totalPages = users ? Math.ceil(users.length / usersPerPage) : 1; // Calculate total pages

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent invalid page numbers
    setPage(newPage);
  };
  const handleSort = () => {
    let newDirection: "asc" | "desc" = "asc";

    if (sortDirection === "asc") newDirection = "desc";
    else if (sortDirection === "desc") newDirection = "asc";

    const sortedUsers = [...users!].sort((a, b) => {
      const fullNameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const fullNameB = `${b.lastName} ${b.firstName}`.toLowerCase();

      return newDirection === "asc"
        ? fullNameA.localeCompare(fullNameB)
        : fullNameB.localeCompare(fullNameA);
    });

    setUsers(sortedUsers);
    setSortDirection(newDirection);
  };

  function getTrainerName(id: string) {
    const selectedTrainer = trainer.find((t) => t._id === id);
    if (selectedTrainer) {
      return `${selectedTrainer.firstName} ${selectedTrainer.lastName}`;
    }
    return "No trainer assigned";
  }
  useEffect(() => {
    async function getSubscriptions() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    }
    getSubscriptions();
  }, []);
  function getSubscriptionExpiration(id: string): Date | null {
    const selectedSubscription = subscription.find(
      (s) => s.user?._id === id && s.isActive
    );

    if (selectedSubscription?.endDate) {
      return new Date(selectedSubscription.endDate);
    }

    return null;
  }
  return (
    <div className="max-w-7xl mx-auto px-2 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-3 py-4 sm:px-6 sm:py-5 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Gym Members
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Label className="text-sm whitespace-nowrap">Show Entities</Label>
              <Input
                type="number"
                min={2}
                max={users?.length}
                value={usersPerPage}
                onChange={(e) => setUsersPerPage(parseInt(e.target.value))}
                className="w-16 sm:w-20"
              />
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlinePersonSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search members..."
                className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm sm:text-base"
                onChange={handleSearch}
              />
            </div>
            <div className="flex-shrink-0">
              <AddMember role="member" onSuccess={getUsers} />
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        {/* <div className="block sm:hidden">
          {currentUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 px-4">
              No members found.{" "}
              <span className="text-primary font-medium">
                Please add a member to get started.
              </span>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <MobileMemberCard
                  key={user._id}
                  user={user}
                  getSubscriptionExpiration={getSubscriptionExpiration}
                  getTrainerName={getTrainerName}
                  onEdit={() => {
                    setSelectedMember(user);
                    setOpen(true);
                  }}
                  onDelete={() => handleDelete(user._id)}
                />
              ))}
            </div>
          )}
        </div> */}

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="w-2/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                >
                  <Button
                    onClick={handleSort}
                    variant="ghost"
                    className="hover:bg-transparent flex items-center gap-1 text-xs"
                  >
                    <BiSort className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Name</span>
                    <span className="sm:hidden">Member</span>
                    {sortDirection === "asc" && (
                      <BiChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    {sortDirection === "desc" && (
                      <BiChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </th>
                <th
                  scope="col"
                  className="hidden md:table-cell w-1/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="w-1/8 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                >
                  <span className="hidden sm:inline">Gender</span>
                  <span className="sm:hidden">G</span>
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                >
                  Trainer
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                >
                  <span className="hidden sm:inline">Expires On</span>
                  <span className="sm:hidden">Status</span>
                </th>
                <th
                  scope="col"
                  className="w-1/8 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500 px-3 sm:px-6"
                  >
                    No members found.{" "}
                    <span className="text-primary font-medium">
                      Please add a member to get started.
                    </span>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="font-medium text-gray-600 text-xs sm:text-sm">
                              {user.lastName.charAt(0)}
                              {user.firstName.charAt(0)}
                            </span>
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full border-2 border-white ${
                              user.isOnline ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </div>
                        <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {user.lastName} {user.firstName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900 truncate">
                        {user.phoneNumber}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                      <span
                        className={`px-1 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.gender === "male"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        <span className="hidden sm:inline">{user.gender}</span>
                        <span className="sm:hidden">
                          {user.gender.charAt(0).toUpperCase()}
                        </span>
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                      <div className="truncate">
                        {user.trainerAssigned
                          ? getTrainerName(user.trainerAssigned)
                          : "No trainer assigned"}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                      {(() => {
                        const expiration = getSubscriptionExpiration(user._id);

                        if (!expiration) {
                          return (
                            <span className="px-1 sm:px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              <span className="hidden sm:inline">
                                No subscription
                              </span>
                              <span className="sm:hidden">None</span>
                            </span>
                          );
                        }

                        const isExpired = expiration < new Date();

                        return (
                          <span
                            className={`px-1 sm:px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isExpired
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            <span className="hidden sm:inline">
                              {expiration.toLocaleDateString("fr-FR")}
                            </span>
                            <span className="sm:hidden">
                              {isExpired ? "Expired" : "Active"}
                            </span>
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium sm:px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-transparent h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            <EllipsisVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="bg-white border border-gray-200 p-1 rounded-md"
                        >
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedMember(user);
                              setOpen(true);
                            }}
                            className="hover:bg-transparent focus:bg-transparent active:bg-transparent text-black w-full"
                          >
                            <span className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md w-full">
                              <Edit className="h-4 w-4" /> Edit
                            </span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={() => handleDelete(user._id)}
                            className="hover:bg-transparent focus:bg-transparent active:bg-transparent text-black w-full"
                          >
                            <span className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                              <AiOutlineUserDelete className="h-4 w-4" /> Delete
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {selectedMember && (
          <EditMember
            key={selectedMember._id + (open ? "-open" : "-closed")}
            open={open}
            setOpenAction={(value) => {
              setOpen(value);
              if (!value) {
                // Démontage progressif après fermeture visuelle
                setTimeout(() => setSelectedMember(null), 200);
              }
            }}
            member={selectedMember}
            role="member"
            onSuccessAction={() => {
              setOpen(false);
              setTimeout(() => {
                setSelectedMember(null);
                getUsers();
              }, 200);
            }}
            setSelectedMemberAction={setSelectedMember}
          />
        )}
        {users && users.length > 0 && (
          <PaginationUsers
            currentPage={page}
            pageCount={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
