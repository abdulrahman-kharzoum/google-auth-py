import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">(
    "landing"
  );

  // Automatically show dashboard if user is logged in
  useEffect(() => {
    if (user) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("landing");
    }
  }, [user]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === "landing" ? (
        <LandingPage
          onNavigateToDashboard={() => setCurrentView("dashboard")}
        />
      ) : (
        <Dashboard onNavigateToLanding={() => setCurrentView("landing")} />
      )}
    </>
  );
}

export default App;
