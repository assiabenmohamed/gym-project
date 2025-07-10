"use client";
import { useEffect, useState, useRef } from "react";
import { Toaster } from "sonner";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Side from "@/components/login/side1";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosLogOut } from "react-icons/io";
import { useAuth } from "../auth-context";
import Image from "next/image";
import Link from "next/link";
import { io, Socket } from "socket.io-client";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "trainer" | "member";
  createdAt: string;
  avatarUrl?: string;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    console.log("isLoggedIn", isLoggedIn);

    // Blur the focused element before logout to prevent focus issues
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/";
    });
  };

  useEffect(() => {
    let socket: Socket | null = null;
    let isMounted = true;

    const initializeSocket = (userId: string) => {
      socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connecté :", socket?.id);
        socket?.emit("user_connected", userId);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket déconnecté");
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Erreur de connexion socket :", error);
      });

      socket.on("connection_error", (data) => {
        console.error("❌ Erreur de connexion utilisateur :", data.message);
      });

      socket.on("update_online_status", (data) => {
        console.log(
          `👤 Statut mis à jour pour ${data.userId}: ${data.isOnline ? "en ligne" : "hors ligne"}`
        );
      });
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data._id) {
          setIsLoggedIn(true);
          const userData: User = {
            _id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
            avatarUrl: data.profileImageUrl || "",
          };
          setUser(userData);
          initializeSocket(data._id);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error(
          "❌ Erreur lors de la récupération des données utilisateur :",
          error
        );
        setIsLoggedIn(false);
      })
      .finally(() => setIsLoading(false));

    return () => {
      isMounted = false;
      if (socket) {
        socket.disconnect();
        console.log("🔌 Socket déconnectée");
      }
    };
  }, []);

  // Add keyboard event handler to manage focus
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // If Escape is pressed and dropdown is open, close it and blur focus
      if (event.key === "Escape" && dropdownTriggerRef.current) {
        dropdownTriggerRef.current.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading)
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <>
      <Toaster position="top-right" richColors />
      {user ? (
        <SidebarProvider>
          <Side user={user} logoutAction={handleLogout} />

          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between pr-8">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      ref={dropdownTriggerRef}
                      className="w-8 h-8 rounded-full overflow-hidden shadow relative border-none outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                      onBlur={(e) => {
                        // Ensure focus is properly managed when button loses focus
                        const target = e.currentTarget; // ✅ on stocke la référence
                        target.setAttribute("tabindex", "-1");

                        setTimeout(() => {
                          target.setAttribute("tabindex", "0");
                        }, 100);
                      }}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${user.avatarUrl}`}
                        alt={`${user.firstName} ${user.lastName} avatar`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="w-full px-4 py-2 rounded-md text-left cursor-pointer hover:bg-accent hover:!text-white transition-colors"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={handleLogout}
                        className="flex gap-2 items-center w-full cursor-pointer hover:bg-accent hover:!text-white "
                      >
                        <IoIosLogOut className="text-lg" />
                        <span>Log out</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <div className="h-[100vh] flex justify-center items-center">
          <div>Please log in to continue</div>
        </div>
      )}
    </>
  );
}
