import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  LabelList
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Bot,
  Building2,
  Landmark,
  Orbit,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import PredictionForm from "../components/PredictionForm";
import IndiaMapVisual from "../components/IndiaMapVisual";

const initialForecastFormData = {
  state: "",
  district: "",
  city: "",
  currentPopulation: "",
  growthRate: "1.02",
  startYear: "2011",
  targetYear: "2035"
};

const emptyForecastFormData = {
  state: "",
  district: "",
  city: "",
  currentPopulation: "",
  growthRate: "",
  startYear: "",
  targetYear: ""
};

const forecastDefaults = {
  startYear: "2011",
  targetYear: "2035",
  fallbackGrowthRate: "1.02"
};

const forecastGrowthConfig = {
  cities: {
    Lucknow: 1.11,
    Mumbai: 1.24,
    "New Delhi": 1.36,
    Bengaluru: 1.58,
    Chennai: 1.18,
    Kolkata: 0.96,
    Ahmedabad: 1.41,
    Hyderabad: 1.52,
    Jaipur: 1.33,
    Indore: 1.37,
    Patna: 1.29,
    Ludhiana: 1.04,
    Surat: 1.63,
    Pune: 1.47,
    Kanpur: 1.01
  },
  districts: {
    Lucknow: 1.1,
    Mumbai: 1.22,
    "New Delhi": 1.32,
    "Bengaluru Urban": 1.52,
    Chennai: 1.16,
    Kolkata: 0.95,
    Ahmedabad: 1.37,
    Hyderabad: 1.48,
    Jaipur: 1.28,
    Indore: 1.34,
    Patna: 1.26,
    Ludhiana: 1.03,
    Surat: 1.57,
    Pune: 1.42,
    Kanpur: 0.99
  },
  states: {
    "Uttar Pradesh": 1.04,
    Maharashtra: 1.18,
    Delhi: 1.3,
    Karnataka: 1.32,
    "Tamil Nadu": 1.08,
    "West Bengal": 0.94,
    Gujarat: 1.28,
    Telangana: 1.35,
    Rajasthan: 1.17,
    "Madhya Pradesh": 1.12,
    Bihar: 1.2,
    Punjab: 0.98
  }
};

const resolveGrowthRate = ({ state, district, city }) => {
  const cityRate = forecastGrowthConfig.cities[city];
  if (cityRate !== undefined) {
    return cityRate;
  }

  const districtRate = forecastGrowthConfig.districts[district];
  if (districtRate !== undefined) {
    return districtRate;
  }

  const stateRate = forecastGrowthConfig.states[state];
  if (stateRate !== undefined) {
    return stateRate;
  }

  return Number(forecastDefaults.fallbackGrowthRate);
};

const getAutoFilledForecastValues = (location) => ({
  currentPopulation: String(location.population2011),
  growthRate: resolveGrowthRate(location).toFixed(2),
  startYear: forecastDefaults.startYear,
  targetYear: forecastDefaults.targetYear
});

const indicatorCards = [
  {
    title: "Total Population",
    value: "1.44B",
    detail: "National baseline for macro demographic interpretation",
    accent: "from-[#1f6f60]/45 to-white/5",
    icon: Building2,
    chip: "National",
    footer: "Census-backed context",
    sparklineColor: "#34d399",
    sparklineData: [
      { value: 1180 },
      { value: 1235 },
      { value: 1292 },
      { value: 1348 },
      { value: 1410 },
      { value: 1440 }
    ]
  },
  {
    title: "Birth Rate",
    value: "16.8",
    detail: "Per 1,000 people, monitored as a growth input signal",
    accent: "from-[#256e5a]/45 to-white/5",
    icon: Sparkles,
    chip: "Vital",
    footer: "Supports demand modeling",
    sparklineColor: "#d6b56d",
    sparklineData: [
      { value: 18.4 },
      { value: 18.1 },
      { value: 17.6 },
      { value: 17.2 },
      { value: 16.9 },
      { value: 16.8 }
    ]
  },
  {
    title: "Death Rate",
    value: "7.3",
    detail: "Population balancing marker across long-range projections",
    accent: "from-[#8d6f33]/35 to-white/5",
    icon: Activity,
    chip: "Health",
    footer: "Stability input",
    sparklineColor: "#f6f1e7",
    sparklineData: [
      { value: 7.8 },
      { value: 7.6 },
      { value: 7.5 },
      { value: 7.4 },
      { value: 7.3 },
      { value: 7.3 }
    ]
  },
  {
    title: "Migration Rate",
    value: "+0.9%",
    detail: "Mobility intensity for urban concentration and expansion",
    accent: "from-[#115347]/45 to-white/5",
    icon: TrendingUp,
    chip: "Urban",
    footer: "Metro pull factor",
    sparklineColor: "#34d399",
    sparklineData: [
      { value: 0.3 },
      { value: 0.45 },
      { value: 0.62 },
      { value: 0.71 },
      { value: 0.84 },
      { value: 0.9 }
    ]
  }
];

