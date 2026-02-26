import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidates } from "@/data/mockData";
import { ArrowLeft, Copy, ExternalLink, CheckCircle, XCircle, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#ef4444";
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="hsl(222 32% 14%)" strokeWidth="6" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="text-center">
        <p className="text-xl font-bold text-foreground">{score}</p>
        <p className="text-[9px] text-muted-foreground -mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

function SkillBar({ skill, score }: { skill: string; score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{skill}</span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const candidate = candidates.find(c => c.id === id);
  if (!candidate) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Candidate not found.</p>
    </div>
  );

  const tabs = ["overview", "experience", "questions", "analysis"];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to list
      </button>

      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
            <span className="text-xl font-bold text-primary">{candidate.name.split(" ").map(n => n[0]).join("")}</span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-foreground">{candidate.name}</h2>
              {candidate.status === "Strong" && <span className="badge-strong px-2.5 py-0.5 rounded-full text-xs font-medium">Strong Match</span>}
              {candidate.status === "Borderline" && <span className="badge-borderline px-2.5 py-0.5 rounded-full text-xs font-medium">Borderline</span>}
              {candidate.status === "Reject" && <span className="badge-reject px-2.5 py-0.5 rounded-full text-xs font-medium">Not Recommended</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{candidate.role} • {candidate.experience}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span>{candidate.email}</span>
              <span>|</span>
              <span>{candidate.phone}</span>
              <span>|</span>
              <span>{candidate.location}</span>
              <span>|</span>
              <span>{candidate.education}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {candidate.skills.map(s => (
                <span key={s} className="px-2 py-0.5 bg-accent text-accent-foreground rounded-md text-[11px] font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Score Ring */}
          <div className="text-center">
            <ScoreRing score={candidate.atsScore} />
            <p className="text-xs text-muted-foreground mt-1">ATS Score</p>
          </div>
          <div className="text-center">
            <ScoreRing score={candidate.skillMatch} />
            <p className="text-xs text-muted-foreground mt-1">Skill Match</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* AI Summary */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{candidate.summary}</p>
            </div>

            {/* Skill Scores */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Skill Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(candidate.skillScores).map(([skill, score]) => (
                  <SkillBar key={skill} skill={skill} score={score} />
                ))}
              </div>
            </div>

            {/* Match Explanation */}
            <div className="glass-card rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Why this score?</h3>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.matchExplanation}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Strengths */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Strengths</h3>
              <ul className="space-y-2">
                {candidate.strengths.map(s => (
                  <li key={s} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /> Areas of Concern</h3>
              <ul className="space-y-2">
                {candidate.weaknesses.map(w => (
                  <li key={w} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            {candidate.redFlags.length > 0 && (
              <div className="glass-card rounded-xl p-5 border border-danger/20">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-danger" /> Red Flags</h3>
                <ul className="space-y-2">
                  {candidate.redFlags.map(r => (
                    <li key={r} className="text-xs text-danger/80 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "experience" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Timeline */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Experience Timeline</h3>
            <div className="space-y-4">
              {candidate.experience_timeline.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary/30 flex-shrink-0" />
                    {i < candidate.experience_timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{exp.role}</p>
                    <p className="text-xs text-primary">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.period} • {exp.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Key Projects</h3>
            <div className="space-y-3">
              {candidate.projects.map((p, i) => (
                <div key={i} className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-success mt-1">📈 {p.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "questions" && (
        <div className="space-y-4">
          {[
            { label: "Technical Questions", items: candidate.interviewQuestions.technical, color: "text-primary" },
            { label: "Behavioral Questions", items: candidate.interviewQuestions.behavioral, color: "text-success" },
            { label: "Skill Gap Questions", items: candidate.interviewQuestions.skillGap, color: "text-warning" },
            { label: "Follow-up Questions", items: candidate.interviewQuestions.followUp, color: "text-danger" },
          ].filter(s => s.items.length > 0).map(section => (
            <div key={section.label} className="glass-card rounded-xl p-5">
              <h3 className={`text-sm font-semibold mb-3 ${section.color}`}>{section.label}</h3>
              <ul className="space-y-2">
                {section.items.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-xs text-muted-foreground/50 mt-0.5 w-4 flex-shrink-0">Q{i + 1}</span>
                    <span>{q}</span>
                    <button onClick={() => navigator.clipboard.writeText(q)} className="ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === "analysis" && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Full AI Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{candidate.summary}</p>
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground mb-2">Score Justification</p>
            <p className="text-xs text-muted-foreground">{candidate.matchExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
