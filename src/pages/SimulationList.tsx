import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import ViewSimulation from "@/components/ViewSimulation";

interface Simulation {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt?: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
}

export default function SimulationList() {
  const { actualTheme } = useTheme();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || ''}/simulations`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setSimulations(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  // Extract unique categories from simulations
  const categories = ["All", ...new Set(simulations.map(sim => sim.category).filter(Boolean))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  // Filter simulations
  const filteredSimulations = simulations.filter((sim) => {
    const matchesSearch = 
      sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sim.tags && sim.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === "All" || sim.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || sim.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort simulations
  const sortedSimulations = [...filteredSimulations].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "oldest":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "difficulty-asc":
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return (difficultyOrder[a.difficulty || 'Beginner'] || 0) - (difficultyOrder[b.difficulty || 'Beginner'] || 0);
      case "difficulty-desc":
        const difficultyOrderDesc = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return (difficultyOrderDesc[b.difficulty || 'Beginner'] || 0) - (difficultyOrderDesc[a.difficulty || 'Beginner'] || 0);
      default:
        return 0;
    }
  });

  const handleViewSimulation = (_id: string) => {
    setSelectedSimulationId(_id);
  };

  const handleBackToList = () => {
    setSelectedSimulationId(null);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // If a simulation is selected, show the ViewSimulation component
  if (selectedSimulationId) {
    return (
      <div>
        <div className={`py-4 px-4 border-b transition-colors ${actualTheme === 'dark' ? 'bg-gray-900 border-red-600/30' : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'}`}>
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleBackToList}
              className={`flex items-center text-sm transition-colors ${actualTheme === 'dark' ? 'text-orange-500 hover:text-orange-400' : 'text-blue-600 hover:text-blue-700'}`}
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Simulations
            </button>
          </div>
        </div>
        <ViewSimulation simulationId={selectedSimulationId} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${actualTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        <div className="text-center">
          <div className={`inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4 ${actualTheme === 'dark' ? 'border-slate-700 border-t-blue-500' : 'border-blue-200 border-t-blue-600'}`}></div>
          <p className={`text-sm ${actualTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Loading simulations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${actualTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        <div className={`rounded-2xl shadow-lg border p-8 max-w-md text-center transition-colors ${actualTheme === 'dark' ? 'bg-slate-800 border-red-900/50' : 'bg-white border-red-100'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${actualTheme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className={`text-lg font-medium mb-2 ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Failed to Load Simulations
          </h2>
          <p className={`text-sm mb-4 ${actualTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
            There was an error loading the simulations. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            style={{ fontFamily: 'Google Sans, sans-serif' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-white mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Common Cyber Attacks Simulations
            </h1>
            <p className="text-sm text-gray-400" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Explore interactive cybersecurity attack simulations
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search simulations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-gray-300  text-sm bg-gray-800 border border-red-600/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="mb-6 bg-gray-800 rounded-xl shadow-sm border border-red-600/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-gray-300 text-sm bg-gray-700 border border-red-600/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-300 bg-gray-700 border border-red-600/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-gray-300 text-sm bg-gray-700 border border-red-600/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="difficulty-asc">Difficulty (Easy to Hard)</option>
                  <option value="difficulty-desc">Difficulty (Hard to Easy)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "All" || selectedDifficulty !== "All" || searchTerm) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Active filters:
                </span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-900/30 text-orange-400 border border-orange-600/50" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-orange-300"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-900/30 text-red-400 border border-red-600/50" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="ml-2 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedDifficulty !== "All" && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getDifficultyColor(selectedDifficulty)}`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {selectedDifficulty}
                    <button
                      onClick={() => setSelectedDifficulty("All")}
                      className="ml-2"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                  }}
                  className="text-xs text-orange-500 hover:text-orange-400 underline"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Simulations Grid */}
          {sortedSimulations.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-red-600/20 p-12 text-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                No Simulations Found
              </h3>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                {searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All" 
                  ? "Try adjusting your filters or search terms" 
                  : "No simulations available yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {sortedSimulations.map((simulation) => (
                <div
                  key={simulation._id}
                  onClick={() => handleViewSimulation(simulation._id)}
                  className="bg-gray-800 rounded-2xl shadow-lg border border-red-600/20 overflow-hidden hover:border-red-600/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer hover:-translate-y-2 flex flex-col h-full"
                >
                  <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 h-20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Category and Difficulty Badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {simulation.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-orange-900/30 text-orange-400 rounded-md border border-orange-600/50" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          {simulation.category}
                        </span>
                      )}
                      {simulation.difficulty && (
                        <span className={`inline-block px-2 py-1 text-xs rounded-md border ${getDifficultyColor(simulation.difficulty)}`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          {simulation.difficulty}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-white mb-1.5 line-clamp-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {simulation.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-grow" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {simulation.description}
                    </p>

                    {/* Tags */}
                    {simulation.tags && simulation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {simulation.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-block px-2 py-0.5 text-xs bg-gray-700/50 text-gray-300 rounded" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSimulation(simulation._id);
                      }}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-xs flex-shrink-0"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Simulate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Showing {sortedSimulations.length} of {simulations.length} simulations
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-red-600/20 py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Verve Hub Writeups
          </h3>
          <p className="text-sm text-gray-400" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Cybersecurity Simulations & Educational Resources
          </p>
          <div className="mt-4 text-xs text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            © {new Date().getFullYear()} Verve Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}