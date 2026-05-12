import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCircuit,
  ChartColumnIncreasing,
  DatabaseZap,
  Gauge,
  Landmark,
  LogOut,
  Orbit,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FEATURE_DETAILS, FEATURE_KEYS, getFeatureRoute } from "../utils/featureRouting";

const revealMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" }
};

const piePalette = ["#d6b56d", "#1e7a67", "#2d9f89", "#f6f1e7"];

const tooltipStyle = {
  backgroundColor: "#0b2622",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  color: "#f6f1e7"
};

const GlassPanel = ({ children, className = "" }) => (
  <div className={`rounded-[28px] border border-white/10 bg-white/8 shadow-panel backdrop-blur-2xl ${className}`}>
    {children}
  </div>
);

const ChartWrap = ({ children, className = "" }) => (
  <div className={`rounded-[24px] border border-white/8 bg-ink/35 p-3 ${className}`}>{children}</div>
);

const populationTrend = [
  { year: "2024", population: 1443, dense: 491 },
  { year: "2027", population: 1494, dense: 508 },
  { year: "2030", population: 1549, dense: 526 },
  { year: "2033", population: 1606, dense: 544 },
  { year: "2036", population: 1669, dense: 565 }
];

const stateForecasts = [
  { state: "Maharashtra", population: 132, growth: "+17.4%" },
  { state: "Karnataka", population: 78, growth: "+19.2%" },
  { state: "Telangana", population: 46, growth: "+21.6%" },
  { state: "Gujarat", population: 81, growth: "+18.8%" }
];

const densityComparison = [
  { state: "Delhi", density: 11980 },
  { state: "Bihar", density: 1246 },
  { state: "West Bengal", density: 1102 },
  { state: "Kerala", density: 898 },
  { state: "Tamil Nadu", density: 617 }
];

const censusMix = [
  { name: "Urban", value: 31 },
  { name: "Rural", value: 69 }
];

const censusDistricts = [
  { district: "Lucknow", state: "Uttar Pradesh", households: "716K", literacy: "79.3%", sexRatio: "917" },
  { district: "Pune", state: "Maharashtra", households: "1.93M", literacy: "86.1%", sexRatio: "915" },
  { district: "Hyderabad", state: "Telangana", households: "861K", literacy: "83.2%", sexRatio: "954" },
  { district: "Jaipur", state: "Rajasthan", households: "1.12M", literacy: "75.5%", sexRatio: "909" }
];

const censusBreakdown = [
  { label: "Scheduled Castes", value: 16.6, fill: "#d6b56d" },
  { label: "Scheduled Tribes", value: 8.6, fill: "#1e7a67" },
  { label: "Working Population", value: 39.8, fill: "#2d9f89" },
  { label: "Children 0-6", value: 13.1, fill: "#f6f1e7" }
];

const insightTrend = [
  { period: "Q1", signal: 72, confidence: 82 },
  { period: "Q2", signal: 76, confidence: 84 },
  { period: "Q3", signal: 81, confidence: 87 },
  { period: "Q4", signal: 86, confidence: 91 }
];

const insightFeed = [
  { title: "Migration spike detected in western corridor", tag: "Trend", confidence: 92 },
  { title: "Delhi density pressure exceeds planning benchmark", tag: "Risk", confidence: 88 },
  { title: "Tier-2 cities show stronger than expected uptake", tag: "Opportunity", confidence: 85 },
  { title: "Healthcare demand pockets clustering near growth belt", tag: "Planning", confidence: 83 }
];

const anomalyStream = [
  { zone: "North Metro Ring", variance: "+14.8%", severity: "High" },
  { zone: "Western Growth Arc", variance: "+10.2%", severity: "Medium" },
  { zone: "Eastern District Cluster", variance: "-6.4%", severity: "Watch" },
  { zone: "Southern Industrial Belt", variance: "+8.7%", severity: "Medium" }
];

const chartSeries = [
  { year: "2021", population: 1408, births: 23, mobility: 8.2 },
  { year: "2022", population: 1421, births: 22, mobility: 8.7 },
  { year: "2023", population: 1435, births: 21, mobility: 9.1 },
  { year: "2024", population: 1450, births: 21, mobility: 9.6 },
  { year: "2025", population: 1468, births: 20, mobility: 10.4 }
];

