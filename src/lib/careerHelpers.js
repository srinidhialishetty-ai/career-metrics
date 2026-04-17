import { careerLibrary } from "./careerData";
import { domains } from "./domainData";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getDomainName(domainId) {
  return domains.find((domain) => domain.id === domainId)?.name || "Career Domain";
}

export function getDomainFromCareer(careerName) {
  const career = careerLibrary[careerName];
  return career?.domainType || "tech";
}

function getFocusSignals(track) {
  const normalized = String(track || "").toLowerCase();

  return {
    analytical:
      normalized.includes("data") ||
      normalized.includes("ai") ||
      normalized.includes("strategy")
        ? 10
        : 4,
    leadership:
      normalized.includes("product") || normalized.includes("strategy") ? 10 : 4,
    creative:
      normalized.includes("design") || normalized.includes("content") ? 10 : 3,
  };
}

function getCompatibleCareerDomains(selectedDomains) {
  if (!selectedDomains.length) {
    return new Set();
  }

  const compatibilityMap = {
    tech: ["tech"],
    healthcare: ["tech"],
    business: ["business"],
    arts: ["arts"],
    science: ["tech"],
    education: ["business", "arts"],
    sports: ["business"],
    entertainment: ["arts"],
    social: ["business", "arts"],
    engineering: ["tech"],
    law: ["business"],
    agriculture: ["tech", "business"],
    travel: ["business", "arts"],
    marketing: ["business", "arts"],
    psychology: ["business", "arts"],
  };

  return new Set(
    selectedDomains.flatMap((domainId) => compatibilityMap[domainId] || []),
  );
}

export function getRankedCareers(user, appState) {
  const age = Number(user?.profile?.age || 24);
  const selectedDomains = appState?.selectedDomains || [];
  const difficultyLevel = appState?.difficultyLevel || "Moderate";
  const skillInvestment = Number(appState?.skillInvestment || 1);
  const riskPreference = appState?.riskPreference || "Medium";
  const focusSignals = getFocusSignals(user?.profile?.focusTrack);
  const compatibleDomains = getCompatibleCareerDomains(selectedDomains);
  const hasSelectedDomains = selectedDomains.length > 0;
  const riskTarget =
    riskPreference === "Low" ? 32 : riskPreference === "High" ? 66 : 48;
  const difficultyKey = difficultyLevel.toLowerCase();
  const experienceBonus = clamp(Math.floor((age - 21) / 2), 0, 7);

  return Object.entries(careerLibrary)
    .map(([name, career]) => {
      const weights = career.matchWeights || {};
      const domainScore = !hasSelectedDomains
        ? 4
        : compatibleDomains.has(career.domainType)
          ? 12
          : -10;
      const difficultyScore = weights[difficultyKey] || 0;
      const focusScore =
        (weights.analytical || 0) * (focusSignals.analytical / 10) +
        (weights.leadership || 0) * (focusSignals.leadership / 10) +
        (weights.creative || 0) * (focusSignals.creative / 10);
      const riskAlignment = 14 - Math.min(Math.abs(career.risk - riskTarget) / 2, 14);
      const ageBonus = age >= 28 && career.domainType === "business" ? 3 : 0;
      const matchScore = clamp(
        Math.round(48 + domainScore + difficultyScore + focusScore + riskAlignment + skillInvestment * 5 + ageBonus),
        55,
        98,
      );

      return {
        ...career,
        name,
        matchScore,
        salaryMin: Math.round(career.salaryBase + experienceBonus * 50000 + skillInvestment * 100000),
        salaryMax: Math.round(career.salaryTop + experienceBonus * 80000 + skillInvestment * 150000),
        growthScore: clamp(
          career.growth + skillInvestment * 4 + (difficultyLevel === "Advanced" ? 4 : difficultyLevel === "Beginner" ? -3 : 0),
          0,
          100,
        ),
        riskScore: clamp(
          career.risk + (riskPreference === "High" ? 6 : riskPreference === "Low" ? -6 : 0) - skillInvestment,
          0,
          100,
        ),
      };
    })
    .sort((left, right) => right.matchScore - left.matchScore);
}

export function getRoleDetails(roleName, user, appState) {
  return (
    getRankedCareers(user, appState).find((career) => career.name === roleName) ||
    getRankedCareers(user, appState)[0]
  );
}

export function getProgressFromTaskStatuses(taskStatuses = {}, roadmap) {
  const totalTasks = roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completedCount = Object.values(taskStatuses).filter((status) => status === "completed").length;
  return totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
}
