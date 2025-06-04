"use client";

import { IconType } from "react-icons"; // utile pour typer les icônes

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: IconType;
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname(); // Récupère le chemin de la page actuelle

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link
                  href={item.url}
                  className={`capitalize font-medium hover:!text-accent transition-all ${
                    pathname === item.url ? " text-accent" : ""
                  }`}
                >
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="hover:!text-accent "
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
