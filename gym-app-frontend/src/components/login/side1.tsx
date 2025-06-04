import { User } from "@/app/page";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
type NavbarLogProps = {
  user: User; // Le prop 'user' doit être de type User
  logoutAction: () => void;
};
export default function Side({ user, logoutAction }: NavbarLogProps) {
  return <AppSidebar user={user} logoutAction={logoutAction} />;
}
