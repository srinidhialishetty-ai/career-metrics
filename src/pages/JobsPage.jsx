import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { getExecutionProfile } from "../lib/executionProfiles";
import { getDomainName } from "../lib/careerHelpers";
import { formatINR } from "../lib/domainData";

function getSalaryGrowth(role) {
  const base = role?.salaryMin || 0;
  const midpoint = Math.round(((role?.salaryMin || 0) + (role?.salaryMax || 0)) / 2);
  const tenthYear = Math.round((role?.salaryMax || midpoint) * 1.45);

  return [
    { year: "Year 1", salary: base },
    { year: "Year 3", salary: Math.round(base * 1.28) },
    { year: "Year 5", salary: midpoint },
    { year: "Year 10", salary: tenthYear },
  ];
}

function getDemandSignal(score) {
  if (score >= 82) {
    return { label: "Rising", value: 88, body: "Hiring momentum remains strong and long-term demand is expanding." };
  }

  if (score >= 68) {
    return { label: "Stable", value: 68, body: "Demand is healthy, but proof-backed candidates stand out more clearly." };
  }

  return { label: "Slowing", value: 44, body: "Openings remain, but the market is more selective and slower-moving." };
}

function getAutomationRiskLabel(score) {
  if (score >= 56) return "High";
  if (score >= 38) return "Moderate";
  return "Low";
}

export default function JobsPage({
  role,
  roadmapDomain,
  progressPercentage,
  readinessScore,
  onBackToDashboard,
  onBackToRoadmap,
}) {
  const profile = getExecutionProfile(roadmapDomain);
  const jobs = profile.jobs || [];
  const salaryGrowth = getSalaryGrowth(role);
  const demand = getDemandSignal(role?.growthScore || 0);

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">Available Opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <GlowButton variant="ghost" onClick={onBackToRoadmap}>
            Back to Roadmap
          </GlowButton>
          <GlowButton variant="ghost" onClick={onBackToDashboard}>
            Return Home
          </GlowButton>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-7xl space-y-8">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.14),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionLabel>Completion Unlocked</SectionLabel>
              <h1 className="motion-display mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                Opportunities and Future Insights
              </h1>
              <p className="motion-fade-up motion-delay-1 mt-5 max-w-2xl text-lg leading-8 text-mist">
                You completed a verified milestone in {role?.name} within {getDomainName(roadmapDomain)}. The engine has now unlocked the most relevant opportunities, long-term salary outlook, market demand, and risk signals for this path.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-cyan/20 bg-[#07101f]/85 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Current Progress</p>
                <p className="mt-3 text-2xl font-semibold text-white">{progressPercentage}%</p>
                <p className="mt-2 text-sm leading-7 text-mist">Your verified execution progress has been recognized and stored.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Career Readiness</p>
                <p className="mt-3 text-2xl font-semibold text-white">{readinessScore}%</p>
                <p className="mt-2 text-sm leading-7 text-mist">Built from verified task completion, consistency, and project proof.</p>
              </div>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">10-Year Salary Growth</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {salaryGrowth.map((point, index) => {
                const maxValue = salaryGrowth[salaryGrowth.length - 1].salary || 1;
                const height = Math.max(24, Math.round((point.salary / maxValue) * 150));

                return (
                  <div key={point.year} className={`motion-fade-up rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 ${index ? `motion-delay-${Math.min(index, 3)}` : ""}`}>
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan/65">{point.year}</p>
                    <div className="mt-4 flex h-40 items-end">
                      <div
                        className="chart-bar w-full rounded-t-[1rem] bg-[linear-gradient(180deg,rgba(69,208,255,0.95),rgba(124,92,255,0.82))]"
                        style={{ height: `${height}px` }}
                      />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">{formatINR(point.salary)}</p>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <div className="space-y-5">
            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Market Demand</p>
              <p className="mt-4 text-2xl font-semibold text-white">{demand.label}</p>
              <div className="progress-motion mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff)]"
                  style={{ width: `${demand.value}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-mist">{demand.body}</p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Risk Analysis</p>
              <div className="mt-5 space-y-3 text-sm text-mist">
                <p><span className="text-white">Competition:</span> {role?.competition}</p>
                <p><span className="text-white">Automation Risk:</span> {getAutomationRiskLabel(role?.riskScore ?? role?.risk ?? 0)}</p>
                <p><span className="text-white">Market Stability:</span> {demand.label === "Rising" ? "Strong upside with manageable volatility" : demand.label === "Stable" ? "Balanced with healthy medium-term demand" : "More selective and slower-moving hiring climate"}</p>
              </div>
            </GlassPanel>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job, index) => (
            <GlassPanel key={`${job.source}-${job.title}`} className={`reward-card p-6 ${index ? `motion-delay-${Math.min(index, 3)}` : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">{job.source}</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">{job.title}</h2>
                </div>
                <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan">
                  Relevant
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-mist">{job.description}</p>
              <div className="mt-5 space-y-2 text-sm text-mist">
                <p><span className="text-white">Location:</span> {job.location}</p>
                <p><span className="text-white">Path Fit:</span> {job.relevance}</p>
                <p><span className="text-white">Aligned Skills:</span> {role?.requiredSkills?.slice(0, 4).join(", ")}</p>
              </div>
              <a href={job.url} target="_blank" rel="noreferrer" className="block">
                <GlowButton className="mt-6 w-full">
                  View Job
                </GlowButton>
              </a>
            </GlassPanel>
          ))}
        </div>
      </section>
    </div>
  );
}
