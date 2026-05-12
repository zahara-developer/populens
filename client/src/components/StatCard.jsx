import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const fallbackSparkline = [
  { value: 35 },
  { value: 42 },
  { value: 39 },
  { value: 48 },
  { value: 55 },
  { value: 63 }
];

const StatCard = ({
  title,
  value,
  detail,
  accent = "from-gold to-white/5",
  icon: Icon,
  chip,
  footer,
  sparklineData = fallbackSparkline,
  sparklineColor = "#d6b56d"
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.008 }}
      transition={{ duration: 0.28 }}
      className={`group relative overflow-hidden rounded-[26px] border border-white/8 bg-gradient-to-br ${accent} p-5 shadow-[0_18px_42px_rgba(6,25,22,0.16)] backdrop-blur-[18px] xl:p-6`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%)] opacity-75 transition duration-300 group-hover:opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cream/48">{title}</p>
            <h3 className="mt-3 font-display text-[1.78rem] leading-tight text-cream xl:text-[2rem]">{value}</h3>
            <p className="mt-3 max-w-xs text-[13px] leading-6 text-cream/58">{detail}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {Icon ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-ink/28 text-gold transition duration-300 group-hover:bg-ink/38">
                <Icon size={18} />
              </div>
            ) : null}
            {chip ? (
              <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-cream/60">
                {chip}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 h-14 rounded-[18px] border border-white/7 bg-ink/22 px-2 py-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={sparklineColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                strokeWidth={2.2}
                fill={`url(#spark-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold/88">AI signal</span>
          <span className="text-[11px] text-cream/56">{footer || "Updated for strategic interpretation"}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
