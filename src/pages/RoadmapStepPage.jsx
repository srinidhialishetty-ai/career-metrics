import { useEffect, useMemo, useRef, useState } from "react";
import FeedbackPanel from "../components/FeedbackPanel";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { getProofTypes } from "../lib/roadmapData";
import {
  getMergedRoadmap,
  getPhaseProgress,
  getRoadmapProgress,
  getStepState,
  getTaskStatus,
  isRoadmapComplete,
  normalizeStepState,
  STEP_COMPLETION,
  STEP_VERIFICATION,
} from "../lib/roadmapHelpers";

function getStatusLabel(status) {
  if (status === "in_progress") return "In Progress";
  if (status === "verifying") return "Verifying";
  if (status === "completed") return "Completed";
  return "Not Started";
}

function getStatusClass(status) {
  if (status === "completed") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  if (status === "verifying") return "border-cyan/25 bg-cyan/10 text-cyan";
  if (status === "in_progress") return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  return "border-white/10 bg-white/[0.05] text-mist";
}

function isProjectTask(task) {
  return ["project_link", "github_link", "link"].includes(task.proofType) ||
    /project|portfolio|application|blog/i.test(`${task.name} ${task.description}`);
}

function getReadinessScore(percentage, completedCount, totalCount) {
  const completionWeight = Math.round(percentage * 0.7);
  const consistencyWeight = totalCount > 0 ? Math.round((completedCount / totalCount) * 20) : 0;
  return Math.min(100, completionWeight + consistencyWeight + 10);
}