const chartComposition = [
  { name: "Forecast", value: 38 },
  { name: "Census", value: 27 },
  { name: "AI Insight", value: 19 },
  { name: "Charts", value: 16 }
];

const featureConfigs = {
  population: {
    icon: BrainCircuit,
    eyebrow: "Population Prediction",
    title: "Long-range growth modeling for faster demographic planning.",
    description:
      "Explore scenario-based population expansion with premium dashboards, density signals, and state-level forecast surfaces tailored for protected analysis.",
    heroMetric: "2036 outlook",
    heroValue: "1.67B",
    stats: [
      { label: "Projected growth", value: 15.6, suffix: "%" },
      { label: "Forecast scenarios", value: 24 },
      { label: "States modeled", value: 36 },
      { label: "Density alerts", value: 142 }
    ],
    sections: [
      {
        id: "future-growth",
        label: "Future Growth",
        eyebrow: "Projection Engine",
        title: "Future population growth trajectory",
        description: "A clean executive view of long-range baseline expansion and density acceleration.",
        content: (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_340px]">
            <GlassPanel className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">National curve</p>
                  <h3 className="mt-2 font-display text-2xl text-cream">Population and density outlook</h3>
                </div>
                <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-gold">
                  AI forecast
                </span>
              </div>
              <ChartWrap className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={populationTrend}>
                    <defs>
                      <linearGradient id="populationArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d6b56d" stopOpacity={0.34} />
                        <stop offset="100%" stopColor="#d6b56d" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="year" stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="population" stroke="#d6b56d" fill="url(#populationArea)" strokeWidth={3} />
                    <Line type="monotone" dataKey="dense" stroke="#2d9f89" strokeWidth={2.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>

            <div className="space-y-5">
              {stateForecasts.map((item) => (
                <GlassPanel key={item.state} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                  <p className="text-xs uppercase tracking-[0.26em] text-cream/48">{item.state}</p>
                  <p className="mt-3 font-display text-3xl text-cream">{item.population}M</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-cream/72">
                    <span>Expected population</span>
                    <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-emerald-200">
                      {item.growth}
                    </span>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "state-lens",
        label: "State Lens",
        eyebrow: "Comparison Grid",
        title: "State-wise prediction cards",
        description: "Fast scanning cards and filters for analysts comparing growth momentum across key regions.",
        content: (
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <GlassPanel className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Prediction filters</p>
              <div className="mt-5 space-y-3">
                {["All states", "Urban priority", "High migration", "Density pressure"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      index === 0
                        ? "border-gold/30 bg-gold/10 text-gold"
                        : "border-white/10 bg-white/5 text-cream/76 hover:border-white/20"
                    }`}
                  >
                    <span>{item}</span>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </GlassPanel>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Metro acceleration", "22 cities crossing growth threshold", "High confidence"],
                ["Coastal expansion", "Ports continue pulling mobility corridors", "Stable signal"],
                ["Northern load", "Higher density raises infrastructure urgency", "Action needed"],
                ["Tier-2 upside", "Mid-size cities outperform historical trend", "Emerging"]
              ].map(([title, body, chip]) => (
                <GlassPanel key={title} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cream/62">
                    {chip}
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-cream">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-cream/70">{body}</p>
                </GlassPanel>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "density-chart",
        label: "Density Chart",
        eyebrow: "Pressure Mapping",
        title: "Population density comparison",
        description: "A premium bar view to compare high-pressure states and plan resource intensity.",
        content: (
          <GlassPanel className="p-5">
            <ChartWrap className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={densityComparison}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="state" stroke="#dce8e0" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`${value} people/km2`, "Density"]} contentStyle={tooltipStyle} />
                  <Bar dataKey="density" fill="#1e7a67" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrap>
          </GlassPanel>
        )
      },
      {
        id: "scenario-lab",
        label: "Scenario Lab",
        eyebrow: "Forecast Design",
        title: "Growth comparison graphs and scenario controls",
        description: "Prototype filters and scenario modules for premium forecasting workflows.",
        content: (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <GlassPanel className="p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Base year", "2011"],
                  ["Target year", "2036"],
                  ["Growth model", "Adaptive CAGR"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-cream/45">{label}</p>
                    <p className="mt-3 text-lg text-cream">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {["National", "State", "District", "City"].map((pill, index) => (
                  <span
                    key={pill}
                    className={`rounded-full border px-3 py-2 text-center text-sm ${
                      index === 1 ? "border-gold/30 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-cream/72"
                    }`}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-5">
              <p className="text-xs uppercase tracking-[0.26em] text-gold">Decision notes</p>
              <div className="mt-4 space-y-4">
                {[
                  "Urban districts require the highest service expansion pace.",
                  "States with rising in-migration show more resilient demand curves.",
                  "Density-heavy nodes need tighter infrastructure stress testing."
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-cream/72">
                    {item}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )
      }
    ]
  },
  census: {
    icon: Landmark,
    eyebrow: "Census 2011 Base Data",
    title: "Searchable baseline records with richer demographic context.",
    description:
      "Dive into long-form census views, quick lookup controls, and district-level cards built for protected exploration across India.",
    heroMetric: "Seeded records",
    heroValue: "700+",
    stats: [
      { label: "States covered", value: 36 },
      { label: "District records", value: 700, suffix: "+" },
      { label: "Urban share", value: 31, suffix: "%" },
      { label: "Validated fields", value: 128 }
    ],
    sections: [
      {
        id: "records",
        label: "Records",
        eyebrow: "Census Library",
        title: "Census 2011 records",
        description: "A modern records view with filters, cards, and high-signal summary containers.",
        content: (
          <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <GlassPanel className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Search filters</p>
              <div className="mt-5 space-y-3">
                {["Select state", "Select district", "Search city or town", "Filter by type"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream/65">
                    {item}
                  </div>
                ))}
              </div>
            </GlassPanel>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Population baseline", "1.21B indexed across state to city hierarchy"],
                ["Household records", "Structured coverage for granular lookup workflows"],
                ["District depth", "Comparison ready cards for regional planning"],
                ["Demographic mix", "Breakdowns for literacy, ratio, and working age"]
              ].map(([title, body]) => (
                <GlassPanel key={title} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                  <h3 className="font-display text-2xl text-cream">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-cream/70">{body}</p>
                </GlassPanel>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "district-table",
        label: "District Table",
        eyebrow: "District Lens",
        title: "District tables and lookup views",
        description: "Readable tables and glassmorphism shells for census-backed district inspection.",
        content: (
          <GlassPanel className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-cream/62">
                  <tr>
                    {["District", "State", "Households", "Literacy", "Sex Ratio"].map((item) => (
                      <th key={item} className="px-5 py-4 font-medium uppercase tracking-[0.18em]">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {censusDistricts.map((row) => (
                    <tr key={row.district} className="bg-ink/22 transition hover:bg-white/5">
                      <td className="px-5 py-4 text-cream">{row.district}</td>
                      <td className="px-5 py-4 text-cream/74">{row.state}</td>
                      <td className="px-5 py-4 text-cream/74">{row.households}</td>
                      <td className="px-5 py-4 text-cream/74">{row.literacy}</td>
                      <td className="px-5 py-4 text-cream/74">{row.sexRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        )
      },
      {
        id: "demographics",
        label: "Demographics",
        eyebrow: "Breakdown Board",
        title: "Demographic breakdown and visualization cards",
        description: "Premium composition views to support quick demographic storytelling.",
        content: (
          <div className="grid gap-5 xl:grid-cols-2">
            <GlassPanel className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gold">Urban-rural mix</p>
                  <h3 className="mt-2 font-display text-2xl text-cream">National composition</h3>
                </div>
              </div>
              <ChartWrap className="mt-5 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={censusMix} dataKey="value" innerRadius={70} outerRadius={108} paddingAngle={4}>
                      {censusMix.map((entry, index) => (
                        <Cell key={entry.name} fill={piePalette[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>

            <GlassPanel className="p-5">
              <ChartWrap className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={censusBreakdown} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 10 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <YAxis dataKey="label" type="category" stroke="#dce8e0" tickLine={false} axisLine={false} width={120} />
                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                      {censusBreakdown.map((entry) => (
                        <Cell key={entry.label} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>
          </div>
        )
      },
      {
        id: "quality",
        label: "Quality Signals",
        eyebrow: "Dataset Confidence",
        title: "Search, validation, and data visualization readiness",
        description: "Signals that show the dataset is ready for exploration and forecast seeding.",
        content: (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Schema consistency", "98.4%", "Strong structure across location tiers"],
              ["Field completeness", "96.1%", "Minimal missing values in seeded records"],
              ["Lookup speed", "<1s", "Fast state-to-city selection UX"],
              ["Visualization ready", "Yes", "Cards and charts can render directly"]
            ].map(([label, value, body]) => (
              <GlassPanel key={label} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                <p className="text-xs uppercase tracking-[0.22em] text-cream/45">{label}</p>
                <p className="mt-4 font-display text-3xl text-cream">{value}</p>
                <p className="mt-3 text-sm leading-7 text-cream/68">{body}</p>
              </GlassPanel>
            ))}
          </div>
        )
      }
    ]
  },
  insights: {
    icon: DatabaseZap,
    eyebrow: "AI-powered Insights",
    title: "Pattern detection, forecasting guidance, and anomaly surfacing in one stream.",
    description:
      "Use AI-shaped views to inspect trend movement, strategic recommendations, and high-signal anomalies with a premium scrolling experience.",
    heroMetric: "AI confidence",
    heroValue: "91%",
    stats: [
      { label: "Signals monitored", value: 128 },
      { label: "Trend detections", value: 42 },
      { label: "Recommendations", value: 18 },
      { label: "Anomalies flagged", value: 7 }
    ],
    sections: [
      {
        id: "analysis",
        label: "Analysis",
        eyebrow: "Live Insight Feed",
        title: "AI-generated analysis and trend detection",
        description: "A scrolling intelligence feed tuned for quick strategic interpretation.",
        content: (
          <div className="grid gap-4 md:grid-cols-2">
            {insightFeed.map((item) => (
              <GlassPanel key={item.title} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold">
                    {item.tag}
                  </span>
                  <span className="text-sm text-cream/58">{item.confidence}% confidence</span>
                </div>
                <p className="mt-5 text-lg leading-8 text-cream">{item.title}</p>
              </GlassPanel>
            ))}
          </div>
        )
      },
      {
        id: "heatmap",
        label: "Heatmap",
        eyebrow: "Signal Density",
        title: "Heatmaps and forecast summary",
        description: "A premium placeholder grid for regional intensity and forward-looking concentration.",
        content: (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <GlassPanel className="p-5">
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {Array.from({ length: 24 }).map((_, index) => {
                  const active = (index * 17) % 100;
                  return (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl border border-white/8"
                      style={{
                        background: `linear-gradient(180deg, rgba(214,181,109,${0.12 + active / 180}), rgba(30,122,103,${0.22 + active / 140}))`
                      }}
                    />
                  );
                })}
              </div>
            </GlassPanel>
            <GlassPanel className="p-5">
              <ChartWrap className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insightTrend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="period" stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="signal" stroke="#d6b56d" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="confidence" stroke="#2d9f89" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>
          </div>
        )
      },
      {
        id: "recommendations",
        label: "Recommendations",
        eyebrow: "Smart Actions",
        title: "Smart recommendations for planners",
        description: "Clear action cards translating AI outputs into planning direction.",
        content: (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Expand transport capacity", "Migration corridors now outpace prior assumptions in top metro rings."],
              ["Pre-stage healthcare assets", "High-density clusters show compounding service demand risk."],
              ["Prioritize Tier-2 monitoring", "Secondary cities now contribute more to growth upside than expected."]
            ].map(([title, body]) => (
              <GlassPanel key={title} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                <h3 className="font-display text-2xl text-cream">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-cream/70">{body}</p>
              </GlassPanel>
            ))}
          </div>
        )
      },
      {
        id: "anomalies",
        label: "Anomalies",
        eyebrow: "Risk Watch",
        title: "Population anomaly detection",
        description: "High-signal cards highlighting regions that diverge from the baseline model.",
        content: (
          <div className="grid gap-4 md:grid-cols-2">
            {anomalyStream.map((item) => (
              <GlassPanel key={item.zone} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-2xl text-cream">{item.zone}</p>
                  <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-gold">
                    {item.severity}
                  </span>
                </div>
                <p className="mt-4 text-sm text-cream/70">Variance from forecast baseline</p>
                <p className="mt-2 font-display text-4xl text-cream">{item.variance}</p>
              </GlassPanel>
            ))}
          </div>
        )
      }
    ]
  },
  charts: {
    icon: ChartColumnIncreasing,
    eyebrow: "Interactive Charts",
    title: "Executive-ready visuals for population, birth, and mobility trend reading.",
    description:
      "Browse multiple long-form visualization sections with polished placeholders, animated statistics, and premium chart presentation.",
    heroMetric: "Live modules",
    heroValue: "12",
    stats: [
      { label: "Chart families", value: 4 },
      { label: "Trend layers", value: 16 },
      { label: "Animated stats", value: 24 },
      { label: "Presentation cards", value: 8 }
    ],
    sections: [
      {
        id: "gallery",
        label: "Chart Gallery",
        eyebrow: "Visualization Deck",
        title: "Bar, line, and growth trend views",
        description: "A mixed gallery for interactive chart sections and presentation-ready insights.",
        content: (
          <div className="grid gap-5 xl:grid-cols-2">
            <GlassPanel className="p-5">
              <ChartWrap className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartSeries}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="year" stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="population" stroke="#d6b56d" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>

            <GlassPanel className="p-5">
              <ChartWrap className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartSeries}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="year" stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="births" fill="#1e7a67" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>
          </div>
        )
      },
      {
        id: "composition",
        label: "Composition",
        eyebrow: "Pie Board",
        title: "Pie charts and module composition",
        description: "A premium donut layout showing how chart modules can frame the product story.",
        content: (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <GlassPanel className="p-5">
              <ChartWrap className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartComposition} dataKey="value" innerRadius={74} outerRadius={112} paddingAngle={4}>
                      {chartComposition.map((item, index) => (
                        <Cell key={item.name} fill={piePalette[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrap>
            </GlassPanel>

            <div className="grid gap-4 sm:grid-cols-2">
              {chartComposition.map((item, index) => (
                <GlassPanel key={item.name} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: piePalette[index] }} />
                    <p className="text-sm uppercase tracking-[0.18em] text-cream/52">{item.name}</p>
                  </div>
                  <p className="mt-5 font-display text-4xl text-cream">{item.value}%</p>
                </GlassPanel>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "animated-stats",
        label: "Animated Stats",
        eyebrow: "Stat Stream",
        title: "Animated statistics and growth metrics",
        description: "Glassmorphism stat cards that reinforce the premium charting experience.",
        content: (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Population line", "5 layers", "Historical, projected, and confidence overlays"],
              ["Birth trend", "20 pts", "Multi-year comparisons for distribution reading"],
              ["Mobility curve", "+10.4", "Migration intensity marker"],
              ["Export presets", "8", "Board-ready visual presentation states"]
            ].map(([label, value, body]) => (
              <GlassPanel key={label} className="p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/25">
                <p className="text-xs uppercase tracking-[0.22em] text-cream/45">{label}</p>
                <p className="mt-4 font-display text-3xl text-cream">{value}</p>
                <p className="mt-3 text-sm leading-7 text-cream/68">{body}</p>
              </GlassPanel>
            ))}
          </div>
        )
      },
      {
        id: "trends",
        label: "Trend Deck",
        eyebrow: "Growth Trends",
        title: "Interactive growth trend placeholders",
        description: "An area chart module for motion-rich, stakeholder-friendly trend reading.",
        content: (
          <GlassPanel className="p-5">
            <ChartWrap className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries}>
                  <defs>
                    <linearGradient id="chartTrendArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2d9f89" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#2d9f89" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="year" stroke="#dce8e0" tickLine={false} axisLine={false} />
                  <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="mobility" stroke="#2d9f89" fill="url(#chartTrendArea)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrap>
          </GlassPanel>
        )
      }
    ]
  }
};

const AnimatedCounter = ({ value, label, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.65 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    const duration = 1100;
    let animationFrameId = 0;
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(value * progress);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [inView, value]);

  return (
    <div ref={ref} className="rounded-[24px] border border-white/10 bg-ink/32 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-cream/45">{label}</p>
      <p className="mt-4 font-display text-3xl text-cream">
        {prefix}
        {Math.round(displayValue).toLocaleString("en-IN")}
        {suffix}
      </p>
    </div>
  );
};

const FeatureDetailPage = ({ featureKey }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const config = useMemo(() => featureConfigs[featureKey], [featureKey]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowLoader(false);
    }, 550);

    return () => window.clearTimeout(timeoutId);
  }, [featureKey]);

  useEffect(() => {
    if (!config?.sections?.length) {
      return undefined;
    }

    const sectionIds = config.sections.map((section) => section.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7]
      }
    );

    sectionIds.forEach((sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    setActiveSection(sectionIds[0]);

    return () => observer.disconnect();
  }, [config]);

  if (!config) {
    return null;
  }

  const FeatureIcon = config.icon;

  return (
    <div className="min-h-screen bg-mesh font-body text-cream">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(214,181,109,0.16),transparent_22%),radial-gradient(circle_at_right_center,rgba(34,122,105,0.14),transparent_28%)]" />

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showLoader ? 1 : 0, pointerEvents: showLoader ? "auto" : "none" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#04110f]/90 backdrop-blur-xl"
      >
        <div className="rounded-[28px] border border-white/10 bg-white/8 px-8 py-7 text-center shadow-glow">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-ink">
            <FeatureIcon size={24} />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.28em] text-gold">{config.eyebrow}</p>
          <p className="mt-2 font-display text-2xl text-cream">Preparing immersive view</p>
        </div>
      </motion.div>

      <header className="sticky top-0 z-30 border-b border-white/8 bg-ink/45 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cream transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-ink">
                <FeatureIcon size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold">{config.eyebrow}</p>
                <p className="font-display text-xl text-cream">{FEATURE_DETAILS[featureKey].label}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cream/70 md:inline-flex">
              {user?.name || "Populens Analyst"}
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/10 p-6 shadow-glow backdrop-blur-2xl lg:p-8"
        >
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-gold/14 blur-3xl" />
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_330px]">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-gold">
                <FeatureIcon size={14} />
                {config.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
                {config.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-cream/74 sm:text-base">{config.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {config.stats.map((item) => (
                  <AnimatedCounter key={item.label} label={item.label} value={item.value} suffix={item.suffix || ""} />
                ))}
              </div>
            </div>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-gold">{config.heroMetric}</p>
              <p className="mt-4 font-display text-5xl text-cream">{config.heroValue}</p>
              <div className="mt-6 grid gap-3">
                {[
                  ["Secure route", FEATURE_DETAILS[featureKey].route],
                  ["Experience", "Long-scroll premium dashboard"],
                  ["Focus", FEATURE_DETAILS[featureKey].label]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-ink/32 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-cream/42">{label}</p>
                    <p className="mt-2 text-sm text-cream/80">{value}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <GlassPanel className="p-4">
              <p className="px-2 text-xs uppercase tracking-[0.28em] text-gold">Sections</p>
              <nav className="mt-4 space-y-2">
                {config.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                      activeSection === section.id
                        ? "border border-gold/30 bg-gold/10 text-gold"
                        : "border border-transparent bg-white/5 text-cream/72 hover:border-white/10 hover:text-cream"
                    }`}
                  >
                    <span>{section.label}</span>
                    <ArrowRight size={15} />
                  </a>
                ))}
              </nav>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-ink/28 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/45">Explore next</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FEATURE_KEYS.filter((item) => item !== featureKey).map((item) => (
                    <Link
                      key={item}
                      to={getFeatureRoute(item)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-cream/72 transition hover:border-gold/25 hover:text-gold"
                    >
                      {FEATURE_DETAILS[item].label}
                    </Link>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </aside>

          <div className="space-y-6">
            {config.sections.map((section) => (
              <motion.section
                key={section.id}
                id={section.id}
                {...revealMotion}
                className="scroll-mt-24"
              >
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">{section.eyebrow}</p>
                  <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">{section.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-8 text-cream/70 sm:text-base">{section.description}</p>
                </div>
                {section.content}
              </motion.section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeatureDetailPage;
