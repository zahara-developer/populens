import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  ChartColumnIncreasing,
  DatabaseZap,
  MapPinned,
  Landmark,
  LockKeyhole,
  Orbit,
  ScanSearch,
  Sparkles,
  SquareDashedKanban,
  Users,
  Waypoints
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from "recharts";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { useAuth } from "../context/AuthContext";
import { getFeatureRoute, setSelectedFeature } from "../utils/featureRouting";

const topStates = [
  { state: "Uttar Pradesh", population: 199.8 },
  { state: "Maharashtra", population: 112.4 },
  { state: "Bihar", population: 104.1 },
  { state: "West Bengal", population: 91.3 },
  { state: "Madhya Pradesh", population: 72.6 }
];

const growthData = [
  { year: "2011", population: 1210 },
  { year: "2014", population: 1268 },
  { year: "2017", population: 1326 },
  { year: "2020", population: 1380 },
  { year: "2023", population: 1435 },
  { year: "2026", population: 1488 }
];

const cityInsightData = [
  { city: "Delhi", score: 92 },
  { city: "Mumbai", score: 88 },
  { city: "Bengaluru", score: 84 },
  { city: "Hyderabad", score: 79 }
];

const featureCards = [
  {
    key: "population",
    title: "Population Prediction",
    description: "Run realistic growth projections for Indian states, districts, and cities with transparent inputs.",
    icon: BrainCircuit,
    stat: "Forecast-ready",
    detail: "Scenario confidence improves with location-specific growth assumptions.",
    metric: "Forecast variance: +/- 2.4%"
  },
  {
    key: "census",
    title: "Census 2011 Base Data",
    description: "Use labeled baseline population records to drive dropdowns, autofill values, and exploration flows.",
    icon: Landmark,
    stat: "Structured seed data",
    detail: "Preloaded records accelerate demographic lookup and forecasting setup.",
    metric: "Seed coverage: states, districts, cities"
  },
  {
    key: "insights",
    title: "AI-powered Insights",
    description: "Translate raw demographic signals into cleaner strategic takeaways for planning and analysis.",
    icon: DatabaseZap,
    stat: "Decision support",
    detail: "Surface patterns faster with guided interpretation and trend emphasis.",
    metric: "Insight latency: near-instant summaries"
  },
  {
    key: "charts",
    title: "Interactive Charts",
    description: "Explore trends through premium line and bar visualizations with startup-grade presentation.",
    icon: ChartColumnIncreasing,
    stat: "Executive-ready",
    detail: "Presentation-friendly chart modules help stakeholders read shifts quickly.",
    metric: "Visual layers: line, bars, ranked comparisons"
  }
];

const stats = [
  {
    label: "Population",
    value: "1.44B",
    caption: "Census baseline",
    icon: Users,
    points: "M6 20 C18 18, 26 13, 36 14 S56 9, 70 8"
  },
  {
    label: "States & UTs",
    value: "36",
    caption: "India coverage",
    icon: MapPinned,
    points: "M6 20 L20 18 L32 16 L46 12 L58 10 L70 8"
  },
  {
    label: "Districts",
    value: "700+",
    caption: "Granular records",
    icon: SquareDashedKanban,
    points: "M6 20 C18 18, 30 19, 40 14 S58 12, 70 10"
  },
  {
    label: "Forecasting",
    value: "Smart",
    caption: "Scenario engine",
    icon: Sparkles,
    points: "M6 20 L18 18 L30 12 L42 14 L56 8 L70 6"
  }
];

const workSteps = [
  {
    title: "Select location",
    detail: "Move from state to district to city or town using structured demographic records.",
    icon: ScanSearch
  },
  {
    title: "Set growth assumptions",
    detail: "Adjust growth rate, start year, and target year to define the forecasting scenario.",
    icon: Waypoints
  },
  {
    title: "Model the result",
    detail: "Generate predicted population, growth amount, growth percentage, and projected time span.",
    icon: Orbit
  }
];

