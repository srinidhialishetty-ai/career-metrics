import { useEffect, useMemo, useState } from "react";
import DomainCard from "../components/DomainCard";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { difficultyOptions, riskOptions, skillOptions } from "../lib/careerData";
import { getRankedCareers, getDomainName } from "../lib/careerHelpers";
import { domains, formatSalaryRange } from "../lib/domainData";
import { getLanguageLabel } from "../lib/i18n";
import { getMergedRoadmap, getNextIncompleteTask, getRoadmapProgress } from "../lib/roadmapHelpers";

function getGrowthLabel(score) {
  if (score >= 85) return "Exceptional";
  if (score >= 75) return "High";
  if (score >= 60) return "Balanced";
  return "Measured";
}

export default function DashboardPage({
  user,
  onLogout,
  authMode,
  onConsumeNewUserWelcome,
  copy,
  onOpenRoleSimulation,
  onOpenRoadmapOverview,
  onUpdateAppState,
}) {
  const displayName = user?.profile?.displayName || user?.usernameOrEmail || "Operator";
  const appState = user?.appState || {};
  const [selectedDomains, setSelectedDomains] = useState(appState.selectedDomains || []);
  const [difficultyLevel, setDifficultyLevel] = useState(appState.difficultyLevel || "Moderate");
  const [skillInvestment, setSkillInvestment] = useState(appState.skillInvestment ?? 1);
  const [riskPreference, setRiskPreference] = useState(appState.riskPreference || "Medium");
  const [selectedRole, setSelectedRole] = useState(appState.selectedRole || "Data Analyst");

  useEffect(() => {
    if (authMode === "new") {
      onConsumeNewUserWelcome();
    }
  }, [authMode, onConsumeNewUserWelcome]);

  useEffect(() => {
    setSelectedDomains(appState.selectedDomains || []);
    setDifficultyLevel(appState.difficultyLevel || "Moderate");
    setSkillInvestment(appState.skillInvestment ?? 1);
    setRiskPreference(appState.riskPreference || "Medium");
    setSelectedRole(appState.selectedRole || "Data Analyst");
  }, [appState]);

  const rankedCareers = useMemo(
    () =>
      getRankedCareers(user, {
        selectedDomains,
        difficultyLevel,
        skillInvestment,
        riskPreference,
      }),
    [difficultyLevel, riskPreference, selectedDomains, skillInvestment, user],
  );

  const activeRole = rankedCareers.find((career) => career.name === selectedRole) || rankedCareers[0];
  const roadmap = getMergedRoadmap(
    appState.selectedRoadmapDomain || selectedDomains[0] || activeRole?.domainType || "tech",
    difficultyLevel,
  );
  const stepStates = appState.stepStates || {};
  const progress = getRoadmapProgress(roadmap, stepStates).percentage;
  const nextTask = getNextIncompleteTask(roadmap, stepStates);

  const profileCards = [
    { label: copy.identity, value: user?.profile?.emailAddress || user?.usernameOrEmail },
    { label: copy.age, value: user?.profile?.age || "-" },
    {
      label: copy.category,
      value: user?.profile?.casteCategory
        ? String(user.profile.casteCategory).replaceAll("_", " ")
        : "Not specified",
    },
    { label: copy.language, value: getLanguageLabel(user?.profile?.preferredLanguage) },
  ];

  function persistState(nextState) {
    onUpdateAppState({
      ...nextState,
      navigation: {
        view: "dashboard",
        role: nextState.selectedRole ?? selectedRole,
        stepIndex: appState?.navigation?.stepIndex || 0,
      },
    });
  }

  function toggleDomainSelection(domainId) {
    const nextDomains = selectedDomains.includes(domainId)
      ? selectedDomains.filter((value) => value !== domainId)
      : [...selectedDomains, domainId];
    setSelectedDomains(nextDomains);
    persistState({
      selectedDomains: nextDomains,
      difficultyLevel,
      skillInvestment,
      riskPreference,
      selectedRole,
    });
  }

  function handleSimulate(roleName) {
    setSelectedRole(roleName);
    persistState({
      selectedDomains,
      difficultyLevel,
      skillInvestment,
      riskPreference,
      selectedRole: roleName,
    });
    onOpenRoleSimulation(roleName);
  }

  function handleOpenRoadmap() {
    persistState({
      selectedDomains,
      difficultyLevel,
      skillInvestment,
      riskPreference,
      selectedRole: activeRole?.name || selectedRole,
      selectedRoadmapDomain: selectedDomains[0] || activeRole?.domainType || "tech",
    });
    onOpenRoadmapOverview(activeRole?.name || selectedRole);
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">{copy.subtitle}</p>
        </div>
        <GlowButton variant="ghost" onClick={onLogout}>
          {copy.logout}
        </GlowButton>
      </header>

      <section className="mx-auto mt-6 grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.12),transparent_30%)]" />
          <div className="relative">
            <SectionLabel>{authMode === "new" ? copy.profileInitialized : copy.simulationActive}</SectionLabel>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              {authMode === "new" ? `${copy.welcome}, ${displayName}.` : `${copy.welcomeBack}, ${displayName}.`}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
              {authMode === "new" ? copy.newUserBody : copy.body}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-cyan/20 bg-[#07101f]/85 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">Roadmap Overview</p>
                <p className="mt-3 text-2xl font-semibold text-white">{activeRole?.name || selectedRole}</p>
                <p className="mt-3 text-sm leading-7 text-mist">
                  Current step: {nextTask ? `${nextTask.monthLabel} - ${nextTask.name}` : "Roadmap completed"}
                </p>
                <p className="mt-2 text-sm text-mist">Timeline: {roadmap.phases.length} guided phases</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-white">{progress}% complete</p>
                <GlowButton className="mt-6 w-full" onClick={handleOpenRoadmap}>
                  Open Roadmap Overview
                </GlowButton>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">Selected Role Snapshot</p>
                <p className="mt-3 text-xl font-semibold text-white">{activeRole?.name}</p>
                <p className="mt-2 text-sm leading-7 text-mist">{activeRole?.shortDescription}</p>
                <div className="mt-5 space-y-3 text-sm text-mist">
                  <p>Estimated Salary: <span className="text-white">{formatSalaryRange(activeRole?.salaryMin || 0, activeRole?.salaryMax || 0)}</span></p>
                  <p>Growth Signal: <span className="text-white">{getGrowthLabel(activeRole?.growthScore || 0)}</span></p>
                  <p>Next Path: <span className="text-white">{getDomainName(selectedDomains[0] || activeRole?.domainType || "tech")}</span></p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {profileCards.map((card) => (
                <div key={card.label} className="min-w-0 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">{card.label}</p>
                  <p className="mt-3 break-words text-lg font-semibold capitalize text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Interest Selection</p>
            <p className="mt-3 text-xl font-semibold text-white">Choose the domains you want the engine to prioritize</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {domains.map((domain, index) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  isSelected={selectedDomains.includes(domain.id)}
                  onClick={() => toggleDomainSelection(domain.id)}
                  index={index}
                />
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Simulation Controls</p>
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Difficulty Level</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setDifficultyLevel(option);
                        persistState({ selectedDomains, difficultyLevel: option, skillInvestment, riskPreference, selectedRole });
                      }}
                      className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                        option === difficultyLevel
                          ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950"
                          : "border border-white/10 bg-white/[0.04] text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Skill Investment</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {skillOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSkillInvestment(option.value);
                        persistState({ selectedDomains, difficultyLevel, skillInvestment: option.value, riskPreference, selectedRole });
                      }}
                      className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                        option.value === skillInvestment
                          ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950"
                          : "border border-white/10 bg-white/[0.04] text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Risk Preference</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {riskOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setRiskPreference(option);
                        persistState({ selectedDomains, difficultyLevel, skillInvestment, riskPreference: option, selectedRole });
                      }}
                      className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                        option === riskPreference
                          ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950"
                          : "border border-white/10 bg-white/[0.04] text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Role Simulation Entry</p>
            <p className="mt-3 text-xl font-semibold text-white">Pick a role and enter a focused simulation page</p>
            <div className="mt-5 grid gap-4">
              {rankedCareers.slice(0, 6).map((career) => (
                <div key={career.name} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-white">{career.name}</p>
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan/75">
                          {getDomainName(career.domainType)}
                        </span>
                        <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                          {career.matchScore}% match
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-mist">{career.shortDescription}</p>
                      <p className="mt-3 text-sm text-white">Expected Compensation: {formatSalaryRange(career.salaryMin, career.salaryMax)}</p>
                    </div>
                    <GlowButton onClick={() => handleSimulate(career.name)}>
                      Simulate This Role
                    </GlowButton>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
