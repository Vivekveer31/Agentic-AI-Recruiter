import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Brain,
  Mail,
  Database,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Job Roles", icon: Briefcase, path: "/jobs" },
  { label: "Resume Analyzer", icon: FileText, path: "/analyzer" },
  { label: "Candidate Pipeline", icon: Users, path: "/pipeline" },
  { label: "Interview Intelligence", icon: Brain, path: "/interview-intelligence" },
  { label: "Interview Scheduler", icon: Calendar, path: "/scheduler" },
  { label: "Email Automation", icon: Mail, path: "/email-automation" },
  { label: "Talent Pool", icon: Database, path: "/talent-pool" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "AI Chatbot", icon: MessageSquare, path: "/chatbot" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-[64px]" : "w-[228px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary flex-shrink-0 animate-pulse-glow">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-sm font-bold text-foreground tracking-tight">TalentAI</span>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Copilot Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item group",
                isActive && "active"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && (
                <span className="truncate text-xs font-medium">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">NR</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-foreground truncate">Neha Rastogi</p>
              <p className="text-[10px] text-muted-foreground truncate">HR Director</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
