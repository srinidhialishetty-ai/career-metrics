import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RoleSimulationPage from "./pages/RoleSimulationPage";
import RoadmapOverviewPage from "./pages/RoadmapOverviewPage";
import RoadmapStepPage from "./pages/RoadmapStepPage";
import {
  clearStoredSession,
  getUserAppState,
  getStoredSession,
  getStoredUsers,
  updateStoredUserAppState,
  updateStoredSessionAuthMode,
} from "./lib/mockAuth";
import { getRoleDetails } from "./lib/careerHelpers";
import { getTranslations } from "./lib/i18n";
import { getMergedRoadmap } from "./lib/roadmapHelpers";

export default function App() {
  const [activeView, setActiveView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("existing");
  const [selectedRole, setSelectedRole] = useState("Data Analyst");
  const [roadmapStepIndex, setRoadmapStepIndex] = useState(0);

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      return;
    }

    const user = getStoredUsers().find((entry) => entry.id === session.userId);

    if (user) {
      const appState = getUserAppState(user);
      const navigation = session?.navigation || appState.navigation;
      setCurrentUser(user);
      setAuthMode(session?.authMode || "existing");
      setSelectedRole(navigation?.role || appState.selectedRole || "Data Analyst");
      setRoadmapStepIndex(navigation?.stepIndex || 0);
      setActiveView(navigation?.view || "dashboard");
    }
  }, []);

  function handleAuthSuccess(user, sessionAuthMode = "existing") {
    const appState = getUserAppState(user);
    const navigation = appState.navigation;
    setCurrentUser(user);
    setAuthMode(sessionAuthMode);
    setSelectedRole(navigation?.role || appState.selectedRole || "Data Analyst");
    setRoadmapStepIndex(navigation?.stepIndex || 0);
    setActiveView(navigation?.view || "dashboard");
  }

  function handleConsumeNewUserWelcome() {
    updateStoredSessionAuthMode("existing");
    setAuthMode("existing");
  }

  function handleLogout() {
    clearStoredSession();
    setCurrentUser(null);
    setAuthMode("existing");
    setSelectedRole("Data Analyst");
    setRoadmapStepIndex(0);
    setActiveView("landing");
  }

  function handleUpdateAppState(appStateUpdates) {
    if (!currentUser) {
      return;
    }

    const updatedUser = updateStoredUserAppState(currentUser.id, appStateUpdates);

    if (updatedUser) {
      setCurrentUser(updatedUser);
      const nextAppState = getUserAppState(updatedUser);
      setSelectedRole(nextAppState.navigation.role || nextAppState.selectedRole || "Data Analyst");
      setRoadmapStepIndex(nextAppState.navigation.stepIndex || 0);
      setActiveView(nextAppState.navigation.view || "dashboard");
    }
  }

  function handleOpenRoleSimulation(roleName) {
    setSelectedRole(roleName);
    setActiveView("role-simulation");
    handleUpdateAppState({
      selectedRole: roleName,
      navigation: {
        view: "role-simulation",
        role: roleName,
      },
    });
  }

  function handleOpenRoadmapOverview(roleName = selectedRole) {
    setSelectedRole(roleName);
    setActiveView("roadmap-overview");
    handleUpdateAppState({
      selectedRole: roleName,
      navigation: {
        view: "roadmap-overview",
        role: roleName,
      },
    });
  }

  function handleOpenRoadmapStep(stepIndex) {
    setRoadmapStepIndex(stepIndex);
    setActiveView("roadmap-step");
    handleUpdateAppState({
      navigation: {
        view: "roadmap-step",
        role: selectedRole,
        stepIndex,
      },
    });
  }

  function handleBackToDashboard() {
    setActiveView("dashboard");
    handleUpdateAppState({
      navigation: {
        view: "dashboard",
        role: selectedRole,
        stepIndex: roadmapStepIndex,
      },
    });
  }

  const translations = getTranslations();
  const appState = getUserAppState(currentUser);
  const selectedRoleDetails = currentUser
    ? getRoleDetails(selectedRole, currentUser, appState)
    : null;
  const roadmapDomain = appState.selectedRoadmapDomain || appState.selectedDomains?.[0] || selectedRoleDetails?.domainType || "tech";
  const roadmap = getMergedRoadmap(roadmapDomain, appState.difficultyLevel);

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
              onOpenRoleSimulation={handleOpenRoleSimulation}
              onOpenRoadmapOverview={handleOpenRoadmapOverview}
              onUpdateAppState={handleUpdateAppState}
            />
          ) : activeView === "role-simulation" && currentUser && selectedRoleDetails ? (
            <RoleSimulationPage
              role={selectedRoleDetails}
              onBack={handleBackToDashboard}
              onOpenRoadmap={() => handleOpenRoadmapOverview(selectedRoleDetails.name)}
            />
          ) : activeView === "roadmap-overview" && currentUser && selectedRoleDetails ? (
            <RoadmapOverviewPage
              role={selectedRoleDetails}
              roadmapDomain={roadmapDomain}
              difficultyLevel={appState.difficultyLevel}
              taskStatuses={appState.taskStatuses}
              onBack={() => handleOpenRoleSimulation(selectedRoleDetails.name)}
              onOpenStep={handleOpenRoadmapStep}
              onSwitchPath={handleBackToDashboard}
            />
          ) : activeView === "roadmap-step" && currentUser && selectedRoleDetails ? (
            <RoadmapStepPage
              role={selectedRoleDetails}
              roadmapDomain={roadmapDomain}
              difficultyLevel={appState.difficultyLevel}
              stepIndex={roadmapStepIndex}
              taskStatuses={appState.taskStatuses}
              proofUploads={appState.proofUploads}
              onBack={handleBackToDashboard}
              onBackToOverview={() => handleOpenRoadmapOverview(selectedRoleDetails.name)}
              onUpdateProgress={handleUpdateAppState}
              onNextStep={() => {
                if (roadmapStepIndex < roadmap.phases.length - 1) {
                  handleOpenRoadmapStep(roadmapStepIndex + 1);
                } else {
                  handleOpenRoadmapOverview(selectedRoleDetails.name);
                }
              }}
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
