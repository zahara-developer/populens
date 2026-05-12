import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker
} from "react-simple-maps";
import indiaStatesUrl from "../data/india-states.json?url";

const CITY_MARKERS = [
  { name: "Delhi", coordinates: [77.1025, 28.7041] },
  { name: "Mumbai", coordinates: [72.8777, 19.076] },
  { name: "Bengaluru", coordinates: [77.5946, 12.9716] },
  { name: "Chennai", coordinates: [80.2707, 13.0827] },
  { name: "Kolkata", coordinates: [88.3639, 22.5726] },
  { name: "Hyderabad", coordinates: [78.4867, 17.385] }
];

const CONNECTIONS = [
  ["Delhi", "Mumbai"],
  ["Delhi", "Kolkata"],
  ["Mumbai", "Hyderabad"],
  ["Hyderabad", "Bengaluru"],
  ["Bengaluru", "Chennai"],
  ["Hyderabad", "Kolkata"]
];

const LINE_PAIRS = CONNECTIONS.map(([from, to]) => ({
  from: CITY_MARKERS.find((city) => city.name === from),
  to: CITY_MARKERS.find((city) => city.name === to)
}));

const geographyStyle = {
  default: {
    fill: "url(#heroIndiaFill)",
    stroke: "rgba(246,241,231,0.45)",
    strokeWidth: 0.75,
    outline: "none"
  },
  hover: {
    fill: "url(#heroIndiaFill)",
    stroke: "rgba(246,241,231,0.45)",
    strokeWidth: 0.75,
    outline: "none"
  },
  pressed: {
    fill: "url(#heroIndiaFill)",
    outline: "none"
  }
};

const IndiaMapVisual = ({ className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_center,rgba(214,181,109,0.16),transparent_42%),radial-gradient(circle_at_30%_30%,rgba(27,102,87,0.24),transparent_52%)] blur-2xl" />
      <div className="pointer-events-none relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,32,29,0.42),rgba(9,32,29,0.12))] p-3 md:p-4">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [82, 23], scale: 930 }}
          className="h-[360px] w-full md:h-[460px] lg:h-[540px]"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="heroIndiaFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e7a67" />
              <stop offset="100%" stopColor="#0b342f" />
            </linearGradient>
          </defs>

          <Geographies geography={indiaStatesUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} style={geographyStyle} />
              ))
            }
          </Geographies>

          <g className="pointer-events-none">
            {LINE_PAIRS.map(({ from, to }) => (
              <Line
                key={`${from.name}-${to.name}`}
                from={from.coordinates}
                to={to.coordinates}
                stroke="rgba(214,181,109,0.68)"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeDasharray="5 8"
              />
            ))}
          </g>

          {CITY_MARKERS.map((city) => (
            <Marker key={city.name} coordinates={city.coordinates}>
              <g>
                <circle r={11} fill="rgba(214,181,109,0.12)" className="animate-pulse" />
                <circle r={5.5} fill="#f6f1e7" />
                <circle r={2.8} fill="#d6b56d" />
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default memo(IndiaMapVisual);
