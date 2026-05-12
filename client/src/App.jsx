import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import FeatureDetailPage from "./pages/FeatureDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { getPostAuthRedirectPath } from "./utils/featureRouting";

const App = () => {
  const { user } = useAuth();
  const authRedirectPath = user ? getPostAuthRedirectPath("/dashboard", { consume: true }) : "/dashboard";

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={user ? <Navigate to={authRedirectPath} replace /> : <AuthPage />}
      />
      <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
      <Route path="/register" element={<Navigate to="/auth?mode=signup" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/population-prediction"
        element={
          <ProtectedRoute>
            <FeatureDetailPage featureKey="population" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/census"
        element={
          <ProtectedRoute>
            <FeatureDetailPage featureKey="census" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-insights"
        element={
          <ProtectedRoute>
            <FeatureDetailPage featureKey="insights" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/charts"
        element={
          <ProtectedRoute>
            <FeatureDetailPage featureKey="charts" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export default App;
