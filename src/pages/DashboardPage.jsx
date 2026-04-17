import { useEffect, useMemo, useState } from "react";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { getLanguageLabel } from "../lib/i18n";
import {
  careerLibrary,
  difficultyOptions,
  domainOptions,
  riskOptions,
  skillOptions,
} from "../lib/careerData";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getGrowthLabel(score) {
  if (score >= 85) return "Exceptional";
  if (score >= 75) return "High";
  if (score >= 60) return "Balanced";
  return "Measured";
}

function getRiskLabel(score) {
  if (score >= 65) return "Aggressive";
  if (score >= 45) return "Moderate";
  return "Low";
}

function getLifestyleLabel(score) {
  if (score >= 78) return "Flexible";
  if (score >= 64) return "Structured";
  return "Demanding";
}

function getDifficultyKey(level) {
  return String(level || "Moderate").toLowerCase();
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

function getCareerInsight(career, matchScore) {
  if (matchScore >= 88) {
    return "Very strong alignment across your profile, challenge level, and current simulation settings.";
  }

  if (matchScore >= 78) {
    return "Strong near-term fit with clear upside if you keep compounding the right skills.";
  }

  return career.insight;
}

function getRecommendation(primaryCareer, rankedCareers, riskPreference) {
  const topThree = rankedCareers.slice(0, 3);
  const safestCareer = topThree.reduce((best, current) =>
    current.riskScore < best.riskScore ? current : best,
  );
  const highestGrowthCareer = topThree.reduce((best, current) =>
    current.growthScore > best.growthScore ? current : best,
  );

  if (riskPreference === "Low") {
    return `Choose ${safestCareer.name} if you want steadier momentum, clearer hiring pathways, and less downside pressure.`;
  }

  if (riskPreference === "High") {
    return `Choose ${highestGrowthCareer.name} if you are optimizing for upside, faster compounding, and are comfortable with sharper competition.`;
  }

  return `Choose ${primaryCareer.name} if you want the best balance between growth, practical transition speed, and long-term optionality.`;
}

export default function DashboardPage({
  user,
  onLogout,
  authMode,
  onConsumeNewUserWelcome,
  copy,
}) {
  const displayName = user?.profile?.displayName || user?.usernameOrEmail || "Operator";
  const isFirstEntry = authMode === "new";
  const [domainFilter, setDomainFilter] = useState("All");
  const [difficultyLevel, setDifficultyLevel] = useState("Moderate");
  const [skillInvestment, setSkillInvestment] = useState(1);
  const [riskPreference, setRiskPreference] = useState("Medium");
  const [showAllCareers, setShowAllCareers] = useState(false);
  const [expandedCareers, setExpandedCareers] = useState({});
  const [primaryCareerName, setPrimaryCareerName] = useState("Data Analyst");

  useEffect(() => {
    if (isFirstEntry) {
      onConsumeNewUserWelcome();
    }
  }, [isFirstEntry, onConsumeNewUserWelcome]);

  const age = Number(user?.profile?.age || 24);
  const experienceBonus = clamp(Math.floor((age - 21) / 2), 0, 7);
  const focusSignals = getFocusSignals(user?.profile?.focusTrack);
  const preferredLanguageLabel = getLanguageLabel(user?.profile?.preferredLanguage);
  const categoryLabel = user?.profile?.casteCategory
    ? String(user.profile.casteCategory).replaceAll("_", " ")
    : "Not specified";

  const rankedCareers = useMemo(() => {
    const difficultyKey = getDifficultyKey(difficultyLevel);
    const riskTarget =
      riskPreference === "Low" ? 32 : riskPreference === "High" ? 66 : 48;
    const domainBias = domainFilter === "All" ? 0 : 9;

    return Object.entries(careerLibrary)
      .map(([name, career]) => {
        const matchWeights = career.matchWeights || {};
        const domainScore =
          domainFilter === "All"
            ? 4
            : career.domainType === domainFilter
              ? domainBias
              : -10;
        const difficultyScore = matchWeights[difficultyKey] || 0;
        const focusScore =
          (matchWeights.analytical || 0) * (focusSignals.analytical / 10) +
          (matchWeights.leadership || 0) * (focusSignals.leadership / 10) +
          (matchWeights.creative || 0) * (focusSignals.creative / 10);
        const riskAlignment = 14 - Math.min(Math.abs(career.risk - riskTarget) / 2, 14);
        const skillBonus = skillInvestment * 5;
        const ageBonus = age >= 28 && career.domainType === "Business" ? 3 : 0;
        const matchScore = clamp(
          Math.round(
            48 +
              domainScore +
              difficultyScore +
              focusScore +
              riskAlignment +
              skillBonus +
              ageBonus,
          ),
          55,
          98,
        );
        const salaryMin = Math.round(
          career.salaryBase + experienceBonus + skillInvestment * 2,
        );
        const salaryMax = Math.round(
          career.salaryTop + experienceBonus + skillInvestment * 3,
        );
        const growthScore = clamp(
          career.growth +
            skillInvestment * 4 +
            (difficultyLevel === "Advanced" ? 4 : difficultyLevel === "Beginner" ? -3 : 0),
          0,
          100,
        );
        const riskScore = clamp(
          career.risk +
            (riskPreference === "High" ? 6 : riskPreference === "Low" ? -6 : 0) -
            skillInvestment,
          0,
          100,
        );
        const lifestyleScore = clamp(
          career.lifestyle +
            (riskPreference === "Low" ? 4 : riskPreference === "High" ? -6 : 0) +
            (difficultyLevel === "Beginner" ? 3 : difficultyLevel === "Advanced" ? -4 : 0),
          0,
          100,
        );

        return {
          ...career,
          name,
          matchScore,
          salaryMin,
          salaryMax,
          growthScore,
          riskScore,
          lifestyleScore,
          detailInsight: getCareerInsight(career, matchScore),
        };
      })
      .sort((left, right) => right.matchScore - left.matchScore);
  }, [age, difficultyLevel, domainFilter, experienceBonus, focusSignals, riskPreference, skillInvestment]);

  useEffect(() => {
    if (!rankedCareers.length) {
      return;
    }

    const stillExists = rankedCareers.some((career) => career.name === primaryCareerName);

    if (!stillExists) {
      setPrimaryCareerName(rankedCareers[0].name);
    }
  }, [primaryCareerName, rankedCareers]);

  const primaryCareer =
    rankedCareers.find((career) => career.name === primaryCareerName) || rankedCareers[0];
  const visibleCareers = showAllCareers ? rankedCareers : rankedCareers.slice(0, 6);
  const comparisonCareers = rankedCareers.slice(0, 3);
  const recommendation = primaryCareer
    ? getRecommendation(primaryCareer, rankedCareers, riskPreference)
    : "";

  const missingSkills = primaryCareer
    ? primaryCareer.requiredSkills.slice(0, 3).map((skill, index) => ({
        name: skill,
        impact: ["Critical", "High", "Medium"][index],
      }))
    : [];

  const recommendedSkills = primaryCareer
    ? primaryCareer.requiredSkills.slice(1, 4).map((skill, index) => ({
        name: skill,
        value: [
          "Improves your probability of stronger salary jumps.",
          "Makes your portfolio or profile easier to trust.",
          "Reduces hiring friction and transition risk.",
        ][index],
      }))
    : [];

  const strongExistingSkills = primaryCareer
    ? primaryCareer.strongSignals.map((skill) => ({
        name: skill,
        value: "Already acting as a leverage point in this direction.",
      }))
    : [];

  const insightCards = [
    {
      label: copy.careerArc,
      value: primaryCareer ? `${primaryCareer.domainType} Momentum` : copy.careerArcValue,
      detail: primaryCareer?.detailInsight || copy.careerArcBody,
    },
    {
      label: copy.volatility,
      value: primaryCareer ? getRiskLabel(primaryCareer.riskScore) : copy.volatilityValue,
      detail:
        primaryCareer?.riskScore <= 45
          ? "This path carries relatively contained downside if you maintain steady execution."
          : "This path rewards upside but expects you to handle sharper market pressure and stronger competition.",
    },
    {
      label: copy.nextMove,
      value: primaryCareer?.requiredSkills?.[0] || copy.nextMoveValue,
      detail:
        primaryCareer?.requiredSkills?.length
          ? `Start by strengthening ${primaryCareer.requiredSkills[0]} and ${primaryCareer.requiredSkills[1]} to unlock faster movement.`
          : copy.nextMoveBody,
    },
  ];

  const heroEyebrow = isFirstEntry ? copy.profileInitialized : copy.simulationActive;
  const heroTitle = isFirstEntry
    ? `${copy.welcome}, ${displayName}.`
    : `${copy.welcomeBack}, ${displayName}.`;
  const heroBody = isFirstEntry ? copy.newUserBody : copy.body;

  function toggleCareerDetails(name) {
    setExpandedCareers((current) => ({
      ...current,
      [name]: !current[name],
    }));
  }

  if (!primaryCareer) {
    return null;
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">{copy.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden max-w-[18rem] rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-mist sm:block">
            {copy.activeProfile}:{" "}
            <span className="inline-block max-w-[10rem] truncate align-bottom text-white">
              {displayName}
            </span>
          </div>
          <GlowButton variant="ghost" onClick={onLogout}>
            {copy.logout}
          </GlowButton>
        </div>
      </header>

      <section className="mx-auto mt-6 grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.12),transparent_30%)]" />
          <div className="relative">
            <SectionLabel>{heroEyebrow}</SectionLabel>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">{heroBody}</p>

            <div className="mt-10 rounded-[2rem] border border-cyan/20 bg-[#07101f]/85 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_16px_rgba(69,208,255,0.65)]" />
                <p className="text-xs uppercase tracking-[0.32em] text-cyan/75">Future Snapshot</p>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Direction</p>
                  <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.name}</p>
                  <p className="mt-2 text-sm text-mist">{primaryCareer.shortDescription}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Future Salary</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    ${primaryCareer.salaryMin}L - ${primaryCareer.salaryMax}L
                  </p>
                  <p className="mt-2 text-sm text-mist">3-year scenario estimate</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Growth Level</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {getGrowthLabel(primaryCareer.growthScore)}
                  </p>
                  <p className="mt-2 text-sm text-mist">{primaryCareer.growthScore}/100 growth signal</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Risk Level</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {getRiskLabel(primaryCareer.riskScore)}
                  </p>
                  <p className="mt-2 text-sm text-mist">{primaryCareer.riskScore}/100 downside pressure</p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.identity}</p>
                <p className="mt-3 min-w-0 break-words text-lg font-semibold text-white">
                  {user?.usernameOrEmail}
                </p>
              </div>
              <div className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.track}</p>
                <p className="mt-3 break-words text-lg font-semibold text-white">
                  {user?.profile?.focusTrack}
                </p>
              </div>
              <div className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.tier}</p>
                <p className="mt-3 text-lg font-semibold text-white">{user?.profile?.simulationTier}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.age}</p>
                <p className="mt-3 text-lg font-semibold text-white">{user?.profile?.age}</p>
              </div>
              <div className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.category}</p>
                <p className="mt-3 break-words text-lg font-semibold capitalize text-white">
                  {categoryLabel}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.language}</p>
                <p className="mt-3 text-lg font-semibold text-white">{preferredLanguageLabel}</p>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-cyan/20 bg-[#07101f]/85 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_16px_rgba(69,208,255,0.65)]" />
                <p className="text-xs uppercase tracking-[0.32em] text-cyan/75">{copy.liveOutput}</p>
              </div>
              <p className="text-2xl leading-10 text-white">
                {primaryCareer.detailInsight}
              </p>
            </div>
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">What-If Simulation Engine</p>
            <p className="mt-3 text-xl font-semibold text-white">Tune the market lens and watch career matches recalculate</p>
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Domain Focus</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {domainOptions.map((option) => {
                    const active = option === domainFilter;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDomainFilter(option)}
                        className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950 shadow-[0_0_24px_rgba(69,208,255,0.18)]"
                            : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Difficulty Lens</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {difficultyOptions.map((option) => {
                    const active = option === difficultyLevel;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDifficultyLevel(option)}
                        className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950 shadow-[0_0_24px_rgba(69,208,255,0.18)]"
                            : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Skill Improvement</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {skillOptions.map((option) => {
                    const active = option.value === skillInvestment;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSkillInvestment(option.value)}
                        className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950 shadow-[0_0_24px_rgba(69,208,255,0.18)]"
                            : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Risk Preference</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {riskOptions.map((option) => {
                    const active = option === riskPreference;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setRiskPreference(option)}
                        className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950 shadow-[0_0_24px_rgba(69,208,255,0.18)]"
                            : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassPanel>

          {insightCards.map((card) => (
            <GlassPanel key={card.label} className="p-6 transition duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
              <p className="mt-3 text-sm leading-7 text-mist">{card.detail}</p>
            </GlassPanel>
          ))}

          <GlassPanel className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Career Match Explorer</p>
                <p className="mt-3 text-xl font-semibold text-white">Top matches powered by your profile and simulation settings</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllCareers((current) => !current)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:border-cyan/35 hover:bg-white/[0.06]"
              >
                {showAllCareers ? "Show Top Matches" : "View More Careers"}
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {visibleCareers.map((career) => {
                const active = career.name === primaryCareer.name;
                const expanded = Boolean(expandedCareers[career.name]);

                return (
                  <div
                    key={career.name}
                    className={`rounded-[1.5rem] border p-5 transition duration-300 ${
                      active
                        ? "border-cyan/35 bg-cyan/[0.07] shadow-[0_0_30px_rgba(69,208,255,0.08)]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-white">{career.name}</p>
                          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan/75">
                            {career.domainType}
                          </span>
                          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1 text-xs text-emerald-100">
                            {getGrowthLabel(career.growthScore)} growth
                          </span>
                        </div>
                        <p className="mt-2 break-words text-sm leading-7 text-mist">
                          {career.shortDescription}
                        </p>
                        <p className="mt-2 text-sm text-white/90">{career.detailInsight}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan/65">Match</p>
                          <p className="mt-1 text-2xl font-semibold text-white">{career.matchScore}%</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setPrimaryCareerName(career.name)}
                            className="rounded-full bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(69,208,255,0.18)] transition hover:scale-[1.01]"
                          >
                            Simulate This Role
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCareerDetails(career.name)}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                          >
                            {expanded ? "Hide Details" : "Expand Details"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-2">
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan/65">Fit Rationale</p>
                          <p className="mt-3 text-sm leading-7 text-mist">
                            {career.insight}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-mist">
                            Salary signal: ${career.salaryMin}L - ${career.salaryMax}L. Risk is {getRiskLabel(career.riskScore).toLowerCase()} with a {getLifestyleLabel(career.lifestyleScore).toLowerCase()} lifestyle pattern.
                          </p>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan/65">Skills To Prioritize</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {career.requiredSkills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Skill Gap Intelligence</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-400/[0.05] p-4">
                <p className="text-sm font-semibold text-white">Critical missing skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white"
                    >
                      {skill.name} - {skill.impact}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-mist">
                  If you do not improve these areas, growth slows down and the path gets harder to convert into real opportunities.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-cyan/20 bg-cyan/[0.05] p-4">
                <p className="text-sm font-semibold text-white">Recommended skills to build next</p>
                <div className="mt-3 space-y-2">
                  {recommendedSkills.map((skill) => (
                    <p key={skill.name} className="text-sm text-mist">
                      <span className="text-white">{skill.name}</span> - {skill.value}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/[0.05] p-4">
                <p className="text-sm font-semibold text-white">Strong existing skills</p>
                <div className="mt-3 space-y-2">
                  {strongExistingSkills.map((skill) => (
                    <p key={skill.name} className="text-sm text-mist">
                      <span className="text-white">{skill.name}</span> - {skill.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Reality Check Panel</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Competition</p>
                <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.competition}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Time Required</p>
                <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.timeToBreakIn}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Effort Required</p>
                <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.effort}</p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Career Comparison Mode</p>
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10">
              <div className="grid grid-cols-4 gap-3 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.22em] text-cyan/65">
                <span>Career</span>
                <span>Salary</span>
                <span>Growth</span>
                <span>Risk / Lifestyle</span>
              </div>
              {comparisonCareers.map((career) => (
                <div
                  key={career.name}
                  className="grid grid-cols-4 gap-3 border-t border-white/10 px-4 py-4 text-sm text-mist"
                >
                  <span className="break-words font-semibold text-white">{career.name}</span>
                  <span>${career.salaryMin}L - ${career.salaryMax}L</span>
                  <span>{career.growthScore}/100</span>
                  <span>
                    Risk {career.riskScore}/100 - Life {career.lifestyleScore}/100
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Decision Recommendation</p>
            <p className="mt-3 text-xl font-semibold text-white">{recommendation}</p>
            <p className="mt-3 text-sm leading-7 text-mist">
              This recommendation blends your top-ranked match, current skill investment, and risk appetite into one decision lens.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Future Life Preview</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Work Hours</p>
                <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.hours}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Stress Level</p>
                <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.stress}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Work Style</p>
                <p className="mt-3 text-lg font-semibold text-white">{primaryCareer.workMode}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Life Quality</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {primaryCareer.lifestyleScore}/100 - {getLifestyleLabel(primaryCareer.lifestyleScore)}
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
