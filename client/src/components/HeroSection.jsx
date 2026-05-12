import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Landmark,
  MapPinned,
  ShieldCheck
} from "lucide-react";
import IndiaMapVisual from "./IndiaMapVisual";

const statBadges = [
  { label: "Population", value: "1.44B", icon: MapPinned },
  { label: "Top State", value: "Uttar Pradesh", icon: Landmark },
  { label: "Source", value: "Census 2011", icon: ShieldCheck }
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(23,92,78,0.34),transparent_70%)] blur-3xl" />
        <div className="absolute right-[10%] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(214,181,109,0.18),transparent_74%)] blur-3xl" />
        <div className="absolute bottom-6 right-1/4 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(22,109,92,0.2),transparent_72%)] blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-10 pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold border-opacity-25 bg-gold bg-opacity-10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-gold">
            <ShieldCheck size={14} />
            Population intelligence platform
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl xl:text-7xl">
            Understand Today.
            <br />
            Predict{" "}
            <span className="bg-gradient-to-r from-cream via-gold to-cream bg-clip-text text-transparent">
              Tomorrow.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-cream opacity-75 sm:text-lg lg:text-xl">
            AI-powered population forecasting for Indian states, districts, and cities.
            Explore demographic signals, model future demand, and turn Census 2011 base data
            into clearer strategic insight.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/auth?mode=signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e0bc72] to-[#c79942] px-8 py-4 text-lg font-semibold text-ink transition duration-200 hover:scale-105 hover:brightness-105 sm:w-auto"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/5 px-8 py-4 text-lg font-semibold text-cream transition duration-200 hover:scale-105 hover:bg-white/10 sm:w-auto"
            >
              Explore Features
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[760px]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(214,181,109,0.12),transparent_56%)] blur-2xl" />
            <div className="relative rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,38,34,0.42),rgba(11,38,34,0.18))] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-5 lg:p-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <IndiaMapVisual />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:w-[260px] lg:flex-col lg:justify-center">
                  {statBadges.map((badge) => (
                    <motion.div
                      key={badge.label}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="group min-w-[150px] rounded-2xl border border-white/10 bg-ink bg-opacity-45 px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:border-gold hover:border-opacity-45 hover:shadow-[0_16px_36px_rgba(214,181,109,0.12)] lg:min-h-[120px]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-cream opacity-45">{badge.label}</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gold opacity-85 transition duration-300 group-hover:border-gold group-hover:border-opacity-35 group-hover:bg-gold group-hover:bg-opacity-10">
                          <badge.icon size={15} />
                        </div>
                      </div>
                      <p className="mt-3 font-display text-lg text-cream">{badge.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