const growthTimeline = [
  { year: 2011, population: 1210 },
  { year: 2014, population: 1268 },
  { year: 2017, population: 1326 },
  { year: 2020, population: 1380 },
  { year: 2023, population: 1435 },
  { year: 2026, population: 1488 }
];

const topStates = [
  { state: "Uttar Pradesh", population: 199.8 },
  { state: "Maharashtra", population: 112.4 },
  { state: "Bihar", population: 104.1 },
  { state: "West Bengal", population: 91.3 },
  { state: "Madhya Pradesh", population: 72.6 }
];

const urbanMomentum = [
  { city: "Delhi", score: 92 },
  { city: "Mumbai", score: 89 },
  { city: "Bengaluru", score: 86 },
  { city: "Hyderabad", score: 81 },
  { city: "Chennai", score: 78 }
];

const aiInsightFeed = [
  {
    text: "Delhi projected to cross 22M population by 2035",
    timestamp: "2 min ago",
    confidence: 91,
    tag: "Metro Growth"
  },
  {
    text: "Migration momentum increasing in Bengaluru corridor",
    timestamp: "8 min ago",
    confidence: 87,
    tag: "Mobility"
  },
  {
    text: "Tier-2 cities accelerating faster than projected",
    timestamp: "13 min ago",
    confidence: 84,
    tag: "Expansion"
  },
  {
    text: "Hyderabad urban density threshold rising",
    timestamp: "21 min ago",
    confidence: 89,
    tag: "Density"
  }
];

const exploreForecastSeries = [
  { year: 2011, population: 1180, historical: 1180, forecast: null },
  { year: 2014, population: 1268, historical: 1268, forecast: null },
  { year: 2017, population: 1332, historical: 1332, forecast: null },
  { year: 2020, population: 1398, historical: 1398, forecast: null },
  { year: 2023, population: 1456, historical: 1456, forecast: null },
  { year: 2026, population: 1528, historical: null, forecast: 1528 },
  { year: 2029, population: 1616, historical: null, forecast: 1616 },
  { year: 2032, population: 1708, historical: null, forecast: 1708 },
  { year: 2035, population: 1812, historical: null, forecast: 1812 }
];

