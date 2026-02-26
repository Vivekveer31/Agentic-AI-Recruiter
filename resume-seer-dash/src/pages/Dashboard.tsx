import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Users, FileCheck, XCircle, Calendar, TrendingUp, Clock, CheckCircle, Briefcase,
  ArrowUpRight, Sparkles
} from "lucide-react";
import {
  dashboardMetrics, scoreDistribution, skillsDistribution,
  experienceDistribution, shortlistTrend, radarData
} from "@/data/mockData";

function AnimatedCounter({ end, duration = 1200 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count.toLocaleString()}</>;
}

const metrics = [
  { label: "Total Applications", value: 574, icon: Users, change: "+23%", trend: "up", color: "text-primary" },
  { label: "Shortlisted", value: 58, icon: FileCheck, change: "+12%", trend: "up", color: "text-success" },
  { label: "Rejected", value: 312, icon: XCircle, change: "-8%", trend: "down", color: "text-danger" },
  { label: "Interviews Scheduled", value: 24, icon: Calendar, change: "+31%", trend: "up", color: "text-warning" },
  { label: "Avg ATS Score", value: 71, icon: TrendingUp, change: "+4.2pts", trend: "up", color: "text-primary" },
  { label: "Active Jobs", value: 9, icon: Briefcase, change: "+2", trend: "up", color: "text-accent-foreground" },
  { label: "Offer Accept Rate", value: 84, icon: CheckCircle, change: "+5%", trend: "up", color: "text-success" },
  { label: "Avg Time to Hire", value: 18, icon: Clock, change: "-3 days", trend: "up", color: "text-warning" },
];

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card rounded-xl p-5 border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Powered</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Good morning, Neha 👋</h2>
            <p className="text-sm text-muted-foreground mt-0.5">You have <span className="text-warning font-semibold">14 pending reviews</span> and <span className="text-primary font-semibold">3 interviews</span> scheduled today.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary"><AnimatedCounter end={574} /></p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-success">91.4%</p>
              <p className="text-xs text-muted-foreground">AI Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div key={m.label} className="metric-card" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${m.trend === "up" ? "text-success" : "text-danger"}`}>
                <ArrowUpRight className={`w-3 h-3 ${m.trend === "down" ? "rotate-180" : ""}`} />
                {m.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {m.label === "Avg ATS Score" ? <>{m.value}<span className="text-base text-muted-foreground">/100</span></> :
               m.label === "Offer Accept Rate" ? <>{m.value}<span className="text-base text-muted-foreground">%</span></> :
               m.label === "Avg Time to Hire" ? <>{m.value}<span className="text-base text-muted-foreground"> d</span></> :
               <AnimatedCounter end={m.value} />}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score Distribution */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">ATS Score Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Resume quality breakdown across all applicants</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreDistribution} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 32% 14%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                {scoreDistribution.map((entry, index) => {
                  const score = parseInt(entry.range.split("-")[0]);
                  const color = score >= 81 ? "#10b981" : score >= 61 ? "#6366f1" : score >= 41 ? "#f59e0b" : "#ef4444";
                  return <Cell key={index} fill={color} fillOpacity={0.85} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Pie */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Role Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Applications by job function</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={skillsDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {skillsDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {skillsDistribution.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="text-foreground font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Line */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Weekly Shortlist vs Rejection Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">8-week hiring funnel performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={shortlistTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 32% 14%)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "hsl(215 20% 55%)" }} />
              <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} dot={false} name="Applications" />
              <Line type="monotone" dataKey="shortlisted" stroke="#10b981" strokeWidth={2} dot={false} name="Shortlisted" />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={false} name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Skill Gap Radar</h3>
          <p className="text-xs text-muted-foreground mb-4">Required vs candidate avg</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222 32% 14%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
              <Radar name="Required" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Candidates" dataKey="candidates" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Experience Distribution */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Experience Level Distribution</h3>
        <p className="text-xs text-muted-foreground mb-4">Years of experience across applicant pool</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={experienceDistribution} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 32% 14%)" />
            <XAxis dataKey="level" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Candidates" fill="#6366f1" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