const previewCards = [
  {
    title: "Population Growth",
    description: "National baseline trend across modeled time intervals.",
    icon: ChartColumnIncreasing,
    type: "line"
  },
  {
    title: "Top 5 States",
    description: "Largest population clusters in the sample strategic view.",
    icon: Landmark,
    type: "bar"
  },
  {
    title: "Prediction Engine",
    description: "Forecast population from Census 2011 base data and growth assumptions.",
    icon: BrainCircuit,
    type: "engine"
  },
  {
    title: "Protected Access",
    description: "JWT-secured session management and private dashboard delivery.",
    icon: LockKeyhole,
    type: "security"
  },
  {
    title: "Census Dataset",
    description: "Multi-level records for state, district, and city exploration flows.",
    icon: DatabaseZap,
    type: "dataset"
  },
  {
    title: "City Insights",
    description: "Surface high-priority urban centers with stronger demographic momentum signals.",
    icon: Sparkles,
    type: "cities"
  }
];

const previewTabs = {
  Analytics: ["Population Growth", "Top 5 States", "City Insights"],
  Platform: ["Prediction Engine", "Census Dataset", "Protected Access"]
};

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 }
};

const renderPreviewContent = (type) => {
  if (type === "line") {
    return (
      <div className="h-36 rounded-[22px] border border-white/8 bg-ink bg-opacity-30 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="year" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0b2622",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                color: "#f6f1e7"
              }}
            />
            <Line type="monotone" dataKey="population" stroke="#d6b56d" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div className="h-36 rounded-[22px] border border-white/8 bg-ink bg-opacity-30 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topStates}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="state" hide />
            <YAxis hide />
            <Tooltip
              formatter={(value) => `${value}M`}
              contentStyle={{
                backgroundColor: "#0b2622",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                color: "#f6f1e7"
              }}
            />
            <Bar dataKey="population" fill="#1f7a68" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "engine") {
    return (
      <div className="rounded-[22px] border border-white/8 bg-ink bg-opacity-30 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-cream opacity-45">State</p>
            <p className="mt-2 text-cream">Maharashtra</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-cream opacity-45">Growth Rate</p>
            <p className="mt-2 text-cream">1.02%</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-cream opacity-45">Start Year</p>
            <p className="mt-2 text-cream">2011</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-cream opacity-45">Target Year</p>
            <p className="mt-2 text-cream">2035</p>
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-gold border-opacity-20 bg-gold bg-opacity-10 p-3">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Projected Result</p>
          <p className="mt-2 font-display text-2xl text-cream">143.2M</p>
        </div>
      </div>
    );
  }

  if (type === "security") {
    return (
      <div className="space-y-3 rounded-[22px] border border-white/8 bg-ink bg-opacity-30 p-4 text-sm text-cream opacity-70">
        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
          <span>JWT session</span>
          <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-xs text-emerald-100">Active</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
          <span>Password hashing</span>
          <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-xs text-emerald-100">bcryptjs</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
          <span>Protected route</span>
          <span className="rounded-full bg-gold bg-opacity-10 px-2 py-1 text-xs text-gold">/dashboard</span>
        </div>
      </div>
    );
  }

  if (type === "dataset") {
    return (
      <div className="rounded-[22px] border border-white/8 bg-ink bg-opacity-30 p-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            ["State", "Uttar Pradesh"],
            ["District", "Lucknow"],
            ["City", "Lucknow"],
            ["Base Pop.", "2.81M"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.24em] text-cream opacity-45">{label}</p>
              <p className="mt-2 text-sm text-cream">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-36 rounded-[22px] border border-white/8 bg-ink bg-opacity-30 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cityInsightData} layout="vertical" margin={{ top: 8, right: 10, left: 5, bottom: 8 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="city" type="category" width={70} tick={{ fill: "#dce8e0", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [`${value}`, "Insight Score"]}
            contentStyle={{
              backgroundColor: "#0b2622",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "#f6f1e7"
            }}
          />
          <Bar dataKey="score" fill="#d6b56d" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState("Analytics");
  const [activeStep, setActiveStep] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const goToStep = (index) => {
    const total = workSteps.length;
    setActiveStep((index + total) % total);
  };

  useEffect(() => {
    if (isCarouselPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % workSteps.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isCarouselPaused]);

  const handleFeatureSelect = (featureKey) => {
    if (user) {
      navigate(getFeatureRoute(featureKey));
      return;
    }

    setSelectedFeature(featureKey);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-mesh font-body text-cream">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left_top,rgba(214,181,109,0.14),transparent_28%),radial-gradient(circle_at_right_center,rgba(40,129,111,0.14),transparent_30%)]" />
      <Navbar />

      <main className="pb-8">
        <HeroSection />

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                onMouseEnter={() => setHoveredStat(stat.label)}
                onMouseLeave={() => setHoveredStat(null)}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-[22px] border bg-white/8 px-4 py-4 shadow-panel backdrop-blur-2xl transition-all duration-300 ${
                  hoveredStat && hoveredStat !== stat.label
                    ? "border-white/8 opacity-75"
                    : "border-white/10 opacity-100"
                } hover:border-gold hover:border-opacity-35 hover:shadow-[0_14px_32px_rgba(214,181,109,0.12)]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-cream opacity-45">{stat.label}</p>
                    <p className="mt-2 font-display text-2xl text-cream sm:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-xs text-cream opacity-[0.48]">{stat.caption}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cream opacity-80 transition-all duration-300 group-hover:border-gold group-hover:border-opacity-25 group-hover:bg-gold group-hover:bg-opacity-10 group-hover:text-gold">
                    <stat.icon size={18} />
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold bg-opacity-45 transition-all duration-300 group-hover:bg-gold group-hover:shadow-[0_0_10px_rgba(214,181,109,0.55)]" />
                    <span className="text-[10px] uppercase tracking-[0.24em] text-cream opacity-[0.32]">Live signal</span>
                  </div>
                  <svg
                    viewBox="0 0 76 24"
                    className="h-6 w-20 opacity-45 transition-all duration-300 group-hover:opacity-90"
                    aria-hidden="true"
                  >
                    <path
                      d={stat.points}
                      fill="none"
                      stroke="rgba(214,181,109,0.92)"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.34em] text-gold">Platform features</p>
            <h2 className="font-display text-3xl text-cream sm:text-4xl lg:text-5xl">
              A modern demographic intelligence platform with stronger visual depth
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-cream opacity-65 sm:text-base">
              Designed for premium forecasting workflows, Populens AI blends structured Indian population data,
              chart-rich interfaces, and secure product architecture in a cleaner SaaS-grade experience.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature, index) => (
              <motion.button
                key={feature.title}
                type="button"
                {...cardMotion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                onMouseEnter={() => setHoveredFeature(feature.title)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => handleFeatureSelect(feature.key)}
                whileHover={{ y: -8, scale: 1.03 }}
                className={`group relative min-h-[290px] overflow-hidden rounded-[28px] border bg-white/8 p-4 text-left shadow-panel transition-all duration-300 ease-out ${
                  hoveredFeature && hoveredFeature !== feature.title
                    ? "border-white/8 opacity-65"
                    : "border-white/10 opacity-100"
                } hover:border-gold hover:border-opacity-40 hover:shadow-[0_18px_45px_rgba(214,181,109,0.12)]`}
              >
                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#9a7a31] text-ink">
                    <feature.icon size={22} />
                  </div>
                  <span className="rounded-full border border-gold border-opacity-20 bg-gold bg-opacity-10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-gold">
                    {feature.stat}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl text-cream">{feature.title}</h3>
                <div className="mt-2 min-h-[52px]">
                  <p
                    className="text-sm leading-6 text-cream opacity-65 transition-all duration-300 group-hover:opacity-[0.72]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: hoveredFeature === feature.title ? "unset" : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 rounded-[18px] border border-white/8 bg-ink bg-opacity-30 p-3">
                  <svg
                    viewBox="0 0 160 56"
                    className="h-10 w-full opacity-50 transition duration-300 group-hover:opacity-95"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={`feature-line-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(214,181,109,0.35)" />
                        <stop offset="100%" stopColor="rgba(214,181,109,0.9)" />
                      </linearGradient>
                    </defs>
                    <path
                      d={
                        index === 0
                          ? "M6 44 C28 36, 42 22, 58 24 S92 18, 112 14 S140 10, 154 8"
                          : index === 1
                            ? "M6 40 L30 34 L54 30 L78 24 L102 20 L126 16 L154 12"
                            : index === 2
                              ? "M6 42 C22 38, 38 18, 58 20 S92 30, 110 22 S138 12, 154 16"
                              : "M6 44 L28 39 L50 27 L74 29 L98 18 L124 14 L154 10"
                      }
                      fill="none"
                      stroke={`url(#feature-line-${index})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {[18, 46, 82, 116, 146].map((cx, pointIndex) => (
                      <circle
                        key={cx}
                        cx={cx}
                        cy={
                          index === 0
                            ? [39, 28, 20, 14, 9][pointIndex]
                            : index === 1
                              ? [40, 34, 24, 18, 12][pointIndex]
                              : index === 2
                                ? [40, 22, 29, 18, 15][pointIndex]
                                : [41, 30, 28, 17, 10][pointIndex]
                        }
                        r="2.6"
                        fill="rgba(246,241,231,0.88)"
                        className="transition duration-300 group-hover:fill-[#d6b56d]"
                      />
                    ))}
                  </svg>
                </div>
                <div className="mt-4 overflow-hidden">
                  <div className="max-h-0 translate-y-2 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs uppercase tracking-[0.24em] text-gold">{feature.metric}</p>
                    <p className="mt-2 text-sm leading-6 text-cream opacity-[0.62]">{feature.detail}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="insights" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[34px] border border-white/10 bg-white/8 p-5 shadow-glow backdrop-blur-2xl md:p-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.34em] text-gold">Live dashboard preview</p>
              <h2 className="font-display text-3xl text-cream sm:text-4xl lg:text-5xl">
                Rich modules with real content, charts, metrics, and protected product signals
              </h2>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {Object.keys(previewTabs).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActivePreviewTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activePreviewTab === tab
                      ? "border-gold border-opacity-40 bg-gold bg-opacity-12 text-gold shadow-[0_10px_25px_rgba(214,181,109,0.12)]"
                      : "border-white/10 bg-white/6 text-cream opacity-68 hover:border-white/20 hover:text-cream"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div
              key={activePreviewTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-3"
            >
              {previewCards
                .filter((card) => previewTabs[activePreviewTab].includes(card.title))
                .map((card, index) => (
                  <motion.div
                    key={card.title}
                    {...cardMotion}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="rounded-[28px] border border-white/10 bg-ink bg-opacity-35 p-5 shadow-panel"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#9a7a31] text-ink">
                        <card.icon size={20} />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-cream opacity-65">
                        Preview
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-cream">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-cream opacity-65">{card.description}</p>
                    <div className="mt-4">{renderPreviewContent(card.type)}</div>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>

        <section id="forecasting" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-[0.34em] text-gold">How prediction works</p>

            <div
              className="mt-8 w-full max-w-5xl"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <div className="relative flex w-full items-center justify-center overflow-hidden py-4">
                <div className="w-full md:hidden">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mx-auto w-full max-w-[360px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,42,37,0.72),rgba(9,32,29,0.9))] p-5 shadow-[0_18px_48px_rgba(214,181,109,0.12)] backdrop-blur-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/85 to-teal text-ink">
                        {(() => {
                          const ActiveIcon = workSteps[activeStep].icon;
                          return <ActiveIcon size={20} />;
                        })()}
                      </div>
                      <span className="font-display text-3xl text-gold opacity-80">
                        {String(activeStep + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-2xl text-cream">{workSteps[activeStep].title}</h3>
                    <p className="mt-3 text-sm leading-7 text-cream opacity-68">{workSteps[activeStep].detail}</p>

                    <div className="mt-5 flex items-center gap-2">
                      <span className="h-1.5 w-10 rounded-full bg-gold bg-opacity-70" />
                      <span className="h-1.5 w-4 rounded-full bg-cream bg-opacity-35" />
                      <span className="h-1.5 w-2 rounded-full bg-cream bg-opacity-20" />
                    </div>
                  </motion.div>
                </div>

                <div className="hidden w-full items-center md:grid md:grid-cols-[0.28fr_0.44fr_0.28fr]">
                  {[-1, 0, 1].map((offset) => {
                    const index = (activeStep + offset + workSteps.length) % workSteps.length;
                    const step = workSteps[index];
                    const isActive = offset === 0;

                    return (
                      <div
                        key={`${step.title}-${offset}`}
                        className={`flex justify-center transition-all duration-500 ${
                          isActive ? "z-20 scale-100 opacity-100" : "z-10 scale-90 opacity-50"
                        } ${
                          offset === -1 ? "translate-x-6 md:translate-x-10" : ""
                        } ${
                          offset === 1 ? "-translate-x-6 md:-translate-x-10" : ""
                        }`}
                      >
                        <motion.div
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.25 }}
                          onClick={() => goToStep(index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              goToStep(index);
                            }
                          }}
                          className={`w-full max-w-[360px] cursor-pointer rounded-[30px] border bg-[linear-gradient(180deg,rgba(10,42,37,0.72),rgba(9,32,29,0.9))] p-5 backdrop-blur-xl transition-all duration-300 ${
                            isActive
                              ? "border-gold border-opacity-25 shadow-[0_18px_48px_rgba(214,181,109,0.12)]"
                              : "border-white/10 shadow-panel hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/85 to-teal text-ink">
                              <step.icon size={20} />
                            </div>
                            <span className="font-display text-3xl text-gold opacity-80">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <h3 className="mt-6 font-display text-2xl text-cream">{step.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-cream opacity-68">{step.detail}</p>

                          <div className="mt-5 flex items-center gap-2">
                            <span className="h-1.5 w-10 rounded-full bg-gold bg-opacity-70" />
                            <span className="h-1.5 w-4 rounded-full bg-cream bg-opacity-35" />
                            <span className="h-1.5 w-2 rounded-full bg-cream bg-opacity-20" />
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {workSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeStep === index ? "w-8 bg-gold" : "w-2.5 bg-white/25 hover:bg-white/45"
                  }`}
                  aria-label={`Go to ${step.title}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[34px] border border-white/10 bg-white/8 p-6 shadow-glow backdrop-blur-2xl md:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-gold">Launch the platform</p>
                <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl lg:text-5xl">
                  Secure forecasts, premium analytics, and richer demographic storytelling
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-cream opacity-68 sm:text-base">
                  Move from a public product overview to a protected intelligence workspace with polished UX on both mobile and desktop.
                </p>
              </div>
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Launch Populens AI
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-ink bg-opacity-35 px-5 py-6 text-sm text-cream opacity-60 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>Populens AI builds premium population forecasting experiences for modern Indian demographic analysis.</p>
            <p className="uppercase tracking-[0.28em] text-cream opacity-40">Census 2011 Base Data</p>
          </div>
        </div>
        <div className="mt-4 border-t border-white/10 py-4 text-sm text-white/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Populens AI</p>
            <div className="flex items-center gap-5">
              <Link to="/terms" className="transition-colors duration-300 hover:text-white">
                Terms &amp; Conditions
              </Link>
              <Link to="/privacy" className="transition-colors duration-300 hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
