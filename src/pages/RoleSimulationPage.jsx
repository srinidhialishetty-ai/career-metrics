import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { getDomainName } from "../lib/careerHelpers";
import { formatSalaryRange } from "../lib/domainData";

function getGrowthLabel(score) {
  if (score >= 85) return "Exceptional";
  if (score >= 75) return "High";
  if (score >= 60) return "Balanced";
  return "Measured";
}

function getDemandLabel(score) {
  if (score >= 82) {
    return {
      label: "High",
      body: "This role is seeing strong demand in the Indian market, especially for candidates with visible proof of execution.",
    };
  }

  if (score >= 68) {
    return {
      label: "Medium",
      body: "Demand is healthy, but standing out requires sharper projects and stronger proof than average applicants.",
    };
  }

  return {
    label: "Low",
    body: "Demand exists, but growth is slower and role selection is more sensitive to portfolio quality.",
  };
}

function getGrowthOutlook(score) {
  if (score >= 82) return "Rising";
  if (score >= 65) return "Stable";
  return "Declining";
}

function getAutomationRisk(role) {
  const value = role.riskScore ?? role.risk ?? 0;

  if (value >= 56) {
    return {
      label: "High",
      body: "Parts of this workflow are being automated quickly, so deeper problem solving and systems thinking matter more.",
    };
  }

  if (value >= 38) {
    return {
      label: "Moderate",
      body: "Routine work is vulnerable, but strong domain understanding and proof-backed projects still create resilience.",
    };
  }

  return {
    label: "Low",
    body: "This path is more insulated because it depends on judgment, collaboration, or complex execution.",
  };
}

export default function RoleSimulationPage({
  role,
  onBack,
  onOpenRoadmap,
}) {
  if (!role) {
    return null;
  }

  const demand = getDemandLabel(role.growthScore);
  const automationRisk = getAutomationRisk(role);

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">Role Simulation</p>
        </div>
        <GlowButton variant="ghost" onClick={onBack}>
          Back to Control Room
        </GlowButton>
      </header>

      <section className="mx-auto mt-6 grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.14),transparent_30%)]" />
          <div className="relative">
            <SectionLabel>Role Simulation</SectionLabel>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              {role.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
              {role.shortDescription}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-cyan/20 bg-[#07101f]/85 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Why This Role</p>
                <p className="mt-3 text-sm leading-7 text-mist">{role.insight}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Next Action</p>
                <p className="mt-3 text-sm leading-7 text-mist">
                  Generate the guided roadmap to move from interest to execution for this specific role.
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Simulation Summary</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Expected Compensation</p>
                <p className="mt-3 text-lg font-semibold text-white">{formatSalaryRange(role.salaryMin, role.salaryMax)}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">5-Year Growth Potential</p>
                <p className="mt-3 text-lg font-semibold text-white">{getGrowthLabel(role.growthScore)}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Domain</p>
                <p className="mt-3 text-lg font-semibold text-white">{getDomainName(role.domainType)}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Match Strength</p>
                <p className="mt-3 text-lg font-semibold text-white">{role.matchScore}%</p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Market Intelligence</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-cyan/20 bg-[#07101f]/85 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Market Demand</p>
                <p className="mt-3 text-lg font-semibold text-white">{demand.label}</p>
                <p className="mt-2 text-sm leading-7 text-mist">{demand.body}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Competition Level</p>
                <p className="mt-3 text-lg font-semibold text-white">{role.competition}</p>
                <p className="mt-2 text-sm leading-7 text-mist">
                  This role rewards proof-backed portfolios and consistent execution more than generic credential stacking.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Growth Outlook</p>
                <p className="mt-3 text-lg font-semibold text-white">{getGrowthOutlook(role.growthScore)}</p>
                <p className="mt-2 text-sm leading-7 text-mist">
                  The growth outlook reflects hiring momentum, compensation potential, and long-term relevance.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan/65">Automation Risk</p>
                <p className="mt-3 text-lg font-semibold text-white">{automationRisk.label}</p>
                <p className="mt-2 text-sm leading-7 text-mist">{automationRisk.body}</p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Required Skills</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
            <GlowButton className="mt-6 w-full" onClick={onOpenRoadmap}>
              Generate Role Roadmap
            </GlowButton>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
