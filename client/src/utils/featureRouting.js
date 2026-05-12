export const FEATURE_STORAGE_KEY = "selectedFeature";

export const FEATURE_DETAILS = {
  population: {
    key: "population",
    label: "Population Prediction",
    route: "/dashboard/population-prediction"
  },
  census: {
    key: "census",
    label: "Census 2011 Base Data",
    route: "/dashboard/census"
  },
  insights: {
    key: "insights",
    label: "AI-powered Insights",
    route: "/dashboard/ai-insights"
  },
  charts: {
    key: "charts",
    label: "Interactive Charts",
    route: "/dashboard/charts"
  }
};

export const FEATURE_KEYS = Object.keys(FEATURE_DETAILS);

export const normalizeFeatureKey = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  return FEATURE_DETAILS[value] ? value : null;
};

export const setSelectedFeature = (featureKey) => {
  const normalizedFeatureKey = normalizeFeatureKey(featureKey);

  if (!normalizedFeatureKey || typeof window === "undefined") {
    return null;
  }

  window.localStorage.setItem(FEATURE_STORAGE_KEY, normalizedFeatureKey);
  return normalizedFeatureKey;
};

export const getSelectedFeature = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return normalizeFeatureKey(window.localStorage.getItem(FEATURE_STORAGE_KEY));
};

export const clearSelectedFeature = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(FEATURE_STORAGE_KEY);
};

export const consumeSelectedFeature = () => {
  const featureKey = getSelectedFeature();
  clearSelectedFeature();
  return featureKey;
};

export const getFeatureRoute = (featureKey, fallback = "/dashboard") => {
  const normalizedFeatureKey = normalizeFeatureKey(featureKey);
  return normalizedFeatureKey ? FEATURE_DETAILS[normalizedFeatureKey].route : fallback;
};

export const getFeatureLabel = (featureKey) => {
  const normalizedFeatureKey = normalizeFeatureKey(featureKey);
  return normalizedFeatureKey ? FEATURE_DETAILS[normalizedFeatureKey].label : "";
};

export const getPostAuthRedirectPath = (fallback = "/dashboard", options = {}) => {
  const featureKey = options.consume ? consumeSelectedFeature() : getSelectedFeature();
  return getFeatureRoute(featureKey, fallback);
};
