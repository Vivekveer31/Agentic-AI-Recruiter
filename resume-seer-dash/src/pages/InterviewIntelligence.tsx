import { useState } from "react";
import { candidates } from "@/data/mockData";
import { Brain, Copy, Download, RefreshCw, StickyNote, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const extraQuestions: Record<string, { q: string; type: string }[]> = {
  technical: [
    { q: "How do you handle technical debt while shipping features fast?", type: "Technical" },
    { q: "Describe your approach to writing testable, maintainable code.", type: "Technical" },
  ],
  behavioral: [
    { q: "How do you handle feedback that you disagree with?", type: "Behavioral" },
  ],
  skillGap: [
    { q: "What areas of your technical stack do you feel need improvement?", type: "Skill Gap" },
  ],
};

export default function InterviewIntelligence() {
  const [selectedId, setSelectedId] = useState(candidates[0].id);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedNotes, setSavedNotes] = useState<Record<string, boolean>>({});
  const [additionalQuestions, setAdditionalQuestions] = useState<Record<string, { q: string; type: string }[]>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const candidate = candidates.find(c => c.id === selectedId)!;
  const shortlisted = candidates.filter(c => c.status === "Strong");

  const baseQuestions = [
    ...candidate.interviewQuestions.technical.map(q => ({ q, type: "Technical" })),
    ...candidate.interviewQuestions.behavioral.map(q => ({ q, type: "Behavioral" })),
    ...candidate.interviewQuestions.skillGap.map(q => ({ q, type: "Skill Gap" })),
    ...candidate.interviewQuestions.followUp.map(q => ({ q, type: "Follow-up" })),
  ];

  const allQuestions = [...baseQuestions, ...(additionalQuestions[selectedId] || [])];

  const typeColor: Record<string, string> = {
    "Technical": "text-primary bg-primary/10 border-primary/20",
    "Behavioral": "text-success bg-success/10 border-success/20",
    "Skill Gap": "text-warning bg-warning/10 border-warning/20",
    "Follow-up": "text-danger bg-danger/10 border-danger/20",
  };

  const handleCopyAll = () => {
    const text = allQuestions.map((item, i) => `[${item.type}] Q${i + 1}: ${item.q}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success(`${allQuestions.length} questions copied to clipboard!`);
  };

  const handleCopyOne = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedIdx(idx);
    toast.success("Copied!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleGenerate = () => {
    const newQs = [
      ...Object.values(extraQuestions).flat().sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2)),
    ];
    setAdditionalQuestions(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), ...newQs],
    }));
    toast.success(`${newQs.length} new questions generated!`);
  };

  const handleExportPDF = () => {
    const text = `Interview Questions — ${candidate.name} (${candidate.role})\n${"=".repeat(50)}\n\n` +
      allQuestions.map((item, i) => `[${item.type}] Q${i + 1}: ${item.q}`).join("\n\n") +
      (notes[selectedId] ? `\n\n--- Interviewer Notes ---\n${notes[selectedId]}` : "");
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-questions-${candidate.name.toLowerCase().replace(/\s/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Questions exported!");
  };

  const handleSaveNotes = () => {
    setSavedNotes(prev => ({ ...prev, [selectedId]: true }));
    toast.success("Notes saved!");
    setTimeout(() => setSavedNotes(prev => ({ ...prev, [selectedId]: false })), 2000);
  };

  return (
    <div className="flex gap-5 h-full animate-fade-in">
      {/* Candidate List */}
      <div className="w-56 flex-shrink-0 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Shortlisted</p>
        {shortlisted.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedId === c.id ? "border-primary/50 bg-primary/10" : "border-border glass-card hover:border-primary/30"}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{c.role.split(" ").slice(0, 2).join(" ")}</p>
              </div>
            </div>
            <div className="mt-1.5 text-[10px] font-semibold text-success">{c.atsScore}/100</div>
          </button>
        ))}
      </div>

      {/* Questions Panel */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{candidate.name}</h3>
                <p className="text-xs text-muted-foreground">{candidate.role} • {allQuestions.length} questions generated</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3 h-3" /> Copy All
              </button>
              <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Download className="w-3 h-3" /> Export
              </button>
              <button onClick={handleGenerate} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all">
                <RefreshCw className="w-3 h-3" /> Generate More
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {allQuestions.map((item, i) => (
            <div key={i} className="glass-card rounded-lg p-4 border border-border hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${typeColor[item.type]}`}>{item.type}</span>
                  <p className="text-sm text-foreground leading-relaxed">{item.q}</p>
                </div>
                <button
                  onClick={() => handleCopyOne(item.q, i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  {copiedIdx === i ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Interviewer Notes</h3>
          </div>
          <textarea
            value={notes[selectedId] || ""}
            onChange={e => setNotes(prev => ({ ...prev, [selectedId]: e.target.value }))}
            placeholder="Add your notes, observations, and ratings during the interview..."
            className="w-full h-28 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
          <button
            onClick={handleSaveNotes}
            className="mt-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            {savedNotes[selectedId] ? <><CheckCircle className="w-3 h-3" /> Saved</> : <><StickyNote className="w-3 h-3" /> Save Notes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
