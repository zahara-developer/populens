import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Sparkles, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-ink bg-opacity-35 px-4 py-3 text-sm text-cream outline-none transition placeholder:text-cream placeholder:opacity-35 focus:border-gold focus:border-opacity-45 focus:ring-2 focus:ring-gold focus:ring-opacity-20";

const invalidFieldClassName =
  "border-rose-300/70 focus:border-rose-300 focus:ring-rose-300/25";

const autoFilledFieldClassName =
  "border-gold/30 shadow-[0_0_0_1px_rgba(214,181,109,0.18),0_0_24px_rgba(214,181,109,0.16)]";

const numberFormat = (value) => Number(value).toLocaleString("en-IN");

const getMetricCardClassName =
  "rounded-[22px] border border-white/10 bg-ink/35 p-4 shadow-panel transition duration-200 hover:-translate-y-1 hover:border-gold/20 hover:bg-ink/45";

const chartButtonClassName =
  "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition";

const chartTooltipStyle = {
  backgroundColor: "#0b2622",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  color: "#f6f1e7",
  boxShadow: "0 18px 45px rgba(3, 14, 12, 0.3)"
};

const CountUpText = ({ value, formatter, duration = 700 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let startTimestamp = 0;

    const animateValue = (timestamp) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateValue);
      }
    };

    setDisplayValue(0);
    frameId = window.requestAnimationFrame(animateValue);

    return () => window.cancelAnimationFrame(frameId);
  }, [duration, value]);

  return formatter(displayValue);
};

const ActiveForecastDot = ({ cx, cy }) => (
  <g>
    <circle cx={cx} cy={cy} r={12} fill="rgba(244,213,141,0.14)" />
    <circle cx={cx} cy={cy} r={7} fill="rgba(244,213,141,0.16)" />
    <circle cx={cx} cy={cy} r={4.5} fill="#f6f1e7" stroke="#f4d58d" strokeWidth={2} />
  </g>
);

const ForecastTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div
      className="min-w-[210px] rounded-2xl border border-white/10 bg-ink/95 p-3 text-cream shadow-[0_18px_45px_rgba(3,14,12,0.3)] backdrop-blur-xl"
      style={chartTooltipStyle}
    >
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Year {label}</p>
      <p className="mt-2 text-sm text-cream/72">Forecasted population</p>
      <p className="mt-1 font-display text-xl text-cream">{numberFormat(point.population)}</p>
      <p className="mt-3 text-sm text-cream/72">Growth %</p>
      <p className="mt-1 text-sm text-cream">{point.growthPercentage.toFixed(2)}%</p>
    </div>
  );
};

