import { useState, useEffect, useRef } from "react";
import { Search, Bell, Command, X, User, Settings, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { candidates, jobRoles } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

const notifications = [
  { id: 1, text: "Arjun Sharma scored 91 — Strong Match", time: "2 min ago", read: false },
  { id: 2, text: "Interview with Priya Mehta confirmed for tomorrow", time: "15 min ago", read: false },
  { id: 3, text: "3 new applications for Senior Frontend Engineer", time: "1 hour ago", read: false },
  { id: 4, text: "Sneha Patel moved to Offer stage", time: "3 hours ago", read: true },
  { id: 5, text: "Email template 'Shortlist Notification' sent to 5 candidates", time: "5 hours ago", read: true },
];

export function TopNav({ title, subtitle }: TopNavProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setNotifOpen(false);
        setProfileOpen(false);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchResults = searchQuery.trim().length > 0
    ? [
        ...candidates
          .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4)
          .map(c => ({ type: "candidate" as const, label: c.name, sub: c.role, path: `/pipeline/${c.id}` })),
        ...jobRoles
          .filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 3)
          .map(j => ({ type: "job" as const, label: j.title, sub: `${j.applications} applicants`, path: "/jobs" })),
      ]
    : [];

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <>
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <button
            onClick={() => { setSearchOpen(true); setNotifOpen(false); setProfileOpen(false); }}
            className="relative hidden md:flex items-center h-8 pl-8 pr-10 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:border-primary/30 transition-colors w-56 cursor-pointer"
          >
            <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" />
            <span>Search candidates, jobs...</span>
            <div className="absolute right-2 flex items-center gap-0.5">
              <Command className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">K</span>
            </div>
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary-foreground">{unreadCount}</span>
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-10 w-80 glass-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                  <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifs.map(n => (
                    <div key={n.id} className={cn("px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer", !n.read && "bg-primary/5")}>
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                        <div>
                          <p className="text-xs text-foreground">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
            >
              <span className="text-xs font-semibold text-primary">NR</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-10 w-52 glass-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-foreground">Neha Rastogi</p>
                  <p className="text-[10px] text-muted-foreground">neha@talentai.io • HR Director</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate("/settings"); setProfileOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <User className="w-3.5 h-3.5" /> My Profile
                  </button>
                  <button onClick={() => { navigate("/settings"); setProfileOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </button>
                  <div className="border-t border-border my-1" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-xs text-danger hover:bg-secondary transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div onClick={e => e.stopPropagation()} className="relative w-full max-w-lg glass-card rounded-xl border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search candidates, jobs, pages..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="max-h-72 overflow-y-auto py-2">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-primary">{r.type === "candidate" ? "C" : "J"}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{r.label}</p>
                      <p className="text-[10px] text-muted-foreground">{r.sub}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-muted-foreground capitalize">{r.type}</span>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim().length > 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-muted-foreground">No results for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="py-6 px-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Quick Links</p>
                {[
                  { label: "Dashboard", path: "/" },
                  { label: "Resume Analyzer", path: "/analyzer" },
                  { label: "Candidate Pipeline", path: "/pipeline" },
                  { label: "Settings", path: "/settings" },
                ].map(link => (
                  <button
                    key={link.path}
                    onClick={() => { navigate(link.path); setSearchOpen(false); }}
                    className="block w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
            <div className="px-4 py-2 border-t border-border flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">↑↓ Navigate</span>
              <span className="text-[10px] text-muted-foreground">↵ Open</span>
              <span className="text-[10px] text-muted-foreground ml-auto">ESC Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
