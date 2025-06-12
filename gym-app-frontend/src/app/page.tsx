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
import DashboardMember from "@/components/dashboard/dashboardMember";
export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "trainer" | "member";
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      credentials: "include", // ✅ important
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) {
          setIsLoggedIn(true);
          // Extraire uniquement les informations nécessaires
          const userData: User = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            avatarUrl: data.profileImageUrl || "", // Prendre avatarUrl s'il existe
          };
          setUser(userData);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setIsLoading(false)); // ← Met fin au chargement
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
                            className="object-cover"
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button
                            onClick={handleLogout}
                            className="flex gap-2 items-center"
                          >
                            <IoIosLogOut className="text-lg" />
                            <span>Log out</span>
                          </button>{" "}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </header>{" "}
                {user.role === "admin" ? (
                  <div>
                    <DashboardAdmin /> hello
                  </div>
                ) : user.role === "trainer" ? (
                  <DashboardTrainer />
                ) : (
                  <DashboardMember />
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
