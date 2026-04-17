import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import {
  clearStoredSession,
  getStoredSession,
  getStoredUsers,
  updateStoredSessionAuthMode,
} from "./lib/mockAuth";
import { getTranslations } from "./lib/i18n";

export default function App() {
  const [activeView, setActiveView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("existing");

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      return;
    }

    const user = getStoredUsers().find((entry) => entry.id === session.userId);

    if (user) {
      setCurrentUser(user);
      setAuthMode(session?.authMode || "existing");
      setActiveView("dashboard");
    }
  }, []);

  function handleAuthSuccess(user, sessionAuthMode = "existing") {
    setCurrentUser(user);
    setAuthMode(sessionAuthMode);
    setActiveView("dashboard");
  }

  function handleConsumeNewUserWelcome() {
    updateStoredSessionAuthMode("existing");
    setAuthMode("existing");
  }

  function handleLogout() {
    clearStoredSession();
    setCurrentUser(null);
    setAuthMode("existing");
    setActiveView("landing");
  }

  const translations = getTranslations();

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="app-shell relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="grid-overlay absolute inset-0 opacity-40" />
        <div className="noise-overlay absolute inset-0 opacity-20" />

        <main className="relative z-10">
          {activeView === "dashboard" && currentUser ? (
            <DashboardPage
              user={currentUser}
              onLogout={handleLogout}
              authMode={authMode}
              onConsumeNewUserWelcome={handleConsumeNewUserWelcome}
              copy={translations.dashboard}
            />
          ) : activeView === "landing" ? (
            <LandingPage
              onEnterSystem={() => setActiveView("login")}
              copy={translations.landing}
            />
          ) : (
            <LoginPage
              onBack={() => setActiveView("landing")}
              onSuccess={handleAuthSuccess}
              copy={translations.auth}
            />
          )}
        </main>
      </div>
    </div>
  );
}
