/**
 * Author / Copyright: Iddy
 * All rights reserved.
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect, createContext, useContext } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import axios from "axios";
import '@/lib/axiosConfig'; // Initialize axios interceptors

// Wrapper
import VerveHubWrapper from "@/components/VerveHubWrapper";
// Pages
import LandingPage from "./pages/Landing";
import Index from "./pages/Index";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import AdminPage from "./pages/AdminPage";
import UploadPage from "./pages/Upload";
import Documents from "./pages/Documents";
import Signup from "@/components/Signup";
import Login from "./components/Login";
import Account from "./components/Account";
import Resources from "./pages/Resources";
import Support from "./pages/Support";
import Community from "./pages/Community";
import Documentation from "./pages/Documentation";
import Newsletter from "./pages/Newsletter";
import Billing from "./pages/Billing";
import ResetPassword from "@/components/ResetPassword";
import ForgotPassword from "@/components/ForgotPassword";
import AIAssistant from "@/components/AIAssistant";
import UploadSimulation from "@/components/UploadSimulation";
import SimulationList from "@/pages/SimulationList";
import VerifyEmail from "@/pages/VerifyEmail";
import SeriesViewPage from "@/pages/SeriesViewPage";
import CoursesList from "@/pages/CoursesList";
import CourseDetail from "@/pages/CourseDetail";
import LessonView from "@/pages/LessonView";
import FinalExam from "@/pages/FinalExam";
import UserProgressDashboard from "@/pages/UserProgressDashboard";
import UserCertificates from "@/pages/UserCertificates";
import NotificationsPage from "@/pages/NotificationsPage";
import FloatingActionButton from "@/components/FloatingActionButton";
import VerveHubLogo  from "@/components/VerveHubLogo";

// --- Auth Context ---
interface AuthContextType {
  loading: boolean;
  token: string | null;
  role: "user" | "admin" | null;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
  token: null,
  role: null,
  refresh: () => {},
});

const useAuth = () => useContext(AuthContext);
    const FullScreenLoader = () => (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
        {/* Logo and Text - Stacked Vertically */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20">
            <VerveHubLogo size="lg" />
          </div>
          <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-center">
            Verve Hub Academy
          </span>
        </div>

        {/* Spinner */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6"></div>

        {/* Loading Text */}
        <p className="text-cyan-500 font-medium text-base sm:text-lg animate-pulse">
          Please wait...
        </p>
      </div>
    );
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  const refresh = () => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role") as "user" | "admin" | null;
    setToken(t);
    setRole(r ?? null);
  };

  useEffect(() => {
    refresh();
    setLoading(false);

    // Listen for storage changes (e.g., login in another tab or after redirect)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "role") {
        refresh();
      }
    };

    // Listen for custom event when token is set
    const handleTokenUpdate = () => {
      refresh();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenUpdated", handleTokenUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleTokenUpdate);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ loading, token, role, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- ProtectedRoute ---
interface ProtectedRouteProps {
  role?: "admin" | "user";
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { loading, token, role: userRole } = useAuth();
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [checkingBackend, setCheckingBackend] = useState(true);

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        setCheckingBackend(true);
        // Try to reach the backend with a health check endpoint
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/health`, {
          timeout: 5000,
        });
        setBackendHealthy(true);
      } catch (error) {
        setBackendHealthy(false);
      } finally {
        setCheckingBackend(false);
      }
    };

    checkBackendHealth();
  }, []);

  if (loading || checkingBackend) {
    return <FullScreenLoader />
  }

  // If backend is not healthy, show error message
  if (!backendHealthy) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6">
        <div className="text-6xl mb-6 animate-bounce">⚠️</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center drop-shadow-lg">
          Service Unavailable
        </h1>
        <p className="text-gray-300 text-center mb-8 max-w-md">
          Our system is currently undergoing maintenance. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-1 hover:scale-105"
        >
          Retry
        </button>
        <p className="text-gray-400 text-sm mt-6">Thank you for your patience!</p>
      </div>
    );
  }

  if (!token || (role && role !== userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Query Client
const queryClient = new QueryClient();

const App = () => (
<ThemeProvider>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<AIAssistant />
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />

              {/* Protected User Routes + Wrapper */}
              <Route element={<ProtectedRoute role="user" />}>
                <Route element={<VerveHubWrapper />}>
                  <Route path="/v" element={<Index />} />
                  <Route path="/v/about" element={<About />} />
                  <Route path="/v/account" element={<Account />} />
                  <Route path="/v/notifications" element={<NotificationsPage />} />
                  <Route path="/v/blog" element={<BlogList />} />
                  <Route path="/v/resources" element={<Documents />} />
				          <Route path="/v/simulations" element={<SimulationList />} />
                  <Route path="/post/:slug" element={<BlogPost />} />
                  <Route path="/series/:slug" element={<SeriesViewPage />} />
                  <Route path="/resource" element={<Resources />} />
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/v/billing" element={<Billing />} />
                  <Route path="/v/courses" element={<CoursesList />} />
                  <Route path="/v/courses/:courseId" element={<CourseDetail />} />
                  <Route path="/v/courses/:courseId/lesson/:lessonId" element={<LessonView />} />
                  <Route path="/exam/:courseId" element={<FinalExam />} />
                  <Route path="/v/my-progress" element={<UserProgressDashboard />} />
                  <Route path="/v/my-certificates" element={<UserCertificates />} />
                </Route>
              </Route>

              {/* Protected Admin */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<VerveHubWrapper />}>
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/create" element={<CreatePost />} />
                  <Route path="/admin/documents" element={<UploadPage />} />
                  <Route path="/admin/account" element={<Account />} />
				          <Route path="/admin/simulations" element={<UploadSimulation />} />
                </Route>
              </Route>
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ThemeProvider>
);

export default App;
