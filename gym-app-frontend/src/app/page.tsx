"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/vitrine/Navbar";
import Hero from "@/components/vitrine/Hero";
import Pricing from "@/components/vitrine/Pricing";
import About from "@/components/vitrine/About";
import Footer from "@/components/vitrine/Footer";
import NavbarLog from "@/components/login/NavbarLog";
import { useAuth } from "./auth-context";
import { IoIosLogOut } from "react-icons/io";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Side from "@/components/login/side1";
import Image from "next/image";
import Link from "next/link";
import DashboardAdmin from "@/components/dashboard/dashboardAdmin";
import DashboardTrainer from "@/components/dashboard/dashboardTrainer";
import { DashboardMember } from "@/components/dashboard/dashboardMember";
import { io, Socket } from "socket.io-client";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "trainer" | "member";
  createdAt: string;
  avatarUrl?: string; // URL de la photo (optionnelle)
};

export default function Home() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ← Ajout

  const handleLogout = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setIsLoggedIn(false);
      setUser(null);
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

      // Écouter les mises à jour de statut en ligne
      socket.on("update_online_status", (data) => {
        console.log(
          `👤 Statut mis à jour pour ${data.userId}: ${data.isOnline ? "en ligne" : "hors ligne"}`
        );
        // Ici vous pouvez mettre à jour l'état local des utilisateurs en ligne
      });
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          // Pas connecté, réponse attendue
          return null;
        }

        if (!res.ok) {
          // Autre erreur HTTP
          throw new Error(`Erreur serveur : ${res.status}`);
        }

        return res.json();
      })
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

          // Initialiser la socket après avoir récupéré les données utilisateur
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
  if (isLoading)
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <Loader2 className="animate-spin"></Loader2>
      </div>
    ); // ← Ne rien afficher tant que la requête n'est pas terminée
  return (
    <div>
      <div className="w-screen overflow-x-hidden">
        {/* Affiche la navigation en fonction de l'état de connexion */}
        {isLoggedIn && user ? (
          <div>
            <SidebarProvider>
              <Side user={user} logoutAction={handleLogout}></Side>
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
                        <button className="w-8 h-8 rounded-full overflow-hidden shadow relative border-none outline-none focus:outline-none">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${user.avatarUrl}`}
                            alt="avatar"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
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
                </header>{" "}
                {user.role === "admin" ? (
                  <div>
                    <DashboardAdmin />
                  </div>
                ) : user.role === "trainer" ? (
                  <DashboardTrainer userme={user} />
                ) : (
                  <DashboardMember user={user} />
                )}
              </SidebarInset>
            </SidebarProvider>
          </div>
        ) : (
          // <NavbarLog user={user} /> // Affiche une barre de navigation différente pour les utilisateurs connectés
          <div>
            <Navbar /> // Barre de navigation classique pour les non-connectés
            <Hero />
            <Pricing />
            <About />
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}
