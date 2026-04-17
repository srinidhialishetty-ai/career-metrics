export const ROUTES = {
  landing: "/",
  login: "/access",
  dashboard: "/home",
  simulation: "/simulation",
  roadmap: "/roadmap",
  jobs: "/jobs",
};

export function buildPath(view, options = {}) {
  if (view === "roadmap-step") {
    const stepIndex = options.stepIndex ?? 0;
    return `/roadmap/phase-${stepIndex + 1}`;
  }

  if (view === "role-simulation") {
    return ROUTES.simulation;
  }

  if (view === "roadmap-overview") {
    return ROUTES.roadmap;
  }

  return ROUTES[view] || ROUTES.landing;
}

export function getRouteStateFromPath(pathname = "/") {
  if (pathname.startsWith("/roadmap/phase-")) {
    const raw = pathname.replace("/roadmap/phase-", "");
    const parsed = Number(raw);

    return {
      view: "roadmap-step",
      stepIndex: Number.isFinite(parsed) && parsed > 0 ? parsed - 1 : 0,
    };
  }

  if (pathname === ROUTES.roadmap) {
    return { view: "roadmap-overview", stepIndex: 0 };
  }

  if (pathname === ROUTES.simulation) {
    return { view: "role-simulation", stepIndex: 0 };
  }

  if (pathname === ROUTES.dashboard) {
    return { view: "dashboard", stepIndex: 0 };
  }

  if (pathname === ROUTES.login) {
    return { view: "login", stepIndex: 0 };
  }

  if (pathname === ROUTES.jobs) {
    return { view: "jobs", stepIndex: 0 };
  }

  return { view: "landing", stepIndex: 0 };
}
