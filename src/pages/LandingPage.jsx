import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { formatSalaryRange } from "../lib/domainData";

function AmbientCard({ className, children }) {
  return (
    <GlassPanel className={`absolute p-4 text-sm text-mist/90 ${className}`}>
      {children}
    </GlassPanel>
  );
}

export default function LandingPage({ onEnterSystem, copy }) {
  const engineSteps = [
    { title: copy.step1Title, description: copy.step1Body },
    { title: copy.step2Title, description: copy.step2Body },
    { title: copy.step3Title, description: copy.step3Body },
  ];

  const simulationCards = [
    copy.salaryGrowth,
    copy.careerDemand,
    copy.riskAnalysis,
    copy.skillGaps,
    copy.lifestyleOutcomes,
  ];

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">{copy.productSubtitle}</p>
        </div>
        <GlowButton variant="ghost" onClick={onEnterSystem}>
          {copy.accessSystem}
        </GlowButton>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-28">
        <div className="max-w-3xl animate-rise">
          <SectionLabel>{copy.heroEyebrow}</SectionLabel>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white md:text-7xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">
            {copy.heroBody}
          </p>
          <p className="mt-8 inline-flex rounded-full border border-aurora/30 bg-aurora/10 px-5 py-3 text-sm font-medium tracking-[0.18em] text-cyan shadow-[0_0_40px_rgba(124,92,255,0.18)]">
            {copy.heroTagline}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <GlowButton onClick={onEnterSystem} className="animate-pulse-glow">
              {copy.startSimulation}
            </GlowButton>
            <GlowButton variant="ghost">{copy.viewIntelligence}</GlowButton>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-sm text-mist">
            <div>
              <p className="text-2xl font-semibold text-white">{copy.simulationsValue}</p>
              <p>{copy.simulationsLabel}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{copy.confidenceValue}</p>
              <p>{copy.confidenceLabel}</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[560px] animate-rise [animation-delay:140ms]">
          <div className="absolute inset-x-10 top-6 h-40 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.22),transparent_65%)] blur-3xl" />

          <GlassPanel className="relative mx-auto w-full max-w-[34rem] overflow-hidden p-6 md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">{copy.boardLabel}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{copy.boardTitle}</p>
              </div>
              <div className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs tracking-[0.28em] text-cyan">
                {copy.liveSync}
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.75rem] border border-white/10 bg-night/80 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-mist">{copy.growthLabel}</p>
                    <p className="mt-2 text-4xl font-semibold text-white">+184%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">{copy.confidenceText}</p>
                    <p className="mt-2 text-lg text-white">{copy.high}</p>
                  </div>
                </div>
                <div className="mt-6 h-48 rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4">
                  <div className="graph-lines h-full rounded-[1.25rem]">
                    <div className="graph-wave h-full w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[copy.compensation, copy.demandIndex, copy.skillAdvantage].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-aurora/40"
                  >
                    <p className="text-sm text-mist">{item}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {[formatSalaryRange(1800000, 3200000), "92 / 100", "Top 11%"][index]}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-cyan/60">
                      {copy.updatedFeed}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">{copy.trajectory}</p>
                <p className="mt-3 text-lg text-white">{copy.trajectoryValue}</p>
                <p className="mt-2 text-sm leading-7 text-mist">
                  {copy.trajectoryBody}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">{copy.timeline}</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_rgba(69,208,255,0.7)]" />
                    <p className="text-sm text-white">{copy.timelineFirst}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-aurora shadow-[0_0_18px_rgba(124,92,255,0.7)]" />
                    <p className="text-sm text-white">{copy.timelineSecond}</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>

          <AmbientCard className="right-0 top-10 hidden w-56 animate-drift xl:block">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">Market Pulse</p>
            <div className="mt-4 flex items-end gap-2">
              {[32, 48, 62, 44, 80].map((height) => (
                <div
                  key={height}
                  className="w-6 rounded-full bg-[linear-gradient(180deg,rgba(158,247,255,0.95),rgba(124,92,255,0.38))]"
                  style={{ height }}
                />
              ))}
            </div>
          </AmbientCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>{copy.howItWorks}</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              {copy.howTitle}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {engineSteps.map((step) => (
              <GlassPanel
                key={step.title}
                className="group p-6 transition duration-300 hover:-translate-y-2 hover:border-aurora/40"
              >
                <div className="mb-5 h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.28),rgba(69,208,255,0.24))]" />
                <p className="text-xl font-semibold text-white">{step.title}</p>
                <p className="mt-3 text-sm leading-7 text-mist">{step.description}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <GlassPanel className="p-8">
            <SectionLabel>{copy.whatYouCanSimulate}</SectionLabel>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {simulationCards.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:border-cyan/40 hover:bg-white/[0.06]"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">
                    Module 0{index + 1}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(69,208,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(124,92,255,0.18),transparent_34%)]" />
            <div className="relative">
              <SectionLabel>{copy.predictivePreview}</SectionLabel>
              <div className="mt-8 rounded-[1.75rem] border border-cyan/20 bg-[#07101f]/80 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_16px_rgba(69,208,255,0.65)]" />
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan/75">{copy.aiOutput}</p>
                </div>
                <p className="max-w-xl text-2xl font-medium leading-10 text-white">
                  {copy.predictiveCopy}
                </p>
                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff,#9ef7ff)] bg-[length:200%_100%] animate-sweep" />
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10">
        <GlassPanel className="relative overflow-hidden px-8 py-14 text-center md:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.14),transparent_30%)]" />
          <div className="relative">
            <SectionLabel>{copy.systemAccess}</SectionLabel>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              {copy.finalTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-mist">
              {copy.finalBody}
            </p>
            <GlowButton onClick={onEnterSystem} className="mt-10 animate-pulse-glow">
              {copy.enterCareerMetrics}
            </GlowButton>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
