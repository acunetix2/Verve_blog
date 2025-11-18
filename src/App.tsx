import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect, createContext, useContext } from "react";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-cyan-400">
        Checking authentication...
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
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected User Routes + Wrapper */}
              <Route element={<ProtectedRoute role="user" />}>
                <Route element={<VerveHubWrapper />}>
                  <Route path="/me" element={<Index />} />
                  <Route path="/me/about" element={<About />} />
                  <Route path="/me/account" element={<Account />} />
                  <Route path="/me/blog" element={<BlogList />} />
                  <Route path="/me/resources" element={<Documents />} />
                  <Route path="/post/:slug" element={<BlogPost />} />
                </Route>
              </Route>

              {/* Protected Admin */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<VerveHubWrapper />}>
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/create" element={<CreatePost />} />
                  <Route path="/admin/documents" element={<UploadPage />} />
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
);

export default App;
