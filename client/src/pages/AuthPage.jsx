import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  consumeSelectedFeature,
  getFeatureLabel,
  getSelectedFeature,
  getFeatureRoute
} from "../utils/featureRouting";

const initialSignup = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const initialLogin = {
  email: "",
  password: ""
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState(initialLogin);
  const [signupData, setSignupData] = useState(initialSignup);
  const [selectedFeature, setSelectedFeature] = useState(() => getSelectedFeature());

  const redirectPath = location.state?.from || "/dashboard";

  useEffect(() => {
    const queryMode = searchParams.get("mode");
    if (queryMode === "login" || queryMode === "signup") {
      setMode(queryMode);
    }
  }, [searchParams]);

  useEffect(() => {
    setSelectedFeature(getSelectedFeature());
  }, [searchParams]);

  const activeData = useMemo(
    () => (mode === "login" ? loginData : signupData),
    [mode, loginData, signupData]
  );

  const setActiveMode = (value) => {
    setMode(value);
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updater = mode === "login" ? setLoginData : setSignupData;
    updater((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!activeData.email || !activeData.password) {
      return "Please complete the required fields";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(activeData.email.trim())) {
      return "Please enter a valid email address";
    }

    if (mode === "signup") {
      if (!signupData.name || !signupData.confirmPassword) {
        return "Please complete the required fields";
      }

      if (signupData.password.length < 6) {
        return "Password must be at least 6 characters long";
      }

      if (signupData.password !== signupData.confirmPassword) {
        return "Passwords do not match";
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (mode === "login") {
        await login(loginData);
        setSuccess("Login successful. Redirecting to your dashboard...");
      } else {
        await signup(signupData);
        setSuccess("Account created successfully. Launching your workspace...");
      }

      const selectedFeatureKey = consumeSelectedFeature();
      const nextPath = selectedFeatureKey ? getFeatureRoute(selectedFeatureKey, redirectPath) : redirectPath;
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      console.error("Auth request failed:", submitError.response?.data || submitError);
      setError(submitError.response?.data?.message || "Authentication failed");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-mesh">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left_top,rgba(214,181,109,0.14),transparent_28%),radial-gradient(circle_at_right_center,rgba(40,129,111,0.14),transparent_30%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7bb70] text-lg font-black text-[#12352b] shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
            PL
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
              Population Intelligence
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Populens</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Back to Landing
        </button>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-14 px-6 pb-10 pt-4 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,460px)] lg:px-10">
        <div className="max-w-3xl py-10 lg:py-16">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f2d68c] backdrop-blur-sm">
            {selectedFeature ? `Continue to ${getFeatureLabel(selectedFeature)}` : "Forecasting Workspace"}
          </div>

          <h2 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            See population change with the confidence of a guided control room.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
            Sign in to access secure projections, census-backed datasets, and a focused environment for demographic
            analysis across India.
          </p>

          {selectedFeature ? (
            <div className="mt-6 inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm text-[#f5deb0]">
              After authentication you will open {getFeatureRoute(selectedFeature)} directly.
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/88">
            <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-sm">
              Census-grounded inputs
            </div>
            <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-sm">
              Protected dashboard access
            </div>
            <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-sm">
              Clean forecasting flow
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[460px] rounded-[32px] border border-white/10 bg-black/60 p-9 text-white shadow-2xl shadow-black/50 backdrop-blur-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2d68c]">
                  {mode === "login" ? "Member Access" : "New Workspace"}
                </p>
                <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                  {mode === "login" ? "Welcome back" : "Create account"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Back
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/85">
              {mode === "login"
                ? "Log in to continue into your protected population forecasting workspace."
                : "Create your Populens account to begin exploring secure demographic projections."}
            </p>

            <div className="mt-8 grid grid-cols-2 rounded-full bg-white/10 p-1.5">
              <button
                type="button"
                onClick={() => setActiveMode("login")}
                className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                  mode === "login"
                    ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.28)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("signup")}
                className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                  mode === "signup"
                    ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.28)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {mode === "signup" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={signupData.name}
                    onChange={handleChange}
                    className="block h-14 w-full rounded-2xl border border-white/15 bg-white/10 px-5 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/15 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="Enter your full name"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={activeData.email}
                  onChange={handleChange}
                  className="block h-14 w-full rounded-2xl border border-white/15 bg-white/10 px-5 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/15 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={activeData.password}
                    onChange={handleChange}
                    className="block h-14 w-full rounded-2xl border border-white/15 bg-white/10 px-5 pr-14 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/15 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === "signup" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleChange}
                      className="block h-14 w-full rounded-2xl border border-white/15 bg-white/10 px-5 pr-14 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/15 focus:ring-4 focus:ring-emerald-500/20"
                      placeholder="Confirm your password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 transition hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ) : null}

              {error ? <p className="text-sm font-medium text-rose-500">{error}</p> : null}
              {success ? (
                <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <CheckCircle2 size={16} />
                  {success}
                </p>
              ) : null}

              <button
                type="submit"
                className="flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-base font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Processing..." : mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/8 px-5 py-4 text-sm leading-6 text-white/80">
              Protected sessions, verified access, and direct routing into your private demographic workspace.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
