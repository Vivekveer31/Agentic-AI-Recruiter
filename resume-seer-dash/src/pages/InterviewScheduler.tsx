import { useState } from "react";
import { scheduledInterviews as initialInterviews, candidates } from "@/data/mockData";
import { Calendar, Clock, User, CheckCircle, AlertCircle, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROUNDS = ["Technical Round 1", "Technical Round 2", "System Design", "Case Study", "Culture Fit", "Portfolio Review", "Final Round"];

export default function InterviewScheduler() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0].id);
  const [selectedRound, setSelectedRound] = useState(ROUNDS[0]);
  const [selectedDate, setSelectedDate] = useState("2026-02-28");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [interviewer, setInterviewer] = useState("Ravi Kumar");
  const [interviews, setInterviews] = useState(initialInterviews);

  const shortlisted = candidates.filter(c => c.status === "Strong");
  const cand = candidates.find(c => c.id === selectedCandidate)!;

  const emailPreview = `Subject: Interview Scheduled: ${cand.role} — ${selectedDate} at ${selectedTime} IST

Dear ${cand.name},

We'd like to schedule your ${selectedRound} interview for the ${cand.role} position.

Details:
• Date: ${selectedDate}
• Time: ${selectedTime} IST
• Duration: 60 minutes
• Interviewer: ${interviewer}
• Platform: Google Meet

Meet link will be shared 30 minutes before the interview.

Best regards,
Neha Rastogi
TalentAI | Talent Acquisition`;

  const handleSchedule = () => {
    const newInterview = {
      id: `i${Date.now()}`,
      candidate: cand.name,
      role: cand.role,
      round: selectedRound,
      date: selectedDate,
      time: selectedTime.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
        const hour = parseInt(h);
        return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
      }),
      interviewer,
      status: "Confirmed" as const,
    };
    setInterviews(prev => [newInterview, ...prev]);
    toast.success(`Interview scheduled for ${cand.name} on ${selectedDate}. Email sent!`);
  };

  const handleCancel = (id: string) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
    toast.success("Interview cancelled");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scheduler Form */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Schedule Interview</h3>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Select Candidate</label>
            <select
              value={selectedCandidate}
              onChange={e => setSelectedCandidate(e.target.value)}
              className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {shortlisted.map(c => <option key={c.id} value={c.id}>{c.name} — {c.role}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Interview Round</label>
            <select
              value={selectedRound}
              onChange={e => setSelectedRound(e.target.value)}
              className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {ROUNDS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Time (IST)</label>
              <input
                type="time"
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Interviewer</label>
            <input
              type="text"
              value={interviewer}
              onChange={e => setInterviewer(e.target.value)}
              className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <button
            onClick={handleSchedule}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all btn-primary-glow"
          >
            <Send className="w-3.5 h-3.5" /> Confirm & Send Invite
          </button>
        </div>

        {/* Email Preview */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Email Preview</h3>
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{emailPreview}</pre>
          </div>
        </div>
      </div>

      {/* Scheduled Interviews */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Upcoming Interviews</h3>
          <span className="text-xs text-muted-foreground">{interviews.length} scheduled</span>
        </div>
        {interviews.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-muted-foreground">No interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {interviews.map(interview => (
              <div key={interview.id} className="px-5 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{interview.candidate.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{interview.candidate}</p>
                    <p className="text-[10px] text-muted-foreground">{interview.role} • {interview.round}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{interview.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{interview.time}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{interview.interviewer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", interview.status === "Confirmed" ? "badge-strong" : "badge-borderline")}>
                    {interview.status === "Confirmed" ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertCircle className="w-3 h-3 inline mr-1" />}
                    {interview.status}
                  </span>
                  <button onClick={() => handleCancel(interview.id)} className="text-muted-foreground hover:text-danger transition-colors p-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
