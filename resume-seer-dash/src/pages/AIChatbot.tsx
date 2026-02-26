import { useState, useRef, useEffect } from "react";
import {
  Send, Bot, User, Sparkles, RotateCcw, Copy, Check,
  Zap, AlertCircle, Calendar, Mail, Search, RefreshCw, Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { runAgent } from "@/lib/api";
import { cacheGet, cacheSet, cacheClear, cacheSize } from "@/lib/chatCache";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
  fromCache?: boolean;
  actions?: DetectedAction[];
}

interface DetectedAction {
  type: "schedule" | "email" | "search" | "evaluate";
  label: string;
  detail?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const SUGGESTIONS = [
  "Who are the top 5 candidates for the Senior Frontend role?",
  "Summarize the hiring pipeline status",
  "What skills are most in-demand across open roles?",
  "Find top ML engineers and schedule interviews for the best 3",
  "Compare ATS scores for the latest batch of resumes",
];

function detectActions(text: string): DetectedAction[] {
  const actions: DetectedAction[] = [];
  const lower = text.toLowerCase();
  if (lower.includes("meet.google.com") || lower.includes("scheduled interview") || lower.includes("meeting scheduled")) {
    const link = text.match(/https:\/\/meet\.google\.com\/[a-z0-9-]+/)?.[0];
    actions.push({ type: "schedule", label: "Interview Scheduled", detail: link });
  }
  if (lower.includes("email sent") || lower.includes("invitation sent") || lower.includes("sent successfully")) {
    actions.push({ type: "email", label: "Email Sent" });
  }
  if ((lower.includes("top") && lower.includes("candidate")) || lower.includes("found") || lower.includes("similarity_score")) {
    actions.push({ type: "search", label: "Candidates Retrieved" });
  }
  if (lower.includes("final_score") || lower.includes("credibility_score") || lower.includes("ats_score")) {
    actions.push({ type: "evaluate", label: "Candidate Evaluated" });
  }
  return actions;
}

const ACTION_ICON: Record<DetectedAction["type"], React.ReactNode> = {
  schedule: <Calendar className="w-3 h-3" />,
  email: <Mail className="w-3 h-3" />,
  search: <Search className="w-3 h-3" />,
  evaluate: <Sparkles className="w-3 h-3" />,
};
const ACTION_COLOR: Record<DetectedAction["type"], string> = {
  schedule: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  email: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  search: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  evaluate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [storedCount, setStoredCount] = useState(cacheSize());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    // --- Cache check ---
    const cached = cacheGet(text.trim());
    if (cached) {
      const actions = detectActions(cached);
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: "assistant", content: cached, timestamp: new Date(), fromCache: true, actions },
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    // --- Real API call ---
    try {
      const data = await runAgent(text.trim());
      const response = data.agent_response;
      cacheSet(text.trim(), response);
      setStoredCount(cacheSize());
      const actions = detectActions(response);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: response, timestamp: new Date(), fromCache: false, actions },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: `**Failed to reach the AI agent.**\n\n\`${msg}\`\n\nMake sure the backend is running at \`http://localhost:8000\`.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => { setMessages([]); setIsLoading(false); };

  const handleClearCache = () => { cacheClear(); setStoredCount(0); };

  const retryLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) sendMessage(lastUser.content);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">TalentAI Assistant</h2>
            <p className="text-xs text-muted-foreground">Connected to live HR agent · ask anything about candidates, roles, or hiring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Cache indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Zap className="w-3 h-3" />
            <span className="text-[10px] font-medium">{storedCount} cached</span>
            {storedCount > 0 && (
              <button onClick={handleClearCache} title="Clear cache" className="ml-1 hover:text-amber-200 transition-colors">
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          {messages.length > 0 && (
            <button onClick={resetChat} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary">
              <RotateCcw className="w-3 h-3" /> New chat
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/50 p-4 space-y-1">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-foreground">How can I help you today?</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                I can search candidates, evaluate profiles, schedule interviews, and send emails — all from a single prompt.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all duration-200 text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3 py-2", msg.role === "user" ? "justify-end" : "justify-start")}>
            {(msg.role === "assistant" || msg.role === "error") && (
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", msg.role === "error" ? "bg-red-500/15" : "bg-primary/15")}>
                {msg.role === "error" ? <AlertCircle className="w-3.5 h-3.5 text-red-400" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
              </div>
            )}

            <div className={cn("max-w-[85%] group relative", msg.role === "user" ? "order-first" : "")}>
              {/* Cache / live badge */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  {msg.fromCache ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                      <Zap className="w-2.5 h-2.5" /> from cache
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> live response
                    </span>
                  )}
                </div>
              )}

              {/* Bubble */}
              <div className={cn(
                "rounded-xl px-4 py-3 text-sm",
                msg.role === "user" ? "bg-primary text-primary-foreground ml-auto"
                  : msg.role === "error" ? "bg-red-500/10 text-foreground border border-red-500/30"
                  : "bg-secondary/60 text-foreground border border-border/50"
              )}>
                {msg.role === "user" ? (
                  <span>{msg.content}</span>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none [&_table]:text-xs [&_table]:w-full [&_th]:text-left [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-muted-foreground [&_th]:font-medium [&_td]:py-1 [&_td]:pr-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-0 [&_h4]:text-xs [&_h4]:font-semibold [&_h4]:mb-1 [&_p]:text-sm [&_p]:leading-relaxed [&_li]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:bg-background/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-background/60 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:text-xs [&_strong]:text-foreground [&_hr]:border-border/50 [&_hr]:my-3">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Action chips */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.actions.map((a, i) => (
                    <span key={i} className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border", ACTION_COLOR[a.type])}>
                      {ACTION_ICON[a.type]}
                      {a.label}
                      {a.detail && (
                        <a href={a.detail} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">open</a>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Error retry */}
              {msg.role === "error" && (
                <button onClick={retryLast} className="mt-2 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              )}

              {/* Copy button */}
              {msg.role === "assistant" && (
                <button
                  onClick={() => copyToClipboard(msg.id, msg.content)}
                  className="absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                  title="Copy"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 py-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-secondary/60 border border-border/50 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Agent is thinking</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="mt-3 flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about candidates, roles, or tell the agent to take action…"
            rows={1}
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/40 select-none pointer-events-none">⏎</span>
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <Send className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground/40 mt-1.5">
        Shift + Enter for new line · Same queries are cached for 24 h
      </p>
    </div>
  );
}
