import { useState } from "react";
import { jobRoles as initialRoles } from "@/data/mockData";
import { Briefcase, Plus, Users, CheckCircle, PauseCircle, X, Save, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function JobRoles() {
  const [roles, setRoles] = useState(initialRoles);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", openings: "", experience: "", skills: "", description: "" });

  const handleCreate = () => {
    if (!form.title || !form.department) {
      toast.error("Please fill in required fields (Title, Department)");
      return;
    }
    const newRole = {
      id: `jr${Date.now()}`,
      title: form.title,
      department: form.department,
      openings: parseInt(form.openings) || 1,
      applications: 0,
      shortlisted: 0,
      status: "Active" as const,
    };
    setRoles(prev => [newRole, ...prev]);
    setForm({ title: "", department: "", openings: "", experience: "", skills: "", description: "" });
    setShowForm(false);
    toast.success(`Job role "${form.title}" created successfully!`);
  };

  const toggleStatus = (id: string) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r));
    const role = roles.find(r => r.id === id)!;
    toast.success(`${role.title} ${role.status === "Active" ? "paused" : "activated"}`);
  };

  const deleteRole = (id: string) => {
    const role = roles.find(r => r.id === id)!;
    setRoles(prev => prev.filter(r => r.id !== id));
    toast.success(`${role.title} deleted`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{roles.length} job roles across departments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all btn-primary-glow"
        >
          {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Create Job Role</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6 border border-primary/20 animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> New Job Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Job Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Frontend Engineer" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Department *</label>
              <input type="text" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Engineering" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Number of Openings</label>
              <input type="number" value={form.openings} onChange={e => setForm(f => ({ ...f, openings: e.target.value }))} placeholder="e.g. 3" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Min. Experience (years)</label>
              <input type="text" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="e.g. 4" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block">Required Skills</label>
              <input type="text" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, TypeScript, GraphQL, AWS" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block">Job Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Paste full JD here — AI will extract skills automatically..." className="w-full bg-secondary border border-border rounded-lg p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
            </div>
          </div>
          <button onClick={handleCreate} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all">
            <Save className="w-3.5 h-3.5" /> Create Role
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((job) => (
          <div key={job.id} className="glass-card rounded-xl p-5 hover:border-primary/30 border border-border transition-all duration-200 group relative">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleStatus(job.id)} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full cursor-pointer transition-all", job.status === "Active" ? "badge-strong hover:opacity-80" : "badge-borderline hover:opacity-80")}>
                  {job.status === "Active" ? <><CheckCircle className="w-3 h-3 inline mr-1" />Active</> : <><PauseCircle className="w-3 h-3 inline mr-1" />Paused</>}
                </button>
                <button onClick={() => deleteRole(job.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-danger p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{job.department}</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 bg-secondary rounded-lg">
                <p className="text-sm font-bold text-foreground">{job.openings}</p>
                <p className="text-[10px] text-muted-foreground">Openings</p>
              </div>
              <div className="text-center p-2 bg-secondary rounded-lg">
                <p className="text-sm font-bold text-foreground">{job.applications}</p>
                <p className="text-[10px] text-muted-foreground">Applied</p>
              </div>
              <div className="text-center p-2 bg-secondary rounded-lg">
                <p className="text-sm font-bold text-success">{job.shortlisted}</p>
                <p className="text-[10px] text-muted-foreground">Shortlisted</p>
              </div>
            </div>
            {job.applications > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Pipeline health</span>
                  <span>{Math.round((job.shortlisted / job.applications) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(job.shortlisted / job.applications) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
