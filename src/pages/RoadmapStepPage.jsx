import { useMemo, useRef, useState } from "react";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import SectionLabel from "../components/SectionLabel";
import { getProofTypes } from "../lib/roadmapData";
import {
  getMergedRoadmap,
  getPhaseProgress,
  getRoadmapProgress,
  getTaskStatus,
} from "../lib/roadmapHelpers";

function getStatusLabel(status) {
  if (status === "in_progress") return "In Progress";
  if (status === "verifying") return "Under Review";
  if (status === "completed") return "Completed";
  return "Not Started";
}

function getStatusClass(status) {
  if (status === "completed") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  if (status === "verifying") return "border-cyan/25 bg-cyan/10 text-cyan";
  if (status === "in_progress") return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  return "border-white/10 bg-white/[0.05] text-mist";
}

export default function RoadmapStepPage({
  role,
  roadmapDomain,
  difficultyLevel,
  stepIndex,
  taskStatuses,
  proofUploads,
  onBack,
  onBackToOverview,
  onUpdateProgress,
  onNextStep,
}) {
  const roadmap = getMergedRoadmap(roadmapDomain, difficultyLevel);
  const phase = roadmap.phases[stepIndex] || roadmap.phases[0];
  const phaseProgress = getPhaseProgress(phase, taskStatuses);
  const roadmapProgress = getRoadmapProgress(roadmap, taskStatuses);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRefs = useRef({});

  const allTasksComplete = phase.tasks.every((task) => getTaskStatus(taskStatuses, task.id) === "completed");

  const taskProofTypes = useMemo(() => getProofTypes(), []);

  function showToast(message) {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage("");
    }, 2600);
  }

  function updateTask(taskId, nextStatus, proofUpdate = null) {
    const nextTaskStatuses = {
      ...taskStatuses,
      [taskId]: nextStatus,
    };
    const nextProofUploads = proofUpdate
      ? {
          ...proofUploads,
          [taskId]: proofUpdate,
        }
      : proofUploads;

    onUpdateProgress({
      taskStatuses: nextTaskStatuses,
      proofUploads: nextProofUploads,
      navigation: {
        view: "roadmap-step",
        role: role?.name,
        stepIndex,
      },
    });
  }

  function handleStartTask(taskId) {
    updateTask(taskId, "in_progress");
  }

  function handleProofUpload(task, event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const confidence = 82 + ((task.id.length + file.name.length) % 15);
    const proofUpdate = {
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      type: file.type || "application/octet-stream",
      status: "verifying",
      confidence,
    };

    updateTask(task.id, "verifying", proofUpdate);
    showToast("Verification in progress...");

    window.setTimeout(() => {
      updateTask(task.id, "completed", {
        ...proofUpdate,
        status: "verified",
      });
      showToast("Module completed successfully");
    }, 1200);
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
              <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
                {phase.description}
              </p>
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
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan/65">Roadmap Progress</p>
                  <p className="mt-3 text-lg font-semibold text-white">{roadmapProgress.percentage}% complete</p>
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
                    className="block rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan/30 hover:bg-white/[0.06]"
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
                const status = getTaskStatus(taskStatuses, task.id);
                const proof = proofUploads?.[task.id];
                const proofMeta = taskProofTypes[task.proofType];

                return (
                  <div key={task.id} className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-semibold text-white">{task.name}</p>
                          <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${getStatusClass(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-mist">{task.description}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan/65">
                          Proof required: {proofMeta?.label || "Submission"}
                        </p>
                        {proof ? (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-[#07101f]/70 p-4 text-sm text-mist">
                            <p className="text-white">{proof.fileName}</p>
                            <p className="mt-1">Uploaded: {new Date(proof.uploadedAt).toLocaleString("en-IN")}</p>
                            <p className="mt-1">
                              Status: {proof.status === "verified" ? "Verified successfully" : "Verification in progress"}
                            </p>
                            <p className="mt-1">Confidence: {proof.confidence}%</p>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex min-w-[220px] flex-col gap-3">
                        <GlowButton
                          variant={status === "not_started" ? "ghost" : "primary"}
                          onClick={() => handleStartTask(task.id)}
                          className="w-full"
                        >
                          {status === "not_started" ? "Start Task" : "Task Active"}
                        </GlowButton>
                        <input
                          ref={(node) => {
                            fileInputRefs.current[task.id] = node;
                          }}
                          type="file"
                          className="hidden"
                          onChange={(event) => handleProofUpload(task, event)}
                        />
                        <GlowButton
                          variant="ghost"
                          onClick={() => fileInputRefs.current[task.id]?.click()}
                          className="w-full"
                        >
                          Upload Proof
                        </GlowButton>
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
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#45d0ff,#7c5cff)]"
                  style={{ width: `${phaseProgress.percentage}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-white">
                {phaseProgress.completed} of {phaseProgress.total} tasks completed in this module
              </p>
              <p className="mt-4 text-sm leading-7 text-mist">
                Complete each task with proof so the system can verify progress before unlocking the next phase.
              </p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">Navigation</p>
              <p className="mt-4 text-2xl font-semibold text-white">
                {allTasksComplete ? "Module cleared" : "Finish this module"}
              </p>
              <p className="mt-3 text-sm leading-7 text-mist">
                {allTasksComplete
                  ? "You can now move forward to the next guided phase in your roadmap."
                  : "Stay focused on this month until each task is verified. Progress is earned, not skipped."}
              </p>
              <GlowButton
                className="mt-6 w-full"
                onClick={onNextStep}
                variant={allTasksComplete ? "primary" : "ghost"}
              >
                {stepIndex < roadmap.phases.length - 1 ? "Continue to Next Step" : "Return to Roadmap Overview"}
              </GlowButton>
            </GlassPanel>
          </div>
        </div>
      </section>

      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-full border border-cyan/20 bg-[#07101f]/95 px-6 py-3 text-sm text-cyan shadow-[0_0_30px_rgba(69,208,255,0.16)] backdrop-blur-xl">
            {toastMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
}