const PredictionForm = ({
  dataset,
  formData,
  onChange,
  onSubmit,
  onReset,
  loading,
  result,
  error,
  validationErrors = {},
  autoFilledFieldHighlights = []
}) => {
  const [chartMode, setChartMode] = useState("line");
  const states = [...new Set(dataset.map((item) => item.state))];
  const districts = [
    ...new Set(
      dataset
        .filter((item) => item.state === formData.state)
        .map((item) => item.district)
    )
  ];
  const cities = dataset.filter(
    (item) =>
      item.state === formData.state && item.district === formData.district
  );

  const getFieldClassName = (fieldName) =>
    `${fieldClassName} ${validationErrors[fieldName] ? invalidFieldClassName : ""} ${
      autoFilledFieldHighlights.includes(fieldName) ? autoFilledFieldClassName : ""
    }`;

  const renderFieldMessage = (fieldName) => {
    if (!validationErrors[fieldName]) {
      return null;
    }

    return <p className="mt-2 text-xs text-rose-300">{validationErrors[fieldName]}</p>;
  };

  const projectionSeries = useMemo(
    () =>
      result
        ? Array.from({ length: result.yearsDifference + 1 }, (_, index) => {
            const year = result.startYear + index;
            const population = Math.round(
              result.currentPopulation * Math.pow(1 + result.growthRate / 100, index)
            );
            const growthPercentage =
              ((population - result.currentPopulation) / result.currentPopulation) * 100;

            return {
              year,
              population,
              growthPercentage
            };
          })
        : [],
    [result]
  );

  const chartAnalytics = useMemo(() => {
    if (!result || !projectionSeries.length) {
      return null;
    }

    const runtimeYear = new Date().getFullYear();
    const dividerYear = Math.min(Math.max(runtimeYear, result.startYear), result.targetYear);
    const forecastStartYear =
      dividerYear < result.targetYear ? dividerYear : result.targetYear;

    const enhancedSeries = projectionSeries.map((point) => ({
      ...point,
      historicalPopulation: point.year <= dividerYear ? point.population : null,
      forecastPopulation: point.year >= forecastStartYear ? point.population : null,
      barPopulation: point.year >= forecastStartYear ? point.population : null
    }));

    const confidence = Math.max(
      78,
      Math.min(94, Math.round(91 - result.yearsDifference * 0.45 - (result.growthRate - 1) * 2.4))
    );

    return {
      dividerYear,
      forecastStartYear,
      enhancedSeries,
      cagr: result.growthRate,
      avgGrowth: result.growthPercentage / result.yearsDifference,
      confidence
    };
  }, [projectionSeries, result]);

  return (
    <section className="rounded-[26px] border border-white/10 bg-white/8 p-4 shadow-panel backdrop-blur-2xl md:p-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-start">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Smart Prediction Engine</p>
          <h3 className="mt-2 font-display text-2xl text-cream">
            Forecast future population with confidence
          </h3>

          <form
            className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            onSubmit={onSubmit}
          >
            <div>
              <select
                name="state"
                value={formData.state}
                onChange={onChange}
                className={getFieldClassName("state")}
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {renderFieldMessage("state")}
            </div>

            <div>
              <select
                name="district"
                value={formData.district}
                onChange={onChange}
                className={getFieldClassName("district")}
                disabled={!formData.state}
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {renderFieldMessage("district")}
            </div>

            <div>
              <select
                name="city"
                value={formData.city}
                onChange={onChange}
                className={getFieldClassName("city")}
                disabled={!formData.district}
              >
                <option value="">Select city</option>
                {cities.map((item) => (
                  <option key={`${item.city}-${item.district}`} value={item.city}>
                    {item.city}
                  </option>
                ))}
              </select>
              {renderFieldMessage("city")}
            </div>

            <div>
              <input
                type="number"
                name="currentPopulation"
                value={formData.currentPopulation}
                onChange={onChange}
                placeholder="Current Population"
                className={getFieldClassName("currentPopulation")}
              />
              {renderFieldMessage("currentPopulation")}
            </div>

            <div>
              <motion.input
                key={`growth-rate-${formData.growthRate}`}
                initial={{ opacity: 0.78, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                type="number"
                step="0.01"
                name="growthRate"
                value={formData.growthRate}
                onChange={onChange}
                placeholder="Growth Rate %"
                className={getFieldClassName("growthRate")}
              />
              <motion.p
                initial={{ opacity: 0.45, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="mt-2 text-xs text-cream/55"
              >
                Auto-filled from regional demographic trend
              </motion.p>
              {renderFieldMessage("growthRate")}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  name="startYear"
                  value={formData.startYear}
                  onChange={onChange}
                  placeholder="Start Year"
                  className={getFieldClassName("startYear")}
                />
                {renderFieldMessage("startYear")}
              </div>

              <div>
                <input
                  type="number"
                  name="targetYear"
                  value={formData.targetYear}
                  onChange={onChange}
                  placeholder="Target Year"
                  className={getFieldClassName("targetYear")}
                />
                {renderFieldMessage("targetYear")}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row xl:col-span-3 xl:justify-self-start">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-gold px-5 py-3 font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Calculating..." : "Generate Prediction"}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 font-semibold text-cream transition duration-200 hover:bg-white/10"
              >
                <RefreshCcw size={16} />
                Reset Forecast
              </button>
            </div>
          </form>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="rounded-[22px] border border-white/10 bg-ink/35 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Base data</p>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] text-cream opacity-70">
              Census 2011
            </span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-cream/75">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              Select the geography first to auto-fill the 2011 population baseline.
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              Adjust the growth rate and year range, then run a projection from the same dataset.
            </div>
          </div>
        </div>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.28 }}
        className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
      >
        <div className={getMetricCardClassName}>
          <p className="text-xs uppercase tracking-[0.3em] text-cream opacity-45">
            Predicted Population
          </p>
          <p className="mt-3 font-display text-[1.7rem] text-cream">
            {result ? numberFormat(result.predictedPopulation) : "--"}
          </p>
        </div>
        <div className={getMetricCardClassName}>
          <p className="text-xs uppercase tracking-[0.3em] text-cream opacity-45">
            Growth Amount
          </p>
          <p className="mt-3 font-display text-[1.7rem] text-cream">
            {result ? numberFormat(result.growthAmount) : "--"}
          </p>
        </div>
        <div className={getMetricCardClassName}>
          <p className="text-xs uppercase tracking-[0.3em] text-cream opacity-45">Growth %</p>
          <p className="mt-3 font-display text-[1.7rem] text-cream">
            {result ? `${result.growthPercentage}%` : "--"}
          </p>
        </div>
        <div className={getMetricCardClassName}>
          <p className="text-xs uppercase tracking-[0.3em] text-cream opacity-45">
            Years Difference
          </p>
          <p className="mt-3 font-display text-[1.7rem] text-cream">
            {result ? result.yearsDifference : "--"}
          </p>
        </div>
      </motion.div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,32,29,0.55),rgba(9,32,29,0.3))] p-4 shadow-panel backdrop-blur-2xl"
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Population growth curve</p>
            <h4 className="mt-2 font-display text-xl text-cream">
              {result
                ? `Forecast from ${result.startYear} to ${result.targetYear}`
                : "AI-powered demographic trajectory"}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-gold">
              <TrendingUp size={12} />
              AI Forecast Active
            </span>
            {["line", "area", "bar"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setChartMode(mode)}
                className={`${chartButtonClassName} ${
                  chartMode === mode
                    ? "border-gold/30 bg-gold/12 text-gold"
                    : "border-white/10 bg-white/5 text-cream/68 hover:bg-white/8"
                }`}
              >
                {mode === "line" ? "Line View" : mode === "area" ? "Area View" : "Bar Forecast"}
              </button>
            ))}
          </div>
        </div>

        {result && chartAnalytics ? (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-cream/78">
                <span className="mr-2 uppercase tracking-[0.24em] text-cream/45">CAGR</span>
                <CountUpText
                  value={chartAnalytics.cagr}
                  formatter={(current) => `${current.toFixed(2)}%`}
                />
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-cream/78">
                <span className="mr-2 uppercase tracking-[0.24em] text-cream/45">Avg Growth</span>
                <CountUpText
                  value={chartAnalytics.avgGrowth}
                  formatter={(current) => `${current.toFixed(2)}%`}
                />
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-cream/78">
                <span className="mr-2 uppercase tracking-[0.24em] text-cream/45">Forecast Confidence</span>
                <CountUpText
                  value={chartAnalytics.confidence}
                  formatter={(current) => `${Math.round(current)}%`}
                />
              </div>
            </div>

            <motion.div
              key={`chart-${chartMode}-${result.startYear}-${result.targetYear}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="h-72 w-full rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-3"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === "bar" ? (
                  <BarChart
                    data={chartAnalytics.enhancedSeries}
                    margin={{ top: 18, right: 16, left: 0, bottom: 6 }}
                  >
                    <defs>
                      <linearGradient id="forecastBarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f4d58d" stopOpacity={0.82} />
                        <stop offset="100%" stopColor="#d6b36a" stopOpacity={0.26} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
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
                      tickFormatter={(value) => numberFormat(value)}
                      width={88}
                    />
                    <Tooltip content={<ForecastTooltip />} />
                    <ReferenceLine
                      x={chartAnalytics.dividerYear}
                      stroke="rgba(244,213,141,0.35)"
                      strokeDasharray="4 6"
                      label={{
                        value: "Forecast begins",
                        position: "insideTopRight",
                        fill: "#f4d58d",
                        fontSize: 11
                      }}
                    />
                    <Bar
                      dataKey="barPopulation"
                      fill="url(#forecastBarFill)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={750}
                    />
                  </BarChart>
                ) : chartMode === "area" ? (
                  <AreaChart
                    data={chartAnalytics.enhancedSeries}
                    margin={{ top: 18, right: 16, left: 0, bottom: 6 }}
                  >
                    <defs>
                      <linearGradient id="forecastAreaFillPremium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f4d58d" stopOpacity={0.24} />
                        <stop offset="100%" stopColor="#d6b36a" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
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
                      tickFormatter={(value) => numberFormat(value)}
                      width={88}
                    />
                    <Tooltip content={<ForecastTooltip />} />
                    <ReferenceLine
                      x={chartAnalytics.dividerYear}
                      stroke="rgba(244,213,141,0.35)"
                      strokeDasharray="4 6"
                      label={{
                        value: "Forecast begins",
                        position: "insideTopRight",
                        fill: "#f4d58d",
                        fontSize: 11
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="population"
                      stroke="#f4d58d"
                      strokeWidth={2.6}
                      fill="url(#forecastAreaFillPremium)"
                      activeDot={<ActiveForecastDot />}
                      animationDuration={750}
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={chartAnalytics.enhancedSeries}
                    margin={{ top: 18, right: 16, left: 0, bottom: 6 }}
                  >
                    <defs>
                      <linearGradient id="forecastLineStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d6b36a" />
                        <stop offset="100%" stopColor="#f4d58d" />
                      </linearGradient>
                      <linearGradient id="forecastAreaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f4d58d" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#d6b36a" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      stroke="#dce8e0"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#dce8e0" }}
                    />
                    <YAxis
                      stroke="#dce8e0"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#dce8e0" }}
                      tickFormatter={(value) => numberFormat(value)}
                      width={88}
                    />
                    <Tooltip content={<ForecastTooltip />} />
                    <ReferenceLine
                      x={chartAnalytics.dividerYear}
                      stroke="rgba(244,213,141,0.35)"
                      strokeDasharray="4 6"
                      label={{
                        value: "Forecast begins",
                        position: "insideTopRight",
                        fill: "#f4d58d",
                        fontSize: 11
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="population"
                      stroke="none"
                      fill="url(#forecastAreaGlow)"
                      fillOpacity={1}
                      isAnimationActive
                      animationDuration={750}
                    />
                    <Line
                      type="monotone"
                      dataKey="historicalPopulation"
                      stroke="rgba(244,213,141,0.22)"
                      strokeWidth={8}
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecastPopulation"
                      stroke="rgba(244,213,141,0.18)"
                      strokeWidth={10}
                      strokeDasharray="7 7"
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="historicalPopulation"
                      stroke="url(#forecastLineStroke)"
                      strokeWidth={3}
                      dot={false}
                      activeDot={<ActiveForecastDot />}
                      animationDuration={750}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecastPopulation"
                      stroke="url(#forecastLineStroke)"
                      strokeWidth={3}
                      strokeDasharray="7 7"
                      dot={false}
                      activeDot={<ActiveForecastDot />}
                      animationDuration={750}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-white/5 text-center">
            <p className="max-w-md px-6 text-sm leading-7 text-cream/62">
              Generate a forecast to visualize future demographic growth.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default PredictionForm;
