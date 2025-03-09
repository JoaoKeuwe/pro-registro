import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import CreateMeetingButton from "@/components/CreateMeetingButton";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  FileText,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  collapsed,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center py-3 px-4 rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50",
          isActive && "bg-accent text-foreground",
          collapsed ? "justify-center" : ""
        )
      }
    >
      <div className="flex items-center">
        {icon}
        {!collapsed && <span className="ml-3">{label}</span>}
      </div>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();

  if (!user) return null;

  return (
    <div
      className={cn(
        "h-full min-h-screen border-r border-border flex flex-col bg-background py-6 sidebar-transition",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center px-4 mb-6">
        {!collapsed && (
          <div className="text-2xl font-bold tracking-tight mr-auto">
            Pro<span className="text-primary">registro</span>
            <span className="text-primary text-xs align-top">®</span>
          </div>
        )}
        {collapsed && (
          <div className="text-xl font-bold tracking-tight mx-auto text-primary">
            P
          </div>
        )}
      </div>

      <div className="px-2 mb-4">
        {collapsed ? (
          <CreateMeetingButton
            variant="outline"
            size="icon"
            className="w-full justify-center"
          />
        ) : (
          <CreateMeetingButton variant="outline" className="w-full py-5" />
        )}
      </div>

      <div className="space-y-1 px-2">
        <SidebarItem
          icon={<Home className="w-5 h-5" />}
          label="Home"
          to="/"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FileText className="w-5 h-5" />}
          label="Registro de Atas"
          to="/registro"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Calendar className="w-5 h-5" />}
          label="Calendário"
          to="/calendario"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FileText className="w-5 h-5" />}
          label="Histórico"
          to="/historico"
          collapsed={collapsed}
        />
      </div>

      <div className="mt-auto space-y-1 px-2">
        <SidebarItem
          icon={<Settings className="w-5 h-5" />}
          label="Configurações"
          to="/configuracoes"
          collapsed={collapsed}
        />
      </div>

      <div className="mt-4 px-4 pt-4 border-t border-border">
        <div className={cn("flex", collapsed ? "flex-col items-center gap-4" : "items-center")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-2 text-sm">
              <p className="font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.organization}
              </p>
            </div>
          )}
          <div
            className={cn(
              collapsed ? "flex flex-col items-center gap-4" : "flex items-center ml-auto"
            )}
          >
            <ThemeToggle className={collapsed ? "h-8 w-8" : ""} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
