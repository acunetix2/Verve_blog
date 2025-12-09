import React, { useEffect, useState } from "react";
import ViewSimulation from "@/components/ViewSimulation";

interface Simulation {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt?: string;
}

export default function SimulationList() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);

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

  const filteredSimulations = simulations.filter(
    (sim) =>
      sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSimulation = (_id: string) => {
    setSelectedSimulationId(_id);
  };

  const handleBackToList = () => {
    setSelectedSimulationId(null);
  };

  // If a simulation is selected, show the ViewSimulation component
  if (selectedSimulationId) {
    return (
      <div>
        <div className="bg-gradient-to-br from-blue-50 to-white py-4 px-4 border-b border-blue-100">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleBackToList}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Loading simulations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Failed to Load Simulations
          </h2>
          <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Common Cyber Attacks Simulations
          </h1>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Explore interactive cybersecurity attack simulations
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none shadow-sm"
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            />
          </div>
        </div>

        {/* Simulations Grid */}
        {filteredSimulations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              No Simulations Found
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {searchTerm ? "Try adjusting your search terms" : "No simulations available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSimulations.map((simulation) => (
              <div
                key={simulation.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {simulation.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {simulation.description}
                  </p>
                  <button
                    onClick={() => handleViewSimulation(simulation._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    View Simulation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Showing {filteredSimulations.length} of {simulations.length} simulations
          </p>
        </div>
      </div>
    </div>
  );
}