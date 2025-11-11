import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Pages
import LandingPage from "./pages/Landing";
import Index from "./pages/Index";
import BlogList from "./pages/BlogList"; // Added
import BlogPost from "./pages/BlogPost";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";
import About from "./pages/About.tsx";
import AdminPage from "./pages/AdminPage";
import UploadPage from "./pages/Upload";
import Documents from "./pages/Documents";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Account from "./components/Account";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
			<Route path="/" element={<LandingPage /> } />
			<Route path="/login" element={<Login /> } />
			<Route path="/signup" element={<Signup /> } />
            {/* Homepage */}
            <Route path="/home" element={<Index />} />
			{/*About*/}
			<Route path="/about" element={<About />} />
			{/*Admin*/}
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/account" element={<Account /> } />
			{/* Create New Blog Post */}
            <Route path="/admin/create" element={<CreatePost />} />
            {/* Blog List */}
            <Route path="/blog" element={<BlogList />} /> {/* Added */}
			{/*Resources page */}
			<Route path="/resources" element={<Documents /> } />
			<Route path="/admin/documents" element={<UploadPage />} />
            {/* Blog Post Details */}
            <Route path="/post/:slug" element={<BlogPost />} />
            {/* Catch-All 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
