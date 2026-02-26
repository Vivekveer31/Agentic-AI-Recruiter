import { useState, useEffect } from "react";
import { emailTemplates as initialTemplates } from "@/data/mockData";
import { Mail, Edit, Send, Copy, CheckCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categoryColor: Record<string, string> = {
  Shortlist: "badge-strong",
  Interview: "text-primary bg-primary/10 border border-primary/20",
  Rejection: "badge-reject",
  Custom: "text-accent-foreground bg-accent border border-accent-foreground/20",
};

export default function EmailAutomation() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selected, setSelected] = useState(templates[0].id);
  const [editing, setEditing] = useState(false);
  const template = templates.find(t => t.id === selected)!;
  const [body, setBody] = useState(template.body);
  const [subject, setSubject] = useState(template.subject);

  // Sync body and subject when template changes
  useEffect(() => {
    const t = templates.find(t => t.id === selected)!;
    setBody(t.body);
    setSubject(t.subject);
    setEditing(false);
  }, [selected, templates]);

  const handleSave = () => {
    setTemplates(prev => prev.map(t => t.id === selected ? { ...t, body, subject } : t));
    setEditing(false);
    toast.success("Template saved successfully!");
  };

  const handleSendTest = () => {
    // Simulate replacing variables
    const previewBody = body
      .replace(/\{\{name\}\}/g, "John Doe")
      .replace(/\{\{role\}\}/g, "Senior Frontend Engineer")
      .replace(/\{\{date\}\}/g, "2026-03-01")
      .replace(/\{\{recruiter_name\}\}/g, "Neha Rastogi")
      .replace(/\{\{total\}\}/g, "574")
      .replace(/\{\{round\}\}/g, "Technical Round 1")
      .replace(/\{\{interviewer\}\}/g, "Ravi Kumar")
      .replace(/\{\{time\}\}/g, "10:00 AM")
      .replace(/\{\{meet_link\}\}/g, "https://meet.google.com/abc-defg-hij");
    
    toast.success("Test email sent to neha@talentai.io!");
  };

  const handleAddTemplate = () => {
    const newId = `e${Date.now()}`;
    const newTemplate = {
      id: newId,
      name: "New Template",
      subject: "Enter subject line",
      body: "Enter email body here...\n\nUse {{name}}, {{role}}, {{date}} as variables.",
      category: "Custom" as string,
      sentCount: 0,
    };
    setTemplates(prev => [...prev, newTemplate]);
    setSelected(newId);
    setEditing(true);
    toast.success("New template created");
  };

  const handleDelete = (id: string) => {
    if (templates.length <= 1) { toast.error("Cannot delete the last template"); return; }
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (selected === id) setSelected(templates.find(t => t.id !== id)!.id);
    toast.success("Template deleted");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {templates.slice(0, 3).map(t => (
          <div key={t.id} className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{t.sentCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.name}</p>
            <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColor[t.category] || categoryColor.Custom}`}>{t.category}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Template List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Templates</p>
            <button onClick={handleAddTemplate} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {templates.map(t => (
            <div key={t.id} className="relative group">
              <button
                onClick={() => setSelected(t.id)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all",
                  selected === t.id ? "border-primary/50 bg-primary/5" : "glass-card border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{t.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{t.subject}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColor[t.category] || categoryColor.Custom}`}>{t.category}</span>
                  <span className="text-[10px] text-muted-foreground">{t.sentCount} sent</span>
                </div>
              </button>
              {templates.length > 1 && (
                <button
                  onClick={() => handleDelete(t.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard.writeText(body); toast.success("Copied!"); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Edit className="w-3 h-3" /> {editing ? "Preview" : "Edit"}
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all">
                <CheckCircle className="w-3 h-3" /> Save
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Body</label>
            {editing ? (
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full h-64 bg-secondary border border-border rounded-lg p-3 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              />
            ) : (
              <div className="h-64 bg-secondary border border-border rounded-lg p-4 overflow-y-auto">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">{body}</pre>
              </div>
            )}
          </div>

          <div className="p-3 bg-accent/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground"><span className="text-accent-foreground font-medium">Variables:</span> Use {`{{name}}`}, {`{{role}}`}, {`{{date}}`}, {`{{recruiter_name}}`}, {`{{total}}`}, {`{{round}}`}, {`{{interviewer}}`}</p>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSendTest} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all btn-primary-glow">
              <Send className="w-3.5 h-3.5" /> Send Test Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
