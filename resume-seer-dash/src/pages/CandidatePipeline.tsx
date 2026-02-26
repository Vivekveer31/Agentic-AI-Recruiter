import { useState } from "react";
import { candidates } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Users, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = ["Applied", "Screened", "Shortlisted", "Interviewing", "Offer", "Hired"];

const stageMap: Record<string, string> = {
  "Reject": "Screened",
  "Borderline": "Screened",
  "Strong": "Shortlisted",
};

// Assign stages with some variety
const candidateStages = candidates.map((c, i) => ({
  ...c,
  stage: i === 0 ? "Interviewing" : i === 3 ? "Offer" : i === 4 ? "Interviewing" : stageMap[c.status] || "Applied",
}));

export default function CandidatePipeline() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STAGES.map(stage => {
          const count = candidateStages.filter(c => c.stage === stage).length;
          return (
            <div key={stage} className="glass-card rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-foreground">{count}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stage}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {STAGES.map(stage => {
          const stageCandidates = candidateStages.filter(c => c.stage === stage);
          return (
            <div key={stage} className="min-w-[160px]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-foreground">{stage}</span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">{stageCandidates.length}</span>
              </div>
              <div className="space-y-2">
                {stageCandidates.map(c => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/pipeline/${c.id}`)}
                    className={cn(
                      "glass-card rounded-lg p-3 cursor-pointer border transition-all duration-200 hover:border-primary/40",
                      selected === c.id ? "border-primary/50 bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                      <span className="text-[10px] font-bold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{c.role.split(" ").slice(0, 2).join(" ")}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn(
                        "text-[10px] font-semibold",
                        c.atsScore >= 80 ? "text-success" : c.atsScore >= 60 ? "text-primary" : "text-warning"
                      )}>{c.atsScore}</span>
                      {c.status === "Strong" && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
                      {c.status === "Borderline" && <div className="w-1.5 h-1.5 rounded-full bg-warning" />}
                      {c.status === "Reject" && <div className="w-1.5 h-1.5 rounded-full bg-danger" />}
                    </div>
                  </div>
                ))}
                {stageCandidates.length === 0 && (
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* All Candidates Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">All Candidates</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Candidate</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Stage</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">ATS</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidateStages.map((c, i) => (
              <tr key={c.id} className={cn("table-row-hover border-b border-border/50", i % 2 === 0 ? "" : "bg-secondary/20")}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <span className="font-medium text-foreground">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{c.role}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-secondary rounded-full text-foreground text-[10px] font-medium">{c.stage}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("font-semibold", c.atsScore >= 80 ? "text-success" : c.atsScore >= 60 ? "text-primary" : "text-warning")}>{c.atsScore}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => navigate(`/pipeline/${c.id}`)} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <Eye className="w-3 h-3" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
