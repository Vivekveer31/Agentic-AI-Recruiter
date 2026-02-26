import { useState } from "react";
import { talentPool } from "@/data/mockData";
import { Search, Bell, BellOff, Tag, Database, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TAGS = ["All", "React", "Python", "ML/AI", "Leadership", "Cloud", "Design"];

export default function TalentPool() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [pool, setPool] = useState(talentPool);

  const toggleNotify = (id: string) => {
    setPool(prev => prev.map(t => t.id === id ? { ...t, notify: !t.notify } : t));
    const p = pool.find(t => t.id === id)!;
    toast.success(`${p.notify ? "Disabled" : "Enabled"} job match notifications for ${p.name}`);
  };

  const filtered = pool.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q);
    const matchTag = activeTag === "All" || t.tags.some(tag => tag.toLowerCase().includes(activeTag.toLowerCase()));
    return matchSearch && matchTag;
  });

  const statusColor: Record<string, string> = {
    "Available": "badge-strong",
    "Open to Offers": "text-primary bg-primary/10 border border-primary/20",
    "Passively Looking": "badge-borderline",
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{pool.length}</p>
          <p className="text-xs text-muted-foreground">Saved Candidates</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-success">{pool.filter(p => p.status === "Available").length}</p>
          <p className="text-xs text-muted-foreground">Available Now</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{pool.filter(p => p.notify).length}</p>
          <p className="text-xs text-muted-foreground">Notified on Match</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search talent pool..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-3 py-1.5 text-[11px] rounded-lg font-medium transition-all",
                activeTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >{tag}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(candidate => (
          <div key={candidate.id} className="glass-card rounded-xl p-5 hover:border-primary/30 border border-border transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{candidate.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-xs font-bold text-foreground">{candidate.score}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {candidate.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-accent text-accent-foreground rounded-md text-[10px] font-medium">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[candidate.status]}`}>{candidate.status}</span>
              <span className="text-[10px] text-muted-foreground">Last seen {candidate.lastSeen}</span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[10px] text-muted-foreground">Job match alerts</span>
              <button
                onClick={() => toggleNotify(candidate.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all",
                  candidate.notify ? "bg-success/10 text-success border border-success/20" : "bg-secondary text-muted-foreground border border-border"
                )}
              >
                {candidate.notify ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                {candidate.notify ? "On" : "Off"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
