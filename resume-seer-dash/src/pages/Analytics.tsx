import { useState } from "react";
import {
  BarChart, Bar, FunnelChart, Funnel, LabelList,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { funnelData, diversityData, shortlistTrend, radarData, skillsDistribution } from "@/data/mockData";
import { TrendingDown, TrendingUp, Sliders } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-xs border border-border">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e"];

export default function Analytics() {
  const [weights, setWeights] = useState({ skills: 40, experience: 30, education: 20, culture: 10 });

  const handleWeight = (key: keyof typeof weights, val: number) => {
    const diff = val - weights[key];
    const others = Object.keys(weights).filter(k => k !== key) as (keyof typeof weights)[];
    const newWeights = { ...weights, [key]: val };
    const remaining = 100 - val;
    const totalOthers = others.reduce((s, k) => s + weights[k], 0);
    others.forEach(k => {
      newWeights[k] = Math.max(0, Math.round((weights[k] / totalOthers) * remaining));
    });
    setWeights(newWeights);
  };

  const projectedScore = Math.round(
    (weights.skills * 0.85 + weights.experience * 0.72 + weights.education * 0.68 + weights.culture * 0.91) / 100
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Funnel */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Hiring Funnel</h3>
        <p className="text-xs text-muted-foreground mb-4">Applications → Hired conversion analysis</p>
        <div className="flex items-end gap-1 h-48">
          {funnelData.map((stage, i) => (
            <div key={stage.stage} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-foreground">{stage.count}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${(stage.count / funnelData[0].count) * 160}px`,
                  background: `hsl(${243 - i * 25} 75% ${40 + i * 8}%)`,
                }}
              />
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{stage.stage}</span>
              <span className="text-[9px] text-muted-foreground">{stage.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Application Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">8-week pipeline performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={shortlistTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 32% 14%)" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} dot={false} name="Total" />
              <Line type="monotone" dataKey="shortlisted" stroke="#10b981" strokeWidth={2} dot={false} name="Shortlisted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Diversity */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Diversity Analysis</h3>
          <p className="text-xs text-muted-foreground mb-4">Applicant composition breakdown</p>
          <div className="space-y-4">
            {diversityData.map(group => (
              <div key={group.category}>
                <p className="text-xs font-medium text-foreground mb-2">{group.category}</p>
                <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                  {group.data.map((d, i) => (
                    <div
                      key={d.name}
                      style={{ width: `${d.value}%`, background: COLORS[i] }}
                      title={`${d.name}: ${d.value}%`}
                      className="transition-all duration-500"
                    />
                  ))}
                </div>
                <div className="flex gap-3 mt-1">
                  {group.data.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-[10px] text-muted-foreground">{d.name} {d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-If Simulator */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">What-If Score Simulator</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Adjust skill weights to see how it affects average candidate scores in real-time</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground capitalize">{key} Weight</label>
                  <span className="text-xs font-bold text-primary">{val}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={val}
                  onChange={e => handleWeight(key as keyof typeof weights, parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Projected Avg Score</p>
              <div className="w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center relative mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary"
                  style={{ clipPath: `inset(${100 - projectedScore}% 0 0 0 round 50%)` }} />
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{projectedScore}</p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Based on current applicant pool</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {projectedScore > 70 ? (
                  <><TrendingUp className="w-3 h-3 text-success" /><span className="text-xs text-success">Strong pool quality</span></>
                ) : (
                  <><TrendingDown className="w-3 h-3 text-warning" /><span className="text-xs text-warning">Adjust weights</span></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
