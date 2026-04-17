import { getDomainName } from "./careerHelpers";
import { getExecutionProfile } from "./executionProfiles";
import { getRoadmapForDomain } from "./roadmapData";

export const STEP_VERIFICATION = {
  IDLE: "IDLE",
  DATA_SUBMITTED: "DATA_SUBMITTED",
  VERIFYING: "VERIFYING",
  VERIFIED: "VERIFIED",
};

export const STEP_COMPLETION = {
  IDLE: "IDLE",
  COMPLETED: "COMPLETED",
};

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

export function normalizeStepState(stepState = {}) {
  const projectLink = String(stepState.projectLink || "").trim();
  const proofFile = stepState.proofFile || null;
  const hasSubmittedData = Boolean(projectLink || proofFile);
  let verificationStatus = stepState.verificationStatus || STEP_VERIFICATION.IDLE;

  if (!hasSubmittedData) {
    verificationStatus = STEP_VERIFICATION.IDLE;
  } else if (verificationStatus === STEP_VERIFICATION.IDLE) {
    verificationStatus = STEP_VERIFICATION.DATA_SUBMITTED;
  }

  const completionStatus =
    verificationStatus === STEP_VERIFICATION.VERIFIED
      ? STEP_COMPLETION.COMPLETED
      : STEP_COMPLETION.IDLE;

  return {
    projectLink,
    proofFile,
    verificationStatus,
    completionStatus,
  };
}

export function getStepState(stepStates = {}, taskId) {
  return normalizeStepState(stepStates?.[taskId]);
}

export function getTaskStatus(stepStates, taskId) {
  const stepState = getStepState(stepStates, taskId);

  if (stepState.completionStatus === STEP_COMPLETION.COMPLETED) {
    return "completed";
  }

  if (stepState.verificationStatus === STEP_VERIFICATION.VERIFYING) {
    return "verifying";
  }

  if (stepState.verificationStatus === STEP_VERIFICATION.DATA_SUBMITTED || stepState.projectLink || stepState.proofFile) {
    return "in_progress";
  }

  return "not_started";
}

export function getDerivedLegacyStepFields(stepStates = {}) {
  const taskStatuses = {};
  const proofUploads = {};
  const projectLinks = {};

  Object.entries(stepStates).forEach(([taskId, rawStepState]) => {
    const stepState = normalizeStepState(rawStepState);
    taskStatuses[taskId] = getTaskStatus({ [taskId]: stepState }, taskId);

    if (stepState.projectLink) {
      projectLinks[taskId] = stepState.projectLink;
    }

    if (stepState.proofFile) {
      proofUploads[taskId] = stepState.proofFile;
    }
  });

  return {
    taskStatuses,
    proofUploads,
    projectLinks,
  };
}

export function getPhaseProgress(phase, stepStates = {}) {
  const total = phase.tasks.length;
  const completed = phase.tasks.filter((task) => getTaskStatus(stepStates, task.id) === "completed").length;

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getRoadmapProgress(roadmap, stepStates = {}) {
  const total = roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completed = roadmap.phases.reduce(
    (sum, phase) => sum + phase.tasks.filter((task) => getTaskStatus(stepStates, task.id) === "completed").length,
    0,
  );

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function isRoadmapComplete(roadmap, stepStates = {}) {
  return roadmap.phases.every((phase) =>
    phase.tasks.every((task) => getTaskStatus(stepStates, task.id) === "completed"),
  );
}

export function getNextIncompletePhaseIndex(roadmap, stepStates = {}) {
  const nextIndex = roadmap.phases.findIndex((phase) =>
    phase.tasks.some((task) => getTaskStatus(stepStates, task.id) !== "completed"),
  );

  return nextIndex === -1 ? roadmap.phases.length - 1 : nextIndex;
}

export function getNextIncompleteTask(roadmap, stepStates = {}) {
  for (const phase of roadmap.phases) {
    const nextTask = phase.tasks.find((task) => getTaskStatus(stepStates, task.id) !== "completed");

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
