"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/app/page";
import Image from "next/image";
type NavbarLogProps = {
  user: User; // Le prop 'user' doit être de type User
};
export function NavUser({ user }: NavbarLogProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative w-[45px] h-[45px] rounded-full overflow-hidden shadow border-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${user.avatarUrl}`}
                  alt="avatar"
                  fill
                  sizes="(max-width: 768px) 32px, 64px"
                  className="object-cover"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.lastName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
