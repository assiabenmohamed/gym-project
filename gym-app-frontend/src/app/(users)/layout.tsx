"use client";
import { useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Side from "@/components/login/side1";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosLogOut } from "react-icons/io";
import { useAuth } from "../auth-context";
import Image from "next/image";
import Link from "next/link";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "trainer" | "member";
  avatarUrl?: string; // URL de la photo (optionnelle)
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ← Ajout
  const handleLogout = () => {
    console.log("isLoggedIn", isLoggedIn);
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
    <>
      {user ? (
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
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <div></div>
      )}
    </>

    // <SidebarProvider>
    //   <AppSidebar />
    //   <main>
    //     <SidebarTrigger />
    //     {children}
    //   </main>
    // </SidebarProvider>
  );
}
