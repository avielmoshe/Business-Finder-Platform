import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Inbox,
  Upload,
  Settings,
  LogIn,
  NotebookPen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../Mode-toggle";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";

const menuItemsForGust = [
  { title: "Home", url: "/", icon: Home },
  { title: "About", url: "/about", icon: Inbox },
  { title: "login", url: "/login", icon: LogIn },
  { title: "signUp", url: "/signUp", icon: Settings },
];

const menuItemsForUser = [
  { title: "Home", url: "/", icon: Home },
  { title: "About", url: "/about", icon: Inbox },
  { title: "Settings", url: "/settings", icon: Settings },
];

const menuItemsForOwner = [
  { title: "Home", url: "/", icon: Home },
  { title: "About", url: "/about", icon: Inbox },
  { title: "Add New business", url: "/add-business", icon: Upload },
  { title: "your business", url: "/your-business/:id", icon: NotebookPen },
  { title: "Settings", url: "/settings", icon: Settings },
];
export function AppSidebar() {
  const { user } = useAuth();

  const menuItemsByRole = {
    gust: menuItemsForGust,
    user: menuItemsForUser,
    owner: menuItemsForOwner,
  };
  const roleIs = user?.role || "gust";
  const menuItems = menuItemsByRole[roleIs];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Finder</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <Link to={url} className="flex items-center gap-2">
                      <Icon />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <ModeToggle />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
