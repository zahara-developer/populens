import {
  Menu,
  LogOut,
  Sparkles,
  LayoutDashboard,
  LineChart,
  Search,
  Layers3,
  ChevronDown,
  BrainCircuit,
  Landmark,
  DatabaseZap,
  ChartColumnIncreasing
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

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

const MobileHeader = ({ user, onLogout, activeSection, onNavigate }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const isFeatureRouteActive = moreOptions.some((item) => location.pathname === item.to);

  useEffect(() => {
    if (isFeatureRouteActive) {
      setIsMoreOptionsOpen(true);
    }
  }, [isFeatureRouteActive]);

  return (
    <div className="lg:hidden">
      <div className="rounded-[28px] border border-white/8 bg-white/6 p-4 shadow-[0_18px_44px_rgba(6,25,22,0.16)] backdrop-blur-[20px]">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#b58a33] text-ink">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-display text-lg text-cream">Populens AI</p>
              <p className="text-xs text-cream/58">Secure demographic intelligence</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-2xl border border-white/8 bg-white/5 p-3 text-cream transition duration-300 hover:bg-white/8"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-3 rounded-[28px] border border-white/8 bg-ink/70 p-4 shadow-[0_18px_44px_rgba(6,25,22,0.16)] backdrop-blur-[20px]"
          >
            <p className="font-display text-lg text-cream">{user?.name}</p>
            <p className="mt-1 text-sm text-cream/60">{user?.email}</p>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate?.(item.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-300 ${
                    activeSection === item.id
                      ? "border-gold/25 bg-gold/10 text-cream shadow-[0_10px_30px_rgba(214,181,109,0.12)]"
                      : "border-white/8 bg-white/5 text-cream/78 hover:bg-white/8"
                  }`}
                >
                  <item.icon size={16} className="text-gold" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 overflow-hidden rounded-[24px] border border-white/8 bg-white/5">
              <button
                type="button"
                onClick={() => setIsMoreOptionsOpen((value) => !value)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition duration-300 ${
                  isMoreOptionsOpen || isFeatureRouteActive ? "bg-gold/10 text-cream" : "text-cream/78 hover:bg-white/8"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Layers3 size={16} className="text-gold" />
                  <span>More Options</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gold transition duration-300 ${isMoreOptionsOpen ? "rotate-180" : ""}`}
                />
              </button>

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
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition duration-300 ${
                              isActive
                                ? "border-gold/25 bg-gold/10 text-cream shadow-[0_10px_30px_rgba(214,181,109,0.12)]"
                                : "border-white/8 bg-ink/18 text-cream/72 hover:bg-white/8 hover:text-cream"
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
            <button
              type="button"
              onClick={onLogout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default MobileHeader;
