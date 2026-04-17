import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { formatSalaryRange } from "../lib/domainData";
import {
  getMergedRoadmap,
  getNextIncompletePhaseIndex,
  getNextIncompleteTask,
  getPhaseProgress,
  getRoadmapProgress,
} from "../lib/roadmapHelpers";

export default function RoadmapOverviewPage({
  role,
  roadmapDomain,
  difficultyLevel,
  taskStatuses,
  onBack,
  onOpenStep,
  onSwitchPath,
}) {
  const roadmap = getMergedRoadmap(roadmapDomain, difficultyLevel);
  const progress = getRoadmapProgress(roadmap, taskStatuses);
  const nextPhaseIndex = getNextIncompletePhaseIndex(roadmap, taskStatuses);
  const nextTask = getNextIncompleteTask(roadmap, taskStatuses);

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">Roadmap Architecture</p>
        </div>
        <div className="flex items-center gap-3">
          <GlowButton variant="ghost" onClick={onSwitchPath}>
            Switch Career Path
          </GlowButton>
          <GlowButton variant="ghost" onClick={onBack}>
            Back to Role Simulation
          </GlowButton>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-7xl space-y-8">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.14),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionLabel>Execution Architecture</SectionLabel>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                {role?.name} Roadmap
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
                This is your guided execution path for {roadmap.domainName}. Move one phase at a time,
                keep proof attached to each task, and let the system track what is complete and what comes next.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-cyan/20 bg-[#07101f]/85 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Current Module</p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {nextTask ? `${nextTask.monthLabel}` : "All phases complete"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-mist">
                    {nextTask ? `${nextTask.phaseName} - ${nextTask.name}` : "Your roadmap is fully completed."}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Progress Snapshot</p>
                  <p className="mt-3 text-lg font-semibold text-white">{progress.percentage}% complete</p>
                  <p className="mt-2 text-sm leading-7 text-mist">
                    {progress.completed} of {progress.total} roadmap tasks verified.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Expected Compensation</p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {formatSalaryRange(role?.salaryMin || 0, role?.salaryMax || 0)}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-mist">
                    Estimated range for this simulation in the Indian market.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#07101f]/85 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">What Comes Next</p>
              <p className="mt-4 text-2xl font-semibold text-white">
                {roadmap.aiInsight?.title || "Execution Plan"}
              </p>
              <p className="mt-4 text-sm leading-7 text-mist">
                {roadmap.aiInsight?.insight}
              </p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff)]"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <GlowButton className="mt-6 w-full" onClick={() => onOpenStep(nextPhaseIndex)}>
                {progress.completed === 0 ? "Start Month 1" : "Open Current Module"}
              </GlowButton>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {roadmap.phases.map((phase, index) => {
            const phaseProgress = getPhaseProgress(phase, taskStatuses);
            const isCurrent = index === nextPhaseIndex;

            return (
              <GlassPanel key={phase.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-cyan/65">{phase.monthLabel}</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">{phase.name}</h2>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                      isCurrent
                        ? "border border-cyan/25 bg-cyan/10 text-cyan"
                        : "border border-white/10 bg-white/[0.05] text-mist"
                    }`}
                  >
                    {phaseProgress.percentage}% done
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-mist">{phase.description}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff)]"
                    style={{ width: `${phaseProgress.percentage}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-mist">
                  {phaseProgress.completed}/{phaseProgress.total} verified tasks completed
                </p>
                <div className="mt-5 space-y-2 text-sm text-mist">
                  {phase.tasks.slice(0, 2).map((task) => (
                    <p key={task.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      {task.name}
                    </p>
                  ))}
                </div>
                <GlowButton className="mt-6 w-full" onClick={() => onOpenStep(index)}>
                  {isCurrent ? "Open Current Module" : `Go to ${phase.monthLabel}`}
                </GlowButton>
              </GlassPanel>
            );
          })}
        </div>
      </section>
    </div>
  );
}
