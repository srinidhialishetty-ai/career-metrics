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

export default function RoleSimulationPage({
  role,
  onBack,
  onOpenRoadmap,
}) {
  if (!role) {
    return null;
  }

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
