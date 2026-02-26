import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Executive Dashboard", subtitle: "Real-time overview of your hiring pipeline" },
  "/jobs": { title: "Job Roles", subtitle: "Manage open positions and hiring targets" },
  "/analyzer": { title: "Resume Analyzer", subtitle: "AI-powered bulk resume screening and scoring" },
  "/pipeline": { title: "Candidate Pipeline", subtitle: "Track and manage candidates across all stages" },
  "/interview-intelligence": { title: "Interview Intelligence", subtitle: "AI-generated questions and interview preparation" },
  "/scheduler": { title: "Interview Scheduler", subtitle: "Schedule and coordinate interviews seamlessly" },
  "/email-automation": { title: "Email Automation", subtitle: "Automated communication templates and campaigns" },
  "/talent-pool": { title: "Talent Pool", subtitle: "Saved candidates and future hiring opportunities" },
  "/analytics": { title: "Advanced Analytics", subtitle: "Deep insights into your recruitment funnel" },
  "/chatbot": { title: "AI Chatbot", subtitle: "Your intelligent recruitment assistant" },
  "/settings": { title: "Settings", subtitle: "Configure platform preferences and integrations" },
};

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const basePath = "/" + location.pathname.split("/")[1];
  const meta = PAGE_META[basePath] || PAGE_META["/"];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
