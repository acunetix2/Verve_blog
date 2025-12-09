import React, { useEffect, useState } from "react";

interface Simulation {
  _id: string;  // MongoDB uses _id
  title: string;
  description: string;
  fileUrl: string;
}

interface ViewSimulationProps {
  simulationId: string;
}

export default function ViewSimulation({ simulationId }: ViewSimulationProps) {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        console.log("📡 Fetching simulation with ID:", simulationId);
        
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/simulations/${simulationId}`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Response error:", errorText);
          throw new Error("Failed to fetch simulation");
        }
        
        const data = await response.json();
        console.log("✅ Fetched simulation:", data);
        setSimulation(data);
      } catch (err) {
        console.error("🔥 Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (simulationId && simulationId !== "demo-simulation-id") {
      fetchSimulation();
    } else {
      console.error("❌ Invalid simulationId:", simulationId);
      setError(true);
      setLoading(false);
    }
  }, [simulationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Loading simulation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Simulation Not Found
          </h2>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            The simulation you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-2xl font-medium text-white mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {simulation.title}
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {simulation.description}
            </p>
          </div>
        </div>

        {/* Simulation Viewer */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Interactive Simulation
            </span>
          </div>
          <div className="relative bg-white" style={{ height: '600px' }}>
            <iframe
              src={`${import.meta.env.VITE_API_BASE_URL}/simulations/${simulation._id}/file`}
              title={simulation.title}
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            This simulation runs in a sandboxed environment for security
          </p>
        </div>
      </div>
    </div>
  );
}