const numberFormat = (value) => value.toLocaleString("en-IN");

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dataset, setDataset] = useState([]);
  const [datasetLabel, setDatasetLabel] = useState("Census 2011 Base Data");
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [predictionValidationErrors, setPredictionValidationErrors] = useState({});
  const [growthRateManuallyEdited, setGrowthRateManuallyEdited] = useState(false);
  const [autoFilledFieldHighlights, setAutoFilledFieldHighlights] = useState([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [loadingDataset, setLoadingDataset] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [formData, setFormData] = useState(initialForecastFormData);

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const { data } = await api.get("/predict/dataset");
        setDataset(data.records);
        setDatasetLabel(data.sourceLabel);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          navigate("/auth", { replace: true });
        }
      } finally {
        setLoadingDataset(false);
      }
    };

    loadDataset();
  }, [logout, navigate]);

  const states = useMemo(
    () => [...new Set(dataset.map((item) => item.state))],
    [dataset]
  );

  const filteredDistricts = useMemo(
    () =>
      [...new Set(dataset.filter((item) => item.state === formData.state).map((item) => item.district))],
    [dataset, formData.state]
  );

  const filteredCities = useMemo(
    () =>
      dataset.filter(
        (item) =>
          item.state === formData.state && item.district === formData.district
      ),
    [dataset, formData.state, formData.district]
  );

  const selectedLocation = useMemo(
    () =>
      dataset.find(
        (item) =>
          item.state === formData.state &&
          item.district === formData.district &&
          item.city === formData.city
      ),
    [dataset, formData.state, formData.district, formData.city]
  );

  useEffect(() => {
    if (!selectedLocation) {
      return;
    }

    const autoFilledValues = getAutoFilledForecastValues(selectedLocation);

    setFormData((current) => ({
      ...current,
      currentPopulation: autoFilledValues.currentPopulation,
      growthRate: growthRateManuallyEdited ? current.growthRate : autoFilledValues.growthRate,
      startYear: autoFilledValues.startYear,
      targetYear: autoFilledValues.targetYear
    }));
    setAutoFilledFieldHighlights([
      "currentPopulation",
      ...(!growthRateManuallyEdited ? ["growthRate"] : []),
      "startYear",
      "targetYear"
    ]);
  }, [growthRateManuallyEdited, selectedLocation]);

  useEffect(() => {
    if (!autoFilledFieldHighlights.length) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAutoFilledFieldHighlights([]);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [autoFilledFieldHighlights]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      if (name === "state") {
        setGrowthRateManuallyEdited(false);
        return {
          ...current,
          state: value,
          district: "",
          city: "",
          currentPopulation: "",
          growthRate: "",
          startYear: forecastDefaults.startYear,
          targetYear: forecastDefaults.targetYear
        };
      }

      if (name === "district") {
        setGrowthRateManuallyEdited(false);
        return {
          ...current,
          district: value,
          city: "",
          currentPopulation: "",
          growthRate: "",
          startYear: forecastDefaults.startYear,
          targetYear: forecastDefaults.targetYear
        };
      }

      return {
        ...current,
        [name]: value
      };
    });

    setPredictionError("");
    setPredictionValidationErrors((current) => {
      if (!Object.keys(current).length) {
        return current;
      }

      const nextErrors = { ...current };

      if (name === "state") {
        delete nextErrors.state;
        delete nextErrors.district;
        delete nextErrors.city;
        delete nextErrors.currentPopulation;
        return nextErrors;
      }

      if (name === "district") {
        delete nextErrors.district;
        delete nextErrors.city;
        delete nextErrors.currentPopulation;
        return nextErrors;
      }

      delete nextErrors[name];

      if (name === "startYear" || name === "targetYear") {
        delete nextErrors.startYear;
        delete nextErrors.targetYear;
      }

      return nextErrors;
    });

    if (name === "growthRate") {
      setGrowthRateManuallyEdited(true);
    }
  };

  const validatePredictionForm = () => {
    const nextErrors = {};
    const currentPopulationNumber = Number(formData.currentPopulation);
    const growthRateNumber = Number(formData.growthRate);
    const startYearNumber = Number(formData.startYear);
    const targetYearNumber = Number(formData.targetYear);

    if (!formData.state) {
      nextErrors.state = "Select a state.";
    }

    if (!formData.district) {
      nextErrors.district = "Select a district.";
    }

    if (!formData.city) {
      nextErrors.city = "Select a city.";
    }

    if (formData.currentPopulation === "") {
      nextErrors.currentPopulation = "Population is required.";
    } else if (Number.isNaN(currentPopulationNumber) || currentPopulationNumber <= 0) {
      nextErrors.currentPopulation = "Population must be greater than 0.";
    }

    if (formData.growthRate === "") {
      nextErrors.growthRate = "Growth rate is required.";
    } else if (Number.isNaN(growthRateNumber) || growthRateNumber <= 0) {
      nextErrors.growthRate = "Growth rate must be positive.";
    }

    if (!formData.startYear) {
      nextErrors.startYear = "Base year is required.";
    } else if (Number.isNaN(startYearNumber)) {
      nextErrors.startYear = "Enter a valid base year.";
    }

    if (!formData.targetYear) {
      nextErrors.targetYear = "Target year is required.";
    } else if (Number.isNaN(targetYearNumber)) {
      nextErrors.targetYear = "Enter a valid target year.";
    }

    if (
      !nextErrors.startYear &&
      !nextErrors.targetYear &&
      targetYearNumber <= startYearNumber
    ) {
      nextErrors.targetYear = "Target year must be greater than the base year.";
    }

    return nextErrors;
  };

  const handlePrediction = async (event) => {
    event.preventDefault();
    setPredictionError("");
    const nextErrors = validatePredictionForm();
    setPredictionValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoadingPrediction(true);
      const { data } = await api.post("/predict", formData);
      setPredictionResult(data);
    } catch (error) {
      setPredictionError(error.response?.data?.message || "Prediction failed");
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleResetForecast = () => {
    if (selectedLocation) {
      setFormData((current) => ({
        ...current,
        ...getAutoFilledForecastValues(selectedLocation)
      }));
      setGrowthRateManuallyEdited(false);
      setAutoFilledFieldHighlights([
        "currentPopulation",
        "growthRate",
        "startYear",
        "targetYear"
      ]);
    } else {
      setFormData(emptyForecastFormData);
      setGrowthRateManuallyEdited(false);
      setAutoFilledFieldHighlights([]);
    }
    setPredictionResult(null);
    setPredictionError("");
    setPredictionValidationErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeSection]);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-mesh font-body text-cream">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:gap-5 lg:px-6">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main className="min-w-0 flex-1 space-y-4 xl:space-y-5">
          <MobileHeader
            user={user}
            onLogout={handleLogout}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />

          {activeSection === "overview" ? (
            <div className="space-y-4 xl:space-y-5">
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-4 shadow-glow backdrop-blur-2xl md:p-6 xl:p-7"
              >
                <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-gold bg-opacity-15 blur-3xl" />
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.34em] text-gold">Protected dashboard</p>
                    <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-cream md:text-[3.35rem]">
                      Welcome back, {user?.name?.split(" ")[0] || "Analyst"}.
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-cream opacity-70 md:text-base">
                      Understand Today. Predict Tomorrow. This workspace blends secure access,
                      AI-powered forecasting, and cleaner demographic analytics for Indian states,
                      districts, and cities.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <Bot className="text-gold" size={18} />
                        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-cream opacity-45">Engine</p>
                        <p className="mt-2 font-display text-lg text-cream xl:text-xl">Smart prediction</p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <Orbit className="text-gold" size={18} />
                        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-cream opacity-45">Signal</p>
                        <p className="mt-2 font-display text-lg text-cream xl:text-xl">AI insights</p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <ShieldCheck className="text-gold" size={18} />
                        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-cream opacity-45">Security</p>
                        <p className="mt-2 font-display text-lg text-cream xl:text-xl">JWT protected</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-ink bg-opacity-35 p-4 xl:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-gold">India at a glance</p>
                        <p className="mt-2 font-display text-[1.65rem] text-cream">National macro snapshot</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-cream opacity-65">
                        Census 2011 Base Data
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        ["Population", "1.44B"],
                        ["Growth Rate", "1.02%"],
                        ["Top State", "Uttar Pradesh"],
                        ["Coverage", "States, Districts, Cities"]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-white/8 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-cream opacity-45">{label}</p>
                          <p className="mt-2 text-sm text-cream">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-24 rounded-[20px] border border-white/8 bg-ink bg-opacity-25 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthTimeline}>
                          <defs>
                            <linearGradient id="heroTrend" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#d6b56d" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="#d6b56d" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="year" hide />
                          <YAxis hide />
                          <Area type="monotone" dataKey="population" stroke="#d6b56d" fill="url(#heroTrend)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Population"
                    value="1.44 Billion"
                    detail="India at a national scale"
                    accent="from-gold to-white/5"
                    icon={Building2}
                    chip="National"
                    footer="Demand planning baseline"
                    sparklineData={[
                      { value: 1180 },
                      { value: 1242 },
                      { value: 1305 },
                      { value: 1368 },
                      { value: 1418 },
                      { value: 1440 }
                    ]}
                  />
                  <StatCard
                    title="Growth Rate"
                    value="1.02%"
                    detail="Long-range modeled growth marker"
                    accent="from-[#1a6f61]/40 to-white/5"
                    icon={TrendingUp}
                    chip="Projection"
                    footer="Scenario ready"
                    sparklineColor="#34d399"
                    sparklineData={[
                      { value: 0.85 },
                      { value: 0.89 },
                      { value: 0.93 },
                      { value: 0.97 },
                      { value: 1.0 },
                      { value: 1.02 }
                    ]}
                  />
                  <StatCard
                    title="Most Populous State"
                    value="Uttar Pradesh"
                    detail="Highest concentration in the sample strategic view"
                    accent="from-[#114338]/45 to-white/5"
                    icon={Landmark}
                    chip="Top state"
                    footer="199.8M sample population"
                    sparklineColor="#f6f1e7"
                    sparklineData={[
                      { value: 165 },
                      { value: 172 },
                      { value: 181 },
                      { value: 189 },
                      { value: 195 },
                      { value: 199.8 }
                    ]}
                  />
                  <StatCard
                    title="Source"
                    value="Census 2011"
                    detail="Official base data used for platform predictions"
                    accent="from-[#8b6b2d]/35 to-white/5"
                    icon={Sparkles}
                    chip="Base dataset"
                    footer="Structured for exploration"
                    sparklineData={[
                      { value: 18 },
                      { value: 26 },
                      { value: 31 },
                      { value: 38 },
                      { value: 45 },
                      { value: 52 }
                    ]}
                  />
                </div>
              </motion.section>

              <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {indicatorCards.map((card) => (
                  <StatCard key={card.title} {...card} />
                ))}
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <ChartCard
                  title="Population Growth Trajectory"
                  subtitle="National trendline represented in millions for strategic forecasting and planning views."
                  metric="2011 to 2026 trajectory"
                >
                  <div className="h-64 xl:h-[17.5rem]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthTimeline}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="year" stroke="#dce8e0" tickLine={false} axisLine={false} />
                        <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0b2622",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "16px",
                            color: "#f6f1e7"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="population"
                          stroke="#d6b56d"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#f6f1e7" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard
                  title="Top 5 Populous States"
                  subtitle="Strategic sample distribution using the requested large-state population figures."
                  metric="Values shown in millions"
                >
                  <div className="h-64 xl:h-[17.5rem]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topStates} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis
                          dataKey="state"
                          stroke="#dce8e0"
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis stroke="#dce8e0" tickLine={false} axisLine={false} />
                        <Tooltip
                          formatter={(value) => `${value}M`}
                          contentStyle={{
                            backgroundColor: "#0b2622",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "16px",
                            color: "#f6f1e7"
                          }}
                        />
                        <Bar dataKey="population" fill="#1e7d6c" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </section>
            </div>
          ) : null}

          {activeSection === "forecasts" ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 xl:space-y-5"
            >
              <PredictionForm
                dataset={dataset}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handlePrediction}
                onReset={handleResetForecast}
                loading={loadingPrediction}
                result={predictionResult}
                error={predictionError}
                validationErrors={predictionValidationErrors}
                autoFilledFieldHighlights={autoFilledFieldHighlights}
              />
            </motion.div>
          ) : null}

          {activeSection === "explore-data" ? (
            <div className="space-y-4 xl:space-y-5">
              <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[26px] border border-white/10 bg-white/8 p-4 shadow-panel backdrop-blur-2xl xl:p-5"
                >
                  <p className="text-xs uppercase tracking-[0.32em] text-gold">Explore India</p>
                  <h3 className="mt-2 font-display text-[1.65rem] text-cream">
                    Census 2011 Base Data across the selected geography
                  </h3>
                  <p className="mt-2 text-sm text-cream opacity-65">{datasetLabel}</p>

                  <div className="mt-5 space-y-3">
                    <select
                      value={formData.state}
                      onChange={(event) =>
                        handleInputChange({ target: { name: "state", value: event.target.value } })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-ink bg-opacity-35 px-4 py-3 text-sm text-cream outline-none"
                    >
                      <option value="">Choose State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>

                    <select
                      value={formData.district}
                      onChange={(event) =>
                        handleInputChange({ target: { name: "district", value: event.target.value } })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-ink bg-opacity-35 px-4 py-3 text-sm text-cream outline-none"
                      disabled={!formData.state}
                    >
                      <option value="">Choose District</option>
                      {filteredDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>

                    <select
                      value={formData.city}
                      onChange={(event) =>
                        handleInputChange({ target: { name: "city", value: event.target.value } })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-ink bg-opacity-35 px-4 py-3 text-sm text-cream outline-none"
                      disabled={!formData.district}
                    >
                      <option value="">Choose City or Town</option>
                      {filteredCities.map((item) => (
                        <option key={`${item.city}-${item.district}`} value={item.city}>
                          {item.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-ink bg-opacity-25 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cream opacity-45">Dataset</p>
                      <p className="mt-2 text-cream">State to city hierarchy</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-ink bg-opacity-25 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cream opacity-45">Autofill</p>
                      <p className="mt-2 text-cream">Population 2011 values</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="rounded-[26px] border border-white/10 bg-white/8 p-4 shadow-panel backdrop-blur-2xl xl:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-gold">Selected record</p>
                      <h3 className="mt-2 font-display text-[1.65rem] text-cream">Location intelligence view</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-cream opacity-65">
                      {loadingDataset ? "Loading..." : `${dataset.length} seeded records`}
                    </span>
                  </div>

                  {selectedLocation ? (
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-cream opacity-45">State</p>
                        <p className="mt-3 text-lg text-cream">{selectedLocation.state}</p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-cream opacity-45">District</p>
                        <p className="mt-3 text-lg text-cream">{selectedLocation.district}</p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-cream opacity-45">City/Town</p>
                        <p className="mt-3 text-lg text-cream">{selectedLocation.city}</p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-cream opacity-45">Population 2011</p>
                        <p className="mt-3 text-lg text-cream">
                          {numberFormat(selectedLocation.population2011)}
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-ink bg-opacity-35 p-4 md:col-span-2">
                        <p className="text-xs uppercase tracking-[0.28em] text-cream opacity-45">Type</p>
                        <p className="mt-3 text-lg text-cream">{selectedLocation.type}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[22px] border border-dashed border-white/12 bg-ink bg-opacity-25 p-5 text-sm text-cream opacity-60">
                      Choose a state, district, and city or town to inspect the corresponding Census 2011 Base Data record.
                    </div>
                  )}
                </motion.div>
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
                <ChartCard
                  title="AI Demographic Heatmap"
                  subtitle="Live regional growth intelligence across India"
                  badge="LIVE SIGNALS"
                  metric="Active growth nodes"
                >
                  <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,32,29,0.3),rgba(9,32,29,0.08))]">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(214,181,109,0.14),transparent_18%),radial-gradient(circle_at_72%_42%,rgba(34,122,105,0.18),transparent_22%),radial-gradient(circle_at_34%_72%,rgba(214,181,109,0.1),transparent_18%)]" />
                    <IndiaMapVisual className="min-h-[22rem]" />
                    <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
                      {[
                        ["Delhi", "92"],
                        ["Bengaluru", "89"],
                        ["Hyderabad", "84"]
                      ].map(([label, score]) => (
                        <div
                          key={label}
                          className="rounded-full border border-white/10 bg-ink/55 px-3 py-1.5 text-[11px] text-cream/78 backdrop-blur-xl"
                        >
                          <span className="mr-2 uppercase tracking-[0.18em] text-gold/90">{label}</span>
                          <span>{score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartCard>

                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 }}
                  className="rounded-[26px] border border-white/8 bg-white/6 p-5 shadow-[0_18px_44px_rgba(6,25,22,0.16)] backdrop-blur-[20px] xl:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-gold/88">Live AI Insight Feed</p>
                      <h3 className="mt-2 font-display text-[1.6rem] leading-tight text-cream">
                        Real-time demographic intelligence
                      </h3>
                    </div>
                    <span className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-gold/90">
                      Streaming
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {aiInsightFeed.map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * index }}
                        whileHover={{ y: -2 }}
                        className="rounded-[22px] border border-white/8 bg-ink/28 p-4 transition duration-300 hover:border-gold/16 hover:bg-ink/36"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.75)]" />
                            <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-cream/62">
                              {item.tag}
                            </span>
                          </div>
                          <span className="text-[11px] text-cream/46">{item.timestamp}</span>
                        </div>
                        <p className="mt-3 text-[13px] leading-6 text-cream/78">{item.text}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-[11px] uppercase tracking-[0.16em] text-gold/88">
                            Confidence {item.confidence}%
                          </span>
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/8">
                            <div
                              className="h-full rounded-full bg-[linear-gradient(90deg,#1e7a67,#d6b56d)]"
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </section>

              <ChartCard
                title="Forecast Graph"
                subtitle="Historical population movement and AI-driven forward projection in one clean analytical view."
                badge="AI forecast"
                metric="CAGR 1.02% • Confidence 87%"
              >
                <div className="h-[18rem] xl:h-[20rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exploreForecastSeries} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
                      <defs>
                        <linearGradient id="exploreForecastGlow" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#d6b56d" />
                          <stop offset="100%" stopColor="#f4d58d" />
                        </linearGradient>
                        <linearGradient id="exploreForecastArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d6b56d" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#d6b56d" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="year"
                        stroke="#dce8e0"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        stroke="#dce8e0"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => `${value}M`}
                        width={56}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}M`, "Population index"]}
                        contentStyle={{
                          backgroundColor: "#0b2622",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "16px",
                          color: "#f6f1e7"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="population"
                        stroke="none"
                        fill="url(#exploreForecastArea)"
                        fillOpacity={1}
                      />
                      <Line
                        type="monotone"
                        dataKey="historical"
                        stroke="url(#exploreForecastGlow)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 5, fill: "#f6f1e7", stroke: "#d6b56d", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="url(#exploreForecastGlow)"
                        strokeWidth={3}
                        strokeDasharray="7 7"
                        dot={false}
                        activeDot={{ r: 5, fill: "#f6f1e7", stroke: "#d6b56d", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
