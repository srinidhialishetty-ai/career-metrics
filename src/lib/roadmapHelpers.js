import { getDomainName } from "./careerHelpers";
import { getExecutionProfile } from "./executionProfiles";
import { getRoadmapForDomain } from "./roadmapData";

export function getMergedRoadmap(domainId, difficultyLevel = "Moderate") {
  const roadmap = getRoadmapForDomain(domainId, difficultyLevel);
  const executionProfile = getExecutionProfile(domainId);

  const phases = roadmap.phases.map((phase, index) => {
    const profilePhase = executionProfile.phases[index];

    return {
      id: phase.id || `phase-${index + 1}`,
      name: profilePhase?.title || phase.name,
      monthLabel: `Month ${index + 1}`,
      duration: phase.duration || `Month ${index + 1}`,
      description: profilePhase?.description || phase.description,
      resources: profilePhase?.resources || [],
      tasks: phase.tasks || [],
    };
  });

  return {
    domainId,
    domainName: getDomainName(domainId),
    aiInsight: executionProfile.aiInsight,
    jobs: executionProfile.jobs || [],
    phases,
  };
}

export function getTaskStatus(taskStatuses, taskId) {
  return taskStatuses?.[taskId] || "not_started";
}

export function getPhaseProgress(phase, taskStatuses = {}) {
  const total = phase.tasks.length;
  const completed = phase.tasks.filter((task) => getTaskStatus(taskStatuses, task.id) === "completed").length;

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getRoadmapProgress(roadmap, taskStatuses = {}) {
  const total = roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completed = roadmap.phases.reduce(
    (sum, phase) => sum + phase.tasks.filter((task) => getTaskStatus(taskStatuses, task.id) === "completed").length,
    0,
  );

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getNextIncompletePhaseIndex(roadmap, taskStatuses = {}) {
  const nextIndex = roadmap.phases.findIndex((phase) =>
    phase.tasks.some((task) => getTaskStatus(taskStatuses, task.id) !== "completed"),
  );

  return nextIndex === -1 ? roadmap.phases.length - 1 : nextIndex;
}

export function getNextIncompleteTask(roadmap, taskStatuses = {}) {
  for (const phase of roadmap.phases) {
    const nextTask = phase.tasks.find((task) => getTaskStatus(taskStatuses, task.id) !== "completed");

    if (nextTask) {
      return {
        ...nextTask,
        phaseName: phase.name,
        monthLabel: phase.monthLabel,
      };
    }
  }

  return null;
}