export default function RoadmapStepPage({
  role,
  roadmapDomain,
  difficultyLevel,
  stepIndex,
  stepStates,
  careerReadinessScore,
  onBack,
  onBackToOverview,
  onUpdateProgress,
  onStepComplete,
  onNextStep,
  onRoadmapComplete,
}) {
  const roadmap = getMergedRoadmap(roadmapDomain, difficultyLevel);
  const phase = roadmap.phases[stepIndex] || roadmap.phases[0];
  const phaseProgress = getPhaseProgress(phase, stepStates);
  const roadmapProgress = getRoadmapProgress(roadmap, stepStates);
  const [toastState, setToastState] = useState(null);
  const [milestonePanel, setMilestonePanel] = useState(null);
  const [draftLinks, setDraftLinks] = useState({});
  const fileInputRefs = useRef({});
  const allTasksComplete = phase.tasks.every((task) => getTaskStatus(stepStates, task.id) === "completed");
  const taskProofTypes = useMemo(() => getProofTypes(), []);

  useEffect(() => {
    setDraftLinks(
      phase.tasks.reduce((accumulator, task) => {
        accumulator[task.id] = getStepState(stepStates, task.id).projectLink || "";
        return accumulator;
      }, {}),
    );
  }, [stepStates, stepIndex, phase.tasks]);

  function showToast(title, body = "") {
    setToastState({ title, body });
    window.setTimeout(() => {
      setToastState(null);
    }, 2800);
  }

  function persist(nextStepStates) {
    const normalizedStepStates = Object.entries(nextStepStates).reduce((accumulator, [taskId, rawStepState]) => {
      accumulator[taskId] = normalizeStepState(rawStepState);
      return accumulator;
    }, {});
    const completedCount = Object.values(normalizedStepStates).filter(
      (stepState) => stepState.completionStatus === STEP_COMPLETION.COMPLETED,
    ).length;
    const totalCount = roadmap.phases.reduce((sum, phaseItem) => sum + phaseItem.tasks.length, 0);
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const readinessScore = getReadinessScore(progressPercentage, completedCount, totalCount);
    const finished = isRoadmapComplete(roadmap, normalizedStepStates);

    onUpdateProgress({
      stepStates: normalizedStepStates,
      progressPercentage,
      careerReadinessScore: readinessScore,
      roadmapCompleted: finished,
      jobsUnlocked: finished,
      navigation: {
        view: "roadmap-step",
        role: role?.name,
        stepIndex,
      },
    });

    if (finished) {
      setMilestonePanel({
        variant: "final",
        title: "You've completed your learning path",
        body: "Now it's time to step into real opportunities. The system is preparing your reward screen.",
        actionLabel: "Open Opportunities",
        onAction: onRoadmapComplete,
      });
      window.setTimeout(() => {
        onRoadmapComplete();
      }, 1500);
    }

    return {
      normalizedStepStates,
      finished,
    };
  }

  function beginVerification(taskId, nextStepState, pendingMessage, successMessage) {
    const verifyingState = {
      ...nextStepState,
      verificationStatus: STEP_VERIFICATION.VERIFYING,
      completionStatus: STEP_COMPLETION.IDLE,
    };

    persist({
      ...stepStates,
      [taskId]: verifyingState,
    });
    showToast("Verification started", pendingMessage);

    window.setTimeout(() => {
      const result = persist({
        ...stepStates,
        [taskId]: {
          ...verifyingState,
          verificationStatus: STEP_VERIFICATION.VERIFIED,
        },
      });
      showToast(successMessage, "Your verified progress has been locked in.");

      const phaseCompleted = getPhaseProgress(phase, result.normalizedStepStates).percentage === 100;

      if (phaseCompleted && !result.finished) {
        setMilestonePanel({
          variant: "phase",
          title: "Phase Completed",
          body: "You've unlocked the next stage. The next module is ready to continue your journey.",
          actionLabel: stepIndex < roadmap.phases.length - 1 ? "Continue to Next Phase" : "View Opportunities",
          onAction: onStepComplete,
        });
        window.setTimeout(() => {
          onStepComplete();
        }, 1400);
      }
    }, 1400);
  }

  function handleStartTask(taskId) {
    const currentStepState = getStepState(stepStates, taskId);

    persist({
      ...stepStates,
      [taskId]: {
        ...currentStepState,
        verificationStatus:
          currentStepState.verificationStatus === STEP_VERIFICATION.VERIFIED
            ? STEP_VERIFICATION.VERIFIED
            : STEP_VERIFICATION.DATA_SUBMITTED,
      },
    });
  }

  function handleProjectLinkSubmit(taskId) {
    const nextProjectLink = (draftLinks[taskId] || "").trim();

    if (!nextProjectLink) {
      showToast("Project link required", "Paste a project link before submitting.");
      return;
    }

    const currentStepState = getStepState(stepStates, taskId);
    const nextStepState = {
      ...currentStepState,
      projectLink: nextProjectLink,
      proofFile: currentStepState.proofFile
        ? {
            ...currentStepState.proofFile,
            type: currentStepState.proofFile.type || "project_link",
          }
        : {
            fileName: nextProjectLink,
            uploadedAt: new Date().toISOString(),
            type: "project_link",
            status: "uploaded",
            confidence: 88 + ((taskId.length + nextProjectLink.length) % 9),
          },
      verificationStatus: STEP_VERIFICATION.DATA_SUBMITTED,
      completionStatus: STEP_COMPLETION.IDLE,
    };

    beginVerification(taskId, nextStepState, "Verifying your project link...", "Step completed successfully");
  }

  function handleProofUpload(task, event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const currentStepState = getStepState(stepStates, task.id);
    const nextStepState = {
      ...currentStepState,
      proofFile: {
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        type: file.type || "application/octet-stream",
        status: "uploaded",
        confidence: 84 + ((task.id.length + file.name.length) % 12),
      },
      verificationStatus: STEP_VERIFICATION.DATA_SUBMITTED,
      completionStatus: STEP_COMPLETION.IDLE,
    };

    beginVerification(task.id, nextStepState, "Verifying your submission...", "Step completed successfully");
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">{phase.monthLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <GlowButton variant="ghost" onClick={onBack}>
            Back to Dashboard
          </GlowButton>
          <GlowButton variant="ghost" onClick={onBackToOverview}>
            Back to Overview
          </GlowButton>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-7xl space-y-8">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.14),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <SectionLabel>{phase.monthLabel}</SectionLabel>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                {phase.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">{phase.description}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-cyan/20 bg-[#07101f]/85 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Role Track</p>
                  <p className="mt-3 text-lg font-semibold text-white">{role?.name}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Phase Progress</p>
                  <p className="mt-3 text-lg font-semibold text-white">{phaseProgress.percentage}% complete</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Career Readiness</p>
                  <p className="mt-3 text-lg font-semibold text-white">{careerReadinessScore || roadmapProgress.percentage}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#07101f]/85 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">Learning References</p>
              <div className="mt-5 space-y-4">
                {phase.resources.map((resource) => (
                  <a
                    key={`${resource.platform}-${resource.title}`}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="motion-panel motion-link block rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{resource.title}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-cyan/65">
                          {resource.platform} · {resource.category}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-mist">
                        Reference
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassPanel className="p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Module Tasks</p>
            <div className="mt-6 space-y-4">
              {phase.tasks.map((task) => {
                const stepState = getStepState(stepStates, task.id);
                const status = getTaskStatus(stepStates, task.id);
                const proof = stepState.proofFile;
                const proofMeta = taskProofTypes[task.proofType];
                const savedProjectLink = stepState.projectLink || "";
                const projectTask = isProjectTask(task);
                const hasSubmittedData = Boolean(savedProjectLink || proof);

                return (
                  <div
                    key={task.id}
                    className={`rounded-[1.75rem] border p-5 transition ${
                      status === "completed"
                        ? "border-emerald-400/20 bg-emerald-400/[0.06] shadow-[0_0_30px_rgba(52,211,153,0.08)]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-semibold text-white">{task.name}</p>
                          <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${getStatusClass(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                          {status === "completed" ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-200">
                              Verified
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-mist">{task.description}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan/65">
                          Proof required: {proofMeta?.label || "Submission"}
                        </p>

                        {projectTask ? (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-[#07101f]/55 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan/65">Project Link</p>
                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                              <input
                                type="url"
                                value={draftLinks[task.id] ?? savedProjectLink}
                                onChange={(event) =>
                                  setDraftLinks((current) => ({
                                    ...current,
                                    [task.id]: event.target.value,
                                  }))
                                }
                                placeholder="Paste GitHub, deployed app, portfolio, or drive link"
                                className="motion-input h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition focus:border-cyan/60 focus:shadow-[0_0_0_1px_rgba(69,208,255,0.2),0_0_30px_rgba(69,208,255,0.15)]"
                              />
                              <GlowButton
                                variant="ghost"
                                className="sm:min-w-[170px]"
                                onClick={() => handleProjectLinkSubmit(task.id)}
                              >
                                {savedProjectLink ? "Update Link" : "Submit Link"}
                              </GlowButton>
                            </div>
                            {savedProjectLink ? (
                              <a
                                href={savedProjectLink}
                                target="_blank"
                                rel="noreferrer"
                                className="motion-link mt-3 inline-flex text-sm text-cyan transition hover:text-cyan/80"
                              >
                                Open saved project link
                              </a>
                            ) : null}
                          </div>
                        ) : null}

                        {hasSubmittedData ? (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-[#07101f]/70 p-4 text-sm text-mist">
                            {proof ? <p className="break-all text-white">{proof.fileName}</p> : null}
                            {savedProjectLink && !proof ? <p className="break-all text-white">{savedProjectLink}</p> : null}
                            {proof?.uploadedAt ? <p className="mt-1">Uploaded: {new Date(proof.uploadedAt).toLocaleString("en-IN")}</p> : null}
                            <p className="mt-1">
                              {stepState.verificationStatus === STEP_VERIFICATION.DATA_SUBMITTED && "Submission received."}
                              {stepState.verificationStatus === STEP_VERIFICATION.VERIFYING && (proof?.type === "project_link" || (!proof && savedProjectLink) ? "Verifying your project link..." : "Verifying your submission...")}
                              {stepState.verificationStatus === STEP_VERIFICATION.VERIFIED && "Verification successful"}
                            </p>
                            {proof?.confidence ? <p className="mt-1">Confidence: {proof.confidence}%</p> : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex min-w-[220px] flex-col gap-3">
                        <GlowButton
                          variant={status === "not_started" ? "ghost" : "primary"}
                          onClick={() => handleStartTask(task.id)}
                          className="w-full"
                        >
                          {status === "not_started" ? "Start Task" : status === "completed" ? "Completed" : "Task Active"}
                        </GlowButton>
                        <input
                          ref={(node) => {
                            fileInputRefs.current[task.id] = node;
                          }}
                          type="file"
                          className="hidden"
                          onChange={(event) => handleProofUpload(task, event)}
                        />
                        {stepState.verificationStatus === STEP_VERIFICATION.VERIFYING ? (
                          <div className="loading-shimmer rounded-3xl border border-cyan/20 bg-cyan/10 px-4 py-4 text-center text-sm text-cyan">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
                              Verifying your submission...
                            </span>
                          </div>
                        ) : stepState.completionStatus === STEP_COMPLETION.COMPLETED ? (
                          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-center text-sm text-emerald-200">
                            Completed and locked
                          </div>
                        ) : (
                          <GlowButton
                            variant="ghost"
                            onClick={() => fileInputRefs.current[task.id]?.click()}
                            className="w-full"
                          >
                            {hasSubmittedData ? "Replace Proof" : "Upload Proof"}
                          </GlowButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <div className="space-y-6">
            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Progress Snapshot</p>
              <div className="progress-motion mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff)]"
                  style={{ width: `${phaseProgress.percentage}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-white">
                {phaseProgress.completed} of {phaseProgress.total} tasks completed in this module
              </p>
              <p className="mt-3 text-sm text-white">Roadmap progress: {roadmapProgress.percentage}%</p>
              <p className="mt-4 text-sm leading-7 text-mist">
                Complete each task with proof or a verified project link so the system can unlock the next phase instantly.
              </p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Navigation</p>
              <p className="mt-4 text-2xl font-semibold text-white">
                {allTasksComplete ? "Phase Completed" : "Finish this module"}
              </p>
              <p className="mt-3 text-sm leading-7 text-mist">
                {allTasksComplete
                  ? stepIndex < roadmap.phases.length - 1
                    ? "Unlocked. The next roadmap step is ready to start."
                    : "All roadmap modules are complete. Job opportunities are now ready."
                  : "Stay focused on this module until each task is verified. Progress is earned, not skipped."}
              </p>
              <GlowButton
                className="mt-6 w-full"
                onClick={allTasksComplete ? onNextStep : undefined}
                variant={allTasksComplete ? "primary" : "ghost"}
              >
                {allTasksComplete
                  ? stepIndex < roadmap.phases.length - 1
                    ? "Continue to Next Step"
                    : "Open Jobs Page"
                  : "Complete Current Tasks First"}
              </GlowButton>
            </GlassPanel>
          </div>
        </div>
      </section>

      <FeedbackPanel
        open={Boolean(toastState)}
        variant="success"
        position="bottom"
        title={toastState?.title}
        body={toastState?.body}
      />
      <FeedbackPanel
        open={Boolean(milestonePanel)}
        variant={milestonePanel?.variant}
        position="center"
        title={milestonePanel?.title}
        body={milestonePanel?.body}
        actionLabel={milestonePanel?.actionLabel}
        onAction={() => {
          const nextAction = milestonePanel?.onAction;
          setMilestonePanel(null);
          nextAction?.();
        }}
      />
    </div>
  );
}
