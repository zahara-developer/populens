import {
  Sparkles,
  LayoutDashboard,
  LineChart,
  Search,
  LogOut,
  Layers3,
  ChevronDown,
  BrainCircuit,
  Landmark,
  DatabaseZap,
  ChartColumnIncreasing
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: LineChart, label: "Forecasts", id: "forecasts" },
  { icon: Search, label: "Explore Data", id: "explore-data" }
];

const moreOptions = [
  {
    icon: BrainCircuit,
    label: "Population Prediction",
    to: "/dashboard/population-prediction"
  },
  {
    icon: Landmark,
    label: "Census 2011 Base Data",
    to: "/dashboard/census"
  },
  {
    icon: DatabaseZap,
    label: "AI-powered Insights",
    to: "/dashboard/ai-insights"
  },
  {
    icon: ChartColumnIncreasing,
    label: "Interactive Charts",
    to: "/dashboard/charts"
  }
];

const Sidebar = ({ user, onLogout, activeSection, onNavigate }) => {
  const location = useLocation();
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const isFeatureRouteActive = moreOptions.some((item) => location.pathname === item.to);

  useEffect(() => {
    if (isFeatureRouteActive) {
      setIsMoreOptionsOpen(true);
    }
  }, [isFeatureRouteActive]);

  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-[30px] border border-white/8 bg-white/6 p-5 shadow-[0_24px_64px_rgba(5,23,20,0.22)] backdrop-blur-[22px] lg:flex lg:flex-col">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#b58a33] text-ink shadow-[0_14px_28px_rgba(214,181,109,0.18)] transition duration-300">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="font-display text-xl text-cream">Populens AI</p>
          <p className="text-sm text-cream/58">Population intelligence suite</p>
        </div>
      </Link>

      <div className="mt-10 space-y-3.5">
        {navItems.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            whileHover={{ x: 3, y: -1 }}
            onClick={() => onNavigate?.(item.id)}
            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition duration-300 ${
              activeSection === item.id
                ? "border-gold/25 bg-gold/10 text-cream shadow-[0_10px_30px_rgba(214,181,109,0.12),0_0_0_1px_rgba(214,181,109,0.08)]"
                : "border-white/6 bg-white/4 text-cream/78 hover:border-white/10 hover:bg-white/7"
            }`}
          >
            <item.icon size={18} className="text-gold" />
            <span className="text-sm">{item.label}</span>
          </motion.button>
        ))}

        <div className="overflow-hidden rounded-[24px] border border-white/6 bg-white/4">
          <motion.button
            type="button"
            whileHover={{ x: 3, y: -1 }}
            onClick={() => setIsMoreOptionsOpen((value) => !value)}
            className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition duration-300 ${
              isMoreOptionsOpen || isFeatureRouteActive
                ? "bg-gold/10 text-cream shadow-[0_10px_30px_rgba(214,181,109,0.12),0_0_0_1px_rgba(214,181,109,0.08)]"
                : "text-cream/78 hover:bg-white/7"
            }`}
          >
            <span className="flex items-center gap-3">
              <Layers3 size={18} className="text-gold" />
              <span className="text-sm">More Options</span>
            </span>
            <ChevronDown
              size={16}
              className={`text-gold transition duration-300 ${isMoreOptionsOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          <AnimatePresence initial={false}>
            {isMoreOptionsOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden border-t border-white/8"
              >
                <div className="space-y-2 p-3">
                  {moreOptions.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm transition duration-300 ${
                          isActive
                            ? "border-gold/25 bg-gold/10 text-cream shadow-[0_10px_30px_rgba(214,181,109,0.12)]"
                            : "border-white/8 bg-ink/20 text-cream/72 hover:border-white/12 hover:bg-white/6 hover:text-cream"
                        }`
                      }
                    >
                      <item.icon size={16} className="text-gold" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto rounded-[26px] border border-white/8 bg-ink/28 p-5 backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cream/42">Secure Session</p>
        <p className="mt-3 font-display text-xl text-cream">{user?.name}</p>
        <p className="mt-1 text-sm text-cream/56">{user?.email}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
