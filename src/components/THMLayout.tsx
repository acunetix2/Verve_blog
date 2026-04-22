import { useState, useEffect } from "react";
import THMSidebar from "@/components/THMSidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";

interface UserData {
  level?: number;
  currentStreak?: number;
  totalPoints?: number;
}

export default function THMLayout() {
  const [userData, setUserData] = useState<UserData>({
    level: 1,
    currentStreak: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/me");
        if (response.data) {
          setUserData({
            level: response.data.level || 1,
            currentStreak: response.data.currentStreak || 0,
            totalPoints: response.data.totalPoints || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-white">
      {/* THM Sidebar */}
      <THMSidebar
        userLevel={userData.level}
        userStreak={userData.currentStreak}
        userPoints={userData.totalPoints}
      />

      {/* Main Content */}
      <main className="flex-1 pt-0 md:pt-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
