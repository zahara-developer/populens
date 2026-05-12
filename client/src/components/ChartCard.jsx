import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ChartCard = ({ title, subtitle, badge = "AI-powered insights", metric, children }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.38 }}
      className="relative overflow-hidden rounded-[26px] border border-white/8 bg-white/6 p-5 shadow-[0_18px_44px_rgba(6,25,22,0.16)] backdrop-blur-[20px] xl:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_34%)] opacity-70" />
      <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold/85">Live analytical view</p>
          <h3 className="mt-2 font-display text-[1.72rem] leading-tight text-cream xl:text-[1.95rem]">{title}</h3>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-cream/58">{subtitle}</p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/8 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-gold/90">
            <Sparkles size={11} />
            {badge}
          </span>
          {metric ? (
            <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[11px] text-cream/62">
              {metric}
            </span>
          ) : null}
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.section>
  );
};

export default ChartCard;
