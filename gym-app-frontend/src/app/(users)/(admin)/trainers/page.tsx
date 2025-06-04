"use client";
import { EditMember } from "@/components/login/Edit";
import PaginationUsers from "@/components/login/Paginationusers";
import { Button } from "@/components/ui/button";
import { BiSort } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Search, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdOutlinePersonSearch } from "react-icons/md";
import { AddMember } from "@/components/login/AddMember";

// Define the User interface (adjust to your schema)
interface Userall {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  trainerAssigned?: {
    firstName: string;
    lastName: string;
  };
  subscriptionExpiration?: string;
  isOnline?: boolean;
}

export default function Page() {
  const [users, setUsers] = useState<Userall[] | null>(null);
  const [allUsers, setAllUsers] = useState<Userall[]>([]);
  const Role = "member";

  const [page, setPage] = useState(1); // Default starting page is 1
  const [usersPerPage, setUsersPerPage] = useState(4); // Number of users to display per page
  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/trainers`,
          {
            credentials: "include", // ✅ allow sending cookies (JWT)
          }
        );

        const usersData = await response.json();
        console.log(usersData);
        setAllUsers(usersData);
        setUsers(usersData); // Assuming usersData contains an array of users
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }

    getUsers();
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
    const sortedUsers = [...users!].sort((a, b) => {
      const fullNameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const fullNameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      return fullNameA.localeCompare(fullNameB);
    });

    setUsers(sortedUsers);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow overflow-hidden ">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex  flex-col  gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Gym Members</h1>
          <div className="flex items-center gap-4 justify-center ">
            <div className="flex gap-2">
              <Label>show Entites</Label>
              <Input
                type="number"
                min={2}
                max={users?.length}
                value={usersPerPage}
                onChange={(e) => setUsersPerPage(parseInt(e.target.value))}
              />
            </div>
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlinePersonSearch className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
                onChange={handleSearch}
              />
            </div>
            <AddMember role="trainer" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <Button
                    onClick={() => handleSort()}
                    variant={"ghost"}
                    className="hover:bg-transparent"
                  >
                    <BiSort />
                    Name{" "}
                  </Button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gender
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-600">
                            {user.lastName.charAt(0)}
                            {user.firstName.charAt(0)}
                          </span>
                        </div>
                        {/* Badge de statut */}
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            user.isOnline ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.lastName} {user.firstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.gender === "male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {user.gender}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="  hover:bg-transparent "
                        >
                          <EllipsisVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="bg-white border border-gray-200 p-1 rounded-md"
                      >
                        <EditMember id={user._id} />

                        <DropdownMenuItem
                          onSelect={() => handleDelete(user._id)}
                          className="  hover:bg-transparent focus:bg-transparent active:bg-transparent text-black w-full"
                        >
                          <span className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md ">
                            <AiOutlineUserDelete /> Delete
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users && users.length > 0 && (
          <PaginationUsers
            currentPage={page}
            pageCount={totalPages} // Pass the total pages
            onPageChange={handlePageChange} // Handle page change
          />
        )}
      </div>
    </div>
  );
}
