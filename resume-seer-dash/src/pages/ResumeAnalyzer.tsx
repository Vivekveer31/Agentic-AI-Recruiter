import { useState, useRef } from "react";
import { candidates as initialCandidates } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Search, Upload, ChevronUp, ChevronDown, Eye, CheckCircle, XCircle, AlertCircle, FileText, X, Loader2, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadResumes, type UploadResumeResult } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
  if (status === "Strong") return (
    <span className="badge-strong inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
      <CheckCircle className="w-3 h-3" /> Strong
    </span>
  );
  if (status === "Borderline") return (
    <span className="badge-borderline inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
      <AlertCircle className="w-3 h-3" /> Borderline
    </span>
  );
  return (
    <span className="badge-reject inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
      <XCircle className="w-3 h-3" /> Reject
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "analyzing" | "done" | "error";
  email?: string;
  atsScore?: number;
  errorMsg?: string;
}

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState<"atsScore" | "skillMatch">("atsScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [candidates] = useState(initialCandidates);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const ALLOWED = new Set([".pdf", ".png", ".jpg", ".jpeg"]);
    const valid = fileArray.filter(f => {
      const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
      return ALLOWED.has(ext);
    });
    const invalid = fileArray.filter(f => !valid.includes(f));

    if (invalid.length) {
      toast.error(`${invalid.length} unsupported file(s) skipped (PDF / PNG / JPG only)`);
    }
    if (valid.length === 0) return;

    // Add placeholder rows with uploading state
    const placeholders: UploadedFile[] = valid.map(f => ({
      name: f.name,
      size: f.size,
      progress: 10,
      status: "uploading" as const,
    }));
    setUploadedFiles(prev => [...prev, ...placeholders]);

    // Animate progress bar during upload
    const progressTimers: Record<string, ReturnType<typeof setInterval>> = {};
    valid.forEach(f => {
      progressTimers[f.name] = setInterval(() => {
        setUploadedFiles(prev => prev.map(pf =>
          pf.name === f.name && pf.status === "uploading"
            ? { ...pf, progress: Math.min(pf.progress + Math.random() * 15, 90) }
            : pf
        ));
      }, 300);
    });

    // Transition to "analyzing"
    setUploadedFiles(prev => prev.map(pf =>
      valid.some(f => f.name === pf.name) ? { ...pf, status: "analyzing", progress: 95 } : pf
    ));

    try {
      const result = await uploadResumes(valid);

      // Stop all progress timers
      Object.values(progressTimers).forEach(clearInterval);

      // Build lookup for results by filename
      const resultMap: Record<string, UploadResumeResult> = {};
      result.results.forEach(r => {
        // The API returns email; we match via filename positioning
      });
      // Map results in order
      const resultsByIdx: (UploadResumeResult | null)[] = valid.map((_, i) => result.results[i] ?? null);
      const errorsByIdx: ({ filename: string; error: string } | null)[] = valid.map(f =>
        result.errors.find(e => e.filename === f.name) ?? null
      );

      setUploadedFiles(prev => prev.map(pf => {
        const idx = valid.findIndex(f => f.name === pf.name);
        if (idx === -1) return pf;
        const res = resultsByIdx[idx];
        const err = errorsByIdx[idx];
        if (err) return { ...pf, status: "error", progress: 100, errorMsg: err.error };
        if (res) return { ...pf, status: "done", progress: 100, email: res.email, atsScore: res.ats_score };
        return { ...pf, status: "done", progress: 100 };
      }));

      if (result.processed > 0) {
        toast.success(`${result.processed} resume(s) processed and stored in Pinecone`);
      }
      if (result.skipped > 0) {
        toast.warning(`${result.skipped} file(s) skipped — check errors`);
      }
    } catch (err) {
      Object.values(progressTimers).forEach(clearInterval);
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadedFiles(prev => prev.map(pf =>
        valid.some(f => f.name === pf.name) ? { ...pf, status: "error", progress: 0, errorMsg: msg } : pf
      ));
      toast.error(`Upload failed: ${msg}`);
    }
  };

  const removeFile = (name: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== name));
  };

  const filtered = candidates
    .filter(c => {
      const q = search.toLowerCase();
      return (c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
        && (statusFilter === "All" || c.status === statusFilter);
    })
    .sort((a, b) => {
      const diff = a[sortField] - b[sortField];
      return sortDir === "desc" ? -diff : diff;
    });

  const toggleSort = (field: "atsScore" | "skillMatch") => {
    if (sortField === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "glass-card rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <Upload className={cn("w-8 h-8 mx-auto mb-3", isDragging ? "text-primary" : "text-muted-foreground")} />
        <p className="text-sm font-medium text-foreground">Drop resumes here or <span className="text-primary cursor-pointer hover:underline">browse files</span></p>
        <p className="text-xs text-muted-foreground mt-1">Supports PDF, PNG, JPG • Bulk upload • OCR extracts text → LLM summarises → Pinecone stores</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            AI Engine Ready
          </div>
          <div className="text-xs text-muted-foreground">|</div>
          <div className="text-xs text-muted-foreground">{candidates.length} resumes analyzed</div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-foreground">Uploaded Files ({uploadedFiles.length})</h4>
            <button onClick={() => setUploadedFiles([])} className="text-[10px] text-muted-foreground hover:text-foreground">Clear All</button>
          </div>
          {uploadedFiles.map(file => (
            <div key={file.name} className={cn("flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
              file.status === "error" ? "bg-red-500/10 border-red-500/20" :
              file.status === "done" ? "bg-emerald-500/5 border-emerald-500/15" :
              "bg-secondary border-border"
            )}>
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground truncate max-w-[200px]">{file.name}</p>
                  <div className="flex items-center gap-2">
                    {file.status === "uploading" && (
                      <span className="text-[10px] text-primary flex items-center gap-1">
                        <CloudUpload className="w-3 h-3" /> {Math.round(file.progress)}%
                      </span>
                    )}
                    {file.status === "analyzing" && (
                      <span className="text-[10px] text-warning flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Analyzing…
                      </span>
                    )}
                    {file.status === "done" && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Done
                      </span>
                    )}
                    {file.status === "error" && (
                      <span className="text-[10px] text-red-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Error
                      </span>
                    )}
                    <button onClick={() => removeFile(file.name)} className="text-muted-foreground hover:text-foreground ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {(file.status === "uploading" || file.status === "analyzing") && (
                  <div className="w-full h-1 bg-border rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", file.status === "analyzing" ? "bg-amber-500" : "bg-primary")}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Result row */}
                {file.status === "done" && file.email && (
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-muted-foreground truncate">{file.email}</span>
                    {file.atsScore !== undefined && (
                      <span className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                        file.atsScore >= 8 ? "bg-emerald-500/15 text-emerald-400" :
                        file.atsScore >= 5 ? "bg-amber-500/15 text-amber-400" :
                        "bg-red-500/15 text-red-400"
                      )}>
                        ATS {file.atsScore.toFixed(1)}
                      </span>
                    )}
                  </div>
                )}

                {/* Error message */}
                {file.status === "error" && file.errorMsg && (
                  <p className="text-[10px] text-red-400/80 mt-1 truncate">{file.errorMsg}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Analyzed", value: candidates.length, color: "text-foreground" },
          { label: "Strong Match", value: candidates.filter(c => c.status === "Strong").length, color: "text-success" },
          { label: "Borderline", value: candidates.filter(c => c.status === "Borderline").length, color: "text-warning" },
          { label: "Rejected", value: candidates.filter(c => c.status === "Reject").length, color: "text-danger" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-lg p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-1">
          {["All", "Strong", "Borderline", "Reject"].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg font-medium transition-all",
                statusFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {[
                { label: "Candidate", sortable: false },
                { label: "Role", sortable: false },
                { label: "Experience", sortable: false },
                { label: "ATS Score", sortable: true, key: "atsScore" as const },
                { label: "Skill Match", sortable: true, key: "skillMatch" as const },
                { label: "Status", sortable: false },
                { label: "Action", sortable: false },
              ].map(col => (
                <th key={col.label} className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                  {col.sortable ? (
                    <button onClick={() => toggleSort(col.key!)} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      {col.label}
                      {sortField === col.key ? (
                        sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                      ) : <ChevronDown className="w-3 h-3 opacity-30" />}
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No candidates match your filters.</td></tr>
            ) : filtered.map((c, i) => (
              <tr key={c.id} className={cn("table-row-hover border-b border-border/50", i % 2 === 0 ? "" : "bg-secondary/20")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.role}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.experience}</td>
                <td className="px-4 py-3"><ScoreBar score={c.atsScore} /></td>
                <td className="px-4 py-3"><ScoreBar score={c.skillMatch} /></td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/analyzer/${c.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-primary/20 hover:text-primary border border-border hover:border-primary/30 rounded-lg transition-all text-xs font-medium text-muted-foreground"
                  >
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
