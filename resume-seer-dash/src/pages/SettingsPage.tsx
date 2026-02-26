import { useState } from "react";
import { toast } from "sonner";
import { Save, Users, Sliders, Mail, Calendar, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Job Roles", "Scoring", "Email", "Integrations", "Permissions"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Scoring");
  const [threshold, setThreshold] = useState(60);
  const [weights, setWeights] = useState({ skills: 40, experience: 30, education: 20, leadership: 10 });
  const [redFlags, setRedFlags] = useState({
    "Resume-LinkedIn discrepancy": true,
    "Employment gap detection": true,
    "Keyword stuffing detection": true,
    "Fake skill claim detection": true,
  });
  const [integrations, setIntegrations] = useState([
    { name: "Google Calendar", desc: "Sync interviews with Google Calendar", connected: true, icon: "🗓️" },
    { name: "Slack", desc: "Get hiring updates in Slack channels", connected: true, icon: "💬" },
    { name: "LinkedIn", desc: "Import candidates from LinkedIn", connected: false, icon: "💼" },
    { name: "Notion", desc: "Export reports to Notion workspace", connected: false, icon: "📝" },
    { name: "Greenhouse ATS", desc: "Sync with Greenhouse ATS", connected: true, icon: "🌱" },
    { name: "DocuSign", desc: "Send offer letters via DocuSign", connected: false, icon: "✍️" },
  ]);
  const [permissions, setPermissions] = useState([
    { name: "Neha Rastogi", email: "neha@talentai.io", role: "HR Director", access: "Full Access" },
    { name: "Ravi Kumar", email: "ravi@talentai.io", role: "Technical Lead", access: "Interview Only" },
    { name: "Dr. Anand Rao", email: "anand@talentai.io", role: "Engineering VP", access: "View Only" },
    { name: "Preethi S.", email: "preethi@talentai.io", role: "HR Associate", access: "Pipeline + Email" },
  ]);
  const [emailConfig, setEmailConfig] = useState({
    senderName: "TalentAI Recruiting",
    senderEmail: "recruit@talentai.io",
    replyTo: "hr@talentai.io",
    smtp: "smtp.sendgrid.net",
  });
  const [jobForm, setJobForm] = useState({ title: "", department: "", openings: "", experience: "", skills: "", description: "" });

  const toggleRedFlag = (flag: string) => {
    setRedFlags(prev => ({ ...prev, [flag]: !prev[flag as keyof typeof prev] }));
  };

  const toggleIntegration = (name: string) => {
    setIntegrations(prev => prev.map(i => i.name === name ? { ...i, connected: !i.connected } : i));
    const int = integrations.find(i => i.name === name)!;
    toast.success(`${name} ${int.connected ? "disconnected" : "connected"}!`);
  };

  const updatePermission = (email: string, access: string) => {
    setPermissions(prev => prev.map(p => p.email === email ? { ...p, access } : p));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Scoring" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Skill Weight Configuration</h3>
            </div>
            <p className="text-[10px] text-muted-foreground">Total: {Object.values(weights).reduce((a, b) => a + b, 0)}%</p>
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground capitalize">{key}</label>
                  <span className="text-xs font-bold text-primary">{val}%</span>
                </div>
                <input
                  type="range" min={0} max={70} value={val}
                  onChange={e => setWeights(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>
            ))}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">Minimum ATS Threshold</label>
                <span className="text-xs font-bold text-warning">{threshold}/100</span>
              </div>
              <input
                type="range" min={0} max={100} value={threshold}
                onChange={e => setThreshold(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Candidates below this score are auto-rejected</p>
            </div>
            <button onClick={() => toast.success("Scoring configuration saved!")} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              <Save className="w-3.5 h-3.5" /> Save Configuration
            </button>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">AI Model Settings</h3>
              <div className="space-y-3">
                {[
                  { label: "Resume parsing accuracy", value: "GPT-4o (High Accuracy)" },
                  { label: "Skill matching model", value: "Semantic + Keyword Hybrid" },
                  { label: "Interview Q generation", value: "Claude 3.5 Sonnet" },
                  { label: "Language support", value: "English, Hindi, Tamil" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Red Flag Detection</h3>
              <div className="space-y-2">
                {Object.entries(redFlags).map(([flag, enabled]) => (
                  <div key={flag} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{flag}</span>
                    <button
                      onClick={() => toggleRedFlag(flag)}
                      className={cn(
                        "w-8 h-4 rounded-full relative cursor-pointer transition-all duration-200",
                        enabled ? "bg-success/20 border border-success/30" : "bg-secondary border border-border"
                      )}
                    >
                      <div className={cn(
                        "w-3 h-3 rounded-full absolute top-0.5 transition-all duration-200",
                        enabled ? "right-0.5 bg-success" : "left-0.5 bg-muted-foreground"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Job Roles" && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Create Job Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Job Title", key: "title", placeholder: "e.g. Senior Frontend Engineer" },
              { label: "Department", key: "department", placeholder: "e.g. Engineering" },
              { label: "Number of Openings", key: "openings", placeholder: "e.g. 3" },
              { label: "Min. Experience (years)", key: "experience", placeholder: "e.g. 4" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground mb-1.5 block">{f.label}</label>
                <input
                  type="text"
                  value={jobForm[f.key as keyof typeof jobForm]}
                  onChange={e => setJobForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block">Required Skills (comma separated)</label>
              <input
                type="text"
                value={jobForm.skills}
                onChange={e => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="React, TypeScript, GraphQL, AWS, System Design"
                className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block">Job Description</label>
              <textarea
                rows={4}
                value={jobForm.description}
                onChange={e => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Paste full JD here — AI will extract skills, requirements and create scoring rubrics automatically..."
                className="w-full bg-secondary border border-border rounded-lg p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (!jobForm.title) { toast.error("Job title is required"); return; }
              toast.success(`Job role "${jobForm.title}" created!`);
              setJobForm({ title: "", department: "", openings: "", experience: "", skills: "", description: "" });
            }}
            className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Create Role
          </button>
        </div>
      )}

      {activeTab === "Email" && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Sender Name", key: "senderName" },
              { label: "Sender Email", key: "senderEmail" },
              { label: "Reply-to Email", key: "replyTo" },
              { label: "SMTP Server", key: "smtp" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground mb-1.5 block">{f.label}</label>
                <input
                  type="text"
                  value={emailConfig[f.key as keyof typeof emailConfig]}
                  onChange={e => setEmailConfig(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
          </div>
          <button onClick={() => toast.success("Email settings saved!")} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all">Save Settings</button>
        </div>
      )}

      {activeTab === "Integrations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map(int => (
            <div key={int.name} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center text-lg">{int.icon}</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{int.name}</p>
                  <p className="text-[10px] text-muted-foreground">{int.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggleIntegration(int.name)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                  int.connected ? "badge-strong hover:bg-danger/10 hover:text-danger hover:border-danger/20" : "bg-secondary border border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                )}
              >
                {int.connected ? "Connected ✓" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Permissions" && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> User Roles & Permissions</h3>
          <div className="space-y-3">
            {permissions.map(user => (
              <div key={user.email} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{user.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user.email} • {user.role}</p>
                  </div>
                </div>
                <select
                  value={user.access}
                  onChange={e => updatePermission(user.email, e.target.value)}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-[10px] text-foreground focus:outline-none"
                >
                  <option>Full Access</option>
                  <option>Pipeline + Email</option>
                  <option>Interview Only</option>
                  <option>View Only</option>
                </select>
              </div>
            ))}
          </div>
          <button onClick={() => toast.success("Permissions saved!")} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all">Save Permissions</button>
        </div>
      )}
    </div>
  );
}
