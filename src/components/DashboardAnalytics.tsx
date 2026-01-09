import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardAnalyticsProps {
  endpoints: {
    posts: string;
    comments: string;
    likes: string;
    documents: string;
    users: string;
  };
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ endpoints }) => {
  const [dataCounts, setDataCounts] = useState({
    posts: 0,
    comments: 0,
    likes: 0,
    documents: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const { actualTheme } = useTheme();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [postsRes, commentsRes, likesRes, documentsRes, usersRes] =
          await Promise.all([
            fetch(endpoints.posts).then(r => r.json()),
            fetch(endpoints.comments).then(r => r.json()),
            fetch(endpoints.likes).then(r => r.json()),
            fetch(endpoints.documents).then(r => r.json()),
            fetch(endpoints.users).then(r => r.json()),
          ]);

        const safeCount = (data: any) =>
          Array.isArray(data) ? data.length : typeof data.count === "number" ? data.count : 0;

        setDataCounts({
          posts: safeCount(postsRes),
          comments: safeCount(commentsRes),
          likes: safeCount(likesRes),
          documents: safeCount(documentsRes),
          users: safeCount(usersRes),
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [endpoints]);

  const total = Object.values(dataCounts).reduce((a, b) => a + b, 0);

  const colors = {
    posts: { bg: "rgba(66, 133, 244, 0.15)", border: "rgb(66, 133, 244)", solid: "#4285F4" },
    comments: { bg: "rgba(234, 67, 53, 0.15)", border: "rgb(234, 67, 53)", solid: "#EA4335" },
    likes: { bg: "rgba(52, 168, 83, 0.15)", border: "rgb(52, 168, 83)", solid: "#34A853" },
    documents: { bg: "rgba(251, 188, 4, 0.15)", border: "rgb(251, 188, 4)", solid: "#FBBC04" },
    users: { bg: "rgba(103, 58, 183, 0.15)", border: "rgb(103, 58, 183)", solid: "#673AB7" },
  };

  const icons = {
    posts: "📝",
    comments: "💬",
    likes: "❤️",
    documents: "📄",
    users: "👥",
  };

  const doughnutData = {
    labels: ["Posts", "Comments", "Likes", "Documents", "Users"],
    datasets: [
      {
        data: Object.values(dataCounts),
        backgroundColor: Object.values(colors).map(c => c.solid),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const barData = {
    labels: ["Posts", "Comments", "Likes", "Documents", "Users"],
    datasets: [
      {
        label: "Count",
        data: Object.values(dataCounts),
        backgroundColor: Object.values(colors).map(c => c.solid),
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 40,
        maxBarThickness: 50,
      },
    ],
  };

  const lineData = {
    labels: ["Posts", "Comments", "Likes", "Documents", "Users"],
    datasets: [
      {
        label: "Activity Trend",
        data: Object.values(dataCounts),
        borderColor: "rgb(66, 133, 244)",
        backgroundColor: "rgba(66, 133, 244, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(66, 133, 244)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            family: "'Google Sans', sans-serif",
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Google Sans', sans-serif",
          size: 14,
          weight: '500',
        },
        bodyFont: {
          family: "'Google Sans', sans-serif",
          size: 13,
        },
      },
    },
  };

  const StatCard = ({ title, value, color, icon }: { title: string; value: number; color: any; icon: string }) => (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-sm"
          style={{ backgroundColor: color.bg }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${total > 0 ? (value / total) * 100 : 0}%`, backgroundColor: color.solid }}
          ></div>
        </div>
        <span className="text-xs font-medium text-gray-500" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          {total > 0 ? Math.round((value / total) * 100) : 0}%
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 flex items-center justify-center transition-colors duration-300 ${
        actualTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="text-center">
          <div className="inline-block relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 border-transparent"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  const { actualTheme } = useTheme();

  // adapt chart options to theme
  const dynamicChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        labels: {
          ...chartOptions.plugins.legend.labels,
          color: actualTheme === 'dark' ? '#E5E7EB' : '#0F172A',
        },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        backgroundColor: actualTheme === 'dark' ? 'rgba(2,6,23,0.9)' : 'rgba(0,0,0,0.8)'
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        
        body {
          font-family: 'Google Sans', sans-serif;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
        actualTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm ml-4 font-medium" style={{ fontFamily: "'Google Sans', sans-serif" }}>
              Real-time performance metrics and insights
            </p>
          </div>

          {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <StatCard title="Posts" value={dataCounts.posts} color={colors.posts} icon={icons.posts} />
            <StatCard title="Comments" value={dataCounts.comments} color={colors.comments} icon={icons.comments} />
            <StatCard title="Likes" value={dataCounts.likes} color={colors.likes} icon={icons.likes} />
            <StatCard title="Documents" value={dataCounts.documents} color={colors.documents} icon={icons.documents} />
            <StatCard title="Users" value={dataCounts.users} color={colors.users} icon={icons.users} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-5 sm:mb-6">
            {/* Doughnut Chart */}
            <div className={`${actualTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-100 text-slate-900'} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  Data Distribution
                </h3>
              </div>
                <div className="h-52 sm:h-60 flex items-center justify-center mb-4">
                <Doughnut data={doughnutData} options={{ ...dynamicChartOptions, cutout: '80%' }} />
              </div>
              <div className="text-center pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Google Sans', sans-serif" }}>Total Items</p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  {total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Line Chart */}
            <div className={`${actualTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-100 text-slate-900'} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  Activity Trend
                </h3>
              </div>
                <div className="h-52 sm:h-60">
                <Line data={lineData} options={dynamicChartOptions} />
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className={`${actualTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-100 text-slate-900'} rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                Category Comparison
              </h3>
            </div>
              <div className="h-64 sm:h-80">
              <Bar 
                data={barData} 
                options={{
                  ...dynamicChartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: actualTheme === 'dark' ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.05)',
                        drawTicks: true,
                      },
                      ticks: {
                        color: actualTheme === 'dark' ? '#E5E7EB' : '#0F172A',
                        font: {
                          family: "'Google Sans', sans-serif",
                        },
                      },
                    },
                    x: {
                      grid: {
                        display: true,
                        color: actualTheme === 'dark' ? 'rgba(148,163,184,0.03)' : 'rgba(0,0,0,0.05)',
                        drawTicks: true,
                      },
                      ticks: {
                        color: actualTheme === 'dark' ? '#E5E7EB' : '#0F172A',
                        font: {
                          family: "'Google Sans', sans-serif",
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAnalytics;