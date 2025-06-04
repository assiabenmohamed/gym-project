"use client";

import * as React from "react";
import {
  Bot,
  BookOpen,
  Settings,
  Dumbbell,
  Activity,
  BadgeDollarSign,
  CalendarCheck,
} from "lucide-react";
import { FaClipboardList } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";

import { MdSportsGymnastics } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "@/app/page";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoIosLogOut } from "react-icons/io";

type NavbarLogProps = {
  user: User; // Le prop 'user' doit être de type User
};
// This is sample data.
const data = {
  admin: [
    {
      title: "Members",
      url: "/members",
      icon: FaUsers,
    },
    {
      title: "Trainers",
      url: "/trainers",
      icon: MdSportsGymnastics,
    },
    {
      title: "Subscription Plans",
      url: "/subscription-plans",
      icon: FaFileInvoiceDollar,
    },
    {
      title: "Payments",
      url: "/payments",
      icon: BadgeDollarSign,
    },
  ],
  trainer: [
    {
      title: "Programs",
      url: "/programs",
      icon: FaClipboardList,
    },
    {
      title: "Exercises",
      url: "/exercises",
      icon: Dumbbell,
    },
    {
      title: "Body Tracking",
      url: "/body-tracking-coach",
      icon: Activity,
    },
  ],
  member: [
    {
      title: "My Sessions",
      url: "/sessions",
      icon: CalendarCheck,
    },
    {
      title: "Exercises List",
      url: "/exercises-list",
      icon: Dumbbell,
    },
    {
      title: "My Body Tracking",
      url: "/body-tracking",
      icon: Activity,
    },
  ],
};
type AppSidebarProps = React.ComponentProps<typeof Sidebar> &
  NavbarLogProps & {
    logoutAction: () => void;
  };
export function AppSidebar({ user, logoutAction, ...props }: AppSidebarProps) {
  function LogOut() {
    // Exemple simple : supprime les cookies/session et redirige
    // Tu peux aussi appeler ton API pour déconnecter côté serveur
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "/"; // Redirige vers la page d'accueil
    });
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-center justify-center ">
          <Image
            src="/logowhite.png"
            alt="Logo"
            width={100}
            height={100}
          ></Image>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavUser user={user} />
        <NavMain items={data[user.role]} />
      </SidebarContent>
      <SidebarFooter>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600  rounded-md transition"
          onClick={logoutAction}
        >
          <IoIosLogOut className="text-lg" />
          <span>Log out</span>
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
