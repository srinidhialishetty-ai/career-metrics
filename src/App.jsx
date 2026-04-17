import { useEffect, useMemo, useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MotionSystem from "./components/MotionSystem";
import ThemeToggle from "./components/ThemeToggle";
import RoleSimulationPage from "./pages/RoleSimulationPage";
import RoadmapOverviewPage from "./pages/RoadmapOverviewPage";
import RoadmapStepPage from "./pages/RoadmapStepPage";
import JobsPage from "./pages/JobsPage";
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
import { getMergedRoadmap, isRoadmapComplete } from "./lib/roadmapHelpers";
import { buildPath, getRouteStateFromPath } from "./lib/routes";

const THEME_STORAGE_KEY = "career-metrics.theme-mode";

function getCanonicalView(routeView, hasSession) {
  if (!hasSession) {
    return routeView === "login" ? "login" : "landing";
  }

  if (routeView === "landing" || routeView === "login") {
    return "dashboard";
  }

  return routeView;
}

export default function App() {
  const [activeView, setActiveView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("existing");
  const [selectedRole, setSelectedRole] = useState("Data Analyst");
  const [roadmapStepIndex, setRoadmapStepIndex] = useState(0);
  const [themeMode, setThemeMode] = useState("dark");

  function syncWindowPath(view, stepIndex, replace = false) {
    const path = buildPath(view, { stepIndex });

    if (typeof window === "undefined" || window.location.pathname === path) {
      return;
    }

    window.history[replace ? "replaceState" : "pushState"]({}, "", path);
  }

  function applyRouteState({ view, role, stepIndex }, replace = false) {
    setActiveView(view);
    setSelectedRole(role);
    setRoadmapStepIndex(stepIndex);
    syncWindowPath(view, stepIndex, replace);
  }

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    setThemeMode(storedTheme === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const session = getStoredSession();
    const routeState = getRouteStateFromPath(window.location.pathname);

    if (!session) {
      applyRouteState(
        {
          view: getCanonicalView(routeState.view, false),
          role: "Data Analyst",
          stepIndex: routeState.stepIndex || 0,
        },
        true,
      );
      return;
    }

    const user = getStoredUsers().find((entry) => entry.id === session.userId);

    if (!user) {
      applyRouteState({ view: "landing", role: "Data Analyst", stepIndex: 0 }, true);
      return;
    }

    const appState = getUserAppState(user);
    const nextView = getCanonicalView(routeState.view, true);
    const nextRole = appState.navigation.role || appState.selectedRole || "Data Analyst";
    const nextStepIndex =
      nextView === "roadmap-step"
        ? routeState.stepIndex || 0
        : appState.navigation.stepIndex || 0;

    setCurrentUser(user);
    setAuthMode(session?.authMode || "existing");
    applyRouteState(
      {
        view: nextView,
        role: nextRole,
        stepIndex: nextStepIndex,
      },
      true,
    );
  }, []);

  useEffect(() => {
    function handlePopState() {
      const routeState = getRouteStateFromPath(window.location.pathname);
      const nextView = getCanonicalView(routeState.view, Boolean(currentUser));
      const appState = getUserAppState(currentUser);

      setActiveView(nextView);
      setSelectedRole(appState.navigation.role || appState.selectedRole || "Data Analyst");
      setRoadmapStepIndex(routeState.view === "roadmap-step" ? routeState.stepIndex || 0 : appState.navigation.stepIndex || 0);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentUser]);

  function persistAndRoute(appStateUpdates = {}, routeOptions = {}, replace = false) {
    const nextRole = routeOptions.role ?? selectedRole;
    const nextStepIndex = routeOptions.stepIndex ?? roadmapStepIndex;
    const nextView = routeOptions.view ?? activeView;

    if (!currentUser) {
      applyRouteState({ view: nextView, role: nextRole, stepIndex: nextStepIndex }, replace);
      return null;
    }

    const updatedUser = updateStoredUserAppState(currentUser.id, {
      ...appStateUpdates,
      selectedRole: appStateUpdates.selectedRole ?? nextRole,
      navigation: {
        ...(appStateUpdates.navigation || {}),
        view: nextView,
        role: nextRole,
        stepIndex: nextStepIndex,
      },
    });

    if (updatedUser) {
      setCurrentUser(updatedUser);
    }

    applyRouteState({ view: nextView, role: nextRole, stepIndex: nextStepIndex }, replace);
    return updatedUser;
  }

  function handleAuthSuccess(user, sessionAuthMode = "existing") {
    const appState = getUserAppState(user);
    setCurrentUser(user);
    setAuthMode(sessionAuthMode);
    applyRouteState(
      {
        view: "dashboard",
        role: appState.selectedRole || appState.navigation.role || "Data Analyst",
        stepIndex: appState.navigation.stepIndex || 0,
      },
      false,
    );
  }

  function handleConsumeNewUserWelcome() {
    updateStoredSessionAuthMode("existing");
    setAuthMode("existing");
  }

  function handleLogout() {
    clearStoredSession();
    setCurrentUser(null);
    setAuthMode("existing");
    applyRouteState({ view: "landing", role: "Data Analyst", stepIndex: 0 }, false);
  }

  function handleUpdateAppState(appStateUpdates) {
    persistAndRoute(appStateUpdates, {
      view: appStateUpdates.navigation?.view ?? activeView,
      role: appStateUpdates.navigation?.role ?? selectedRole,
      stepIndex: appStateUpdates.navigation?.stepIndex ?? roadmapStepIndex,
    });
  }

  function navigatePublic(view) {
    applyRouteState({ view, role: "Data Analyst", stepIndex: 0 }, false);
  }

  function handleOpenRoleSimulation(roleName) {
    persistAndRoute(
      {
        selectedRole: roleName,
      },
      {
        view: "role-simulation",
        role: roleName,
        stepIndex: 0,
      },
    );
  }

  function handleOpenRoadmapOverview(roleName = selectedRole) {
    persistAndRoute(
      {
        selectedRole: roleName,
      },
      {
        view: "roadmap-overview",
        role: roleName,
        stepIndex: roadmapStepIndex,
      },
    );
  }

  function handleOpenRoadmapStep(stepIndex) {
    persistAndRoute(
      {},
      {
        view: "roadmap-step",
        role: selectedRole,
        stepIndex,
      },
    );
  }

  function handleOpenJobs() {
    persistAndRoute(
      {
        jobsUnlocked: true,
        roadmapCompleted: true,
      },
      {
        view: "jobs",
        role: selectedRole,
        stepIndex: roadmapStepIndex,
      },
    );
  }

  const translations = getTranslations();
  const appState = getUserAppState(currentUser);
  const selectedRoleDetails = currentUser
    ? getRoleDetails(selectedRole, currentUser, appState)
    : null;
  const roadmapDomain =
    appState.selectedRoadmapDomain || appState.selectedDomains?.[0] || selectedRoleDetails?.domainType || "tech";
  const roadmap = useMemo(
    () => getMergedRoadmap(roadmapDomain, appState.difficultyLevel),
    [appState.difficultyLevel, roadmapDomain],
  );
  const roadmapFinished = isRoadmapComplete(roadmap, appState.stepStates);
  const jobsUnlocked = appState.jobsUnlocked || roadmapFinished;

  useEffect(() => {
    if (activeView === "jobs" && !jobsUnlocked && currentUser) {
      handleOpenRoadmapOverview(selectedRole);
    }
  }, [activeView, currentUser, jobsUnlocked, selectedRole]);

  return (
    <div className="min-h-screen bg-ink text-white">
      <MotionSystem />
      <ThemeToggle
        themeMode={themeMode}
        onToggle={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))}
      />
      <div className="app-shell relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="grid-overlay absolute inset-0 opacity-40" />
        <div className="noise-overlay absolute inset-0 opacity-20" />

        <main className="page-stage relative z-10">
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
              onBack={() => persistAndRoute({}, { view: "dashboard", role: selectedRole, stepIndex: roadmapStepIndex })}
              onOpenRoadmap={() => handleOpenRoadmapOverview(selectedRoleDetails.name)}
            />
          ) : activeView === "roadmap-overview" && currentUser && selectedRoleDetails ? (
            <RoadmapOverviewPage
              role={selectedRoleDetails}
              roadmapDomain={roadmapDomain}
              difficultyLevel={appState.difficultyLevel}
              stepStates={appState.stepStates}
              careerReadinessScore={appState.careerReadinessScore}
              onBack={() => handleOpenRoleSimulation(selectedRoleDetails.name)}
              onOpenStep={handleOpenRoadmapStep}
              onSwitchPath={() => persistAndRoute({}, { view: "dashboard", role: selectedRole, stepIndex: roadmapStepIndex })}
              onOpenJobs={jobsUnlocked ? handleOpenJobs : null}
            />
          ) : activeView === "roadmap-step" && currentUser && selectedRoleDetails ? (
            <RoadmapStepPage
              role={selectedRoleDetails}
              roadmapDomain={roadmapDomain}
              difficultyLevel={appState.difficultyLevel}
              stepIndex={roadmapStepIndex}
              stepStates={appState.stepStates}
              careerReadinessScore={appState.careerReadinessScore}
              onBack={() => persistAndRoute({}, { view: "dashboard", role: selectedRole, stepIndex: roadmapStepIndex })}
              onBackToOverview={() => handleOpenRoadmapOverview(selectedRoleDetails.name)}
              onUpdateProgress={handleUpdateAppState}
              onStepComplete={handleOpenJobs}
              onNextStep={() => {
                if (roadmapStepIndex < roadmap.phases.length - 1) {
                  handleOpenRoadmapStep(roadmapStepIndex + 1);
                } else if (jobsUnlocked) {
                  handleOpenJobs();
                } else {
                  handleOpenRoadmapOverview(selectedRoleDetails.name);
                }
              }}
              onRoadmapComplete={handleOpenJobs}
            />
          ) : activeView === "jobs" && currentUser && selectedRoleDetails && jobsUnlocked ? (
            <JobsPage
              role={selectedRoleDetails}
              roadmapDomain={roadmapDomain}
              progressPercentage={appState.progressPercentage || 100}
              readinessScore={appState.careerReadinessScore || 100}
              onBackToDashboard={() => persistAndRoute({}, { view: "dashboard", role: selectedRole, stepIndex: roadmapStepIndex })}
              onBackToRoadmap={() => handleOpenRoadmapOverview(selectedRoleDetails.name)}
            />
          ) : activeView === "landing" ? (
            <LandingPage
              onEnterSystem={() => navigatePublic("login")}
              copy={translations.landing}
            />
          ) : (
            <LoginPage
              onBack={() => navigatePublic("landing")}
              onSuccess={handleAuthSuccess}
              copy={translations.auth}
            />
          )}
        </main>
      </div>
    </div>
  );
}
