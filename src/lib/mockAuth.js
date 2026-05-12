import { getDerivedLegacyStepFields, normalizeStepState } from "./roadmapHelpers";

const USERS_KEY = "career-metrics.mock-users";
const SESSION_KEY = "career-metrics.mock-session";
const PASSWORD_ALGORITHM = "PBKDF2-SHA256";
const PASSWORD_ITERATIONS = 150000;

const DEFAULT_APP_STATE = {
  selectedDomains: [],
  difficultyLevel: "Moderate",
  skillInvestment: 1,
  riskPreference: "Medium",
  selectedRole: "Data Analyst",
  selectedRoadmapDomain: "tech",
  stepStates: {},
  progressPercentage: 0,
  careerReadinessScore: 0,
  roadmapCompleted: false,
  jobsUnlocked: false,
  navigation: {
    view: "dashboard",
    role: "Data Analyst",
    stepIndex: 0,
  },
};

const DEFAULT_TEST_USER = {
  id: "test_user_001",
  identity: "testuser",
  usernameKey: "testuser",
  usernameOrEmail: "testuser",
  password: "test123",
  profile: {
    fullName: "Test User",
    username: "testuser",
    emailAddress: "test@example.com",
    mobileNumber: "9876543210",
    age: "25",
    casteCategory: "general",
    preferredLanguage: "en",
    displayName: "Test User",
    createdAt: new Date().toISOString(),
    simulationTier: "Explorer",
    focusTrack: "AI Product Strategy",
  },
  appState: {
    ...structuredClone(DEFAULT_APP_STATE),
  },
};

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson(key, fallback) {
  if (!hasStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function sanitizeIdentity(identity) {
  return String(identity || "").trim().toLowerCase();
}

function getUsernameKey(username) {
  return sanitizeIdentity(username).replace(/\s+/g, "");
}

function getEmailKey(email) {
  return sanitizeIdentity(email);
}

function getDisplayUsername(username) {
  return String(username || "").trim();
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getRandomBytes(length) {
  const bytes = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
    return bytes;
  }

  for (let index = 0; index < length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function derivePasswordHash(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password hashing is not available in this browser.");
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return bytesToBase64(new Uint8Array(bits));
}

async function hashPassword(password) {
  const salt = getRandomBytes(16);
  const hash = await derivePasswordHash(password, salt);

  return {
    algorithm: PASSWORD_ALGORITHM,
    iterations: PASSWORD_ITERATIONS,
    salt: bytesToBase64(salt),
    hash,
  };
}

async function verifyPassword(user, password) {
  if (user?.passwordCredential?.hash && user?.passwordCredential?.salt) {
    const hash = await derivePasswordHash(password, base64ToBytes(user.passwordCredential.salt));

    return hash === user.passwordCredential.hash;
  }

  return user?.password === password;
}

function buildFallbackUsername(user) {
  const seededUsername = user?.profile?.username || user?.usernameOrEmail || "";
  const emailLocalPart = String(user?.profile?.emailAddress || "")
    .split("@")[0]
    .trim();
  const preferred = seededUsername || emailLocalPart || `user${String(user?.id || "").replace(/\D/g, "").slice(-4)}`;
  return getDisplayUsername(preferred);
}

function normalizeStoredUser(user) {
  if (!user) {
    return user;
  }

  const username = buildFallbackUsername(user);
  const usernameKey = getUsernameKey(user.usernameKey || user.identity || username);
  const emailAddress = String(user?.profile?.emailAddress || "").trim();

  return {
    ...user,
    identity: usernameKey,
    usernameKey,
    usernameOrEmail: getDisplayUsername(user.usernameOrEmail || username),
    profile: {
      ...user.profile,
      username: getDisplayUsername(user.profile?.username || username),
      emailAddress,
    },
  };
}

function getPersistableUsers(users) {
  return users
    .map(normalizeStoredUser)
    .filter((entry) => entry.id !== DEFAULT_TEST_USER.id)
    .reduce((uniqueUsers, user) => {
      if (!uniqueUsers.some((entry) => entry.usernameKey === user.usernameKey)) {
        uniqueUsers.push(user);
      }

      return uniqueUsers;
    }, []);
}

function persistUsers(users) {
  writeJson(USERS_KEY, getPersistableUsers(users));
}

function findUserById(userId) {
  return getStoredUsers().find((entry) => entry.id === userId);
}

export function getDefaultAppState() {
  return structuredClone(DEFAULT_APP_STATE);
}

export function getUserAppState(user) {
  const rawAppState = {
    ...getDefaultAppState(),
    ...(user?.appState || {}),
  };
  const stepStates = Object.keys(rawAppState.stepStates || {}).length
    ? rawAppState.stepStates
    : Object.keys(rawAppState.taskStatuses || {}).length ||
        Object.keys(rawAppState.proofUploads || {}).length ||
        Object.keys(rawAppState.projectLinks || {}).length
      ? Object.keys({
          ...(rawAppState.taskStatuses || {}),
          ...(rawAppState.proofUploads || {}),
          ...(rawAppState.projectLinks || {}),
        }).reduce((accumulator, taskId) => {
          accumulator[taskId] = normalizeStepState({
            projectLink: rawAppState.projectLinks?.[taskId] || "",
            proofFile: rawAppState.proofUploads?.[taskId] || null,
            verificationStatus:
              rawAppState.taskStatuses?.[taskId] === "completed"
                ? "VERIFIED"
                : rawAppState.taskStatuses?.[taskId] === "verifying"
                  ? "VERIFYING"
                  : rawAppState.taskStatuses?.[taskId] === "in_progress"
                    ? "DATA_SUBMITTED"
                    : "IDLE",
            completionStatus:
              rawAppState.taskStatuses?.[taskId] === "completed" ? "COMPLETED" : "IDLE",
          });
          return accumulator;
        }, {})
      : {};
  const legacyStepFields = getDerivedLegacyStepFields(stepStates);

  return {
    ...rawAppState,
    stepStates,
    ...legacyStepFields,
    navigation: {
      ...DEFAULT_APP_STATE.navigation,
      ...(user?.appState?.navigation || {}),
    },
  };
}

export function isProfileComplete(user) {
  const profile = user?.profile;

  return Boolean(
    profile?.fullName &&
      profile?.mobileNumber &&
      profile?.age &&
      profile?.preferredLanguage,
  );
}

export function getStoredUsers() {
  const users = readJson(USERS_KEY, []).map(normalizeStoredUser);
  const hasTestUser = users.some((user) => user.usernameKey === DEFAULT_TEST_USER.usernameKey);
  const normalizedUsers = hasTestUser
    ? users
    : [...users, DEFAULT_TEST_USER].map(normalizeStoredUser);

  return normalizedUsers.reduce((uniqueUsers, user) => {
    const existingIndex = uniqueUsers.findIndex((entry) => entry.usernameKey === user.usernameKey);

    if (existingIndex === -1) {
      uniqueUsers.push(user);
      return uniqueUsers;
    }

    if (user.id !== DEFAULT_TEST_USER.id) {
      uniqueUsers[existingIndex] = {
        ...uniqueUsers[existingIndex],
        ...user,
        appState: {
          ...getUserAppState(uniqueUsers[existingIndex]),
          ...(user.appState || {}),
        },
      };
    }

    return uniqueUsers;
  }, []);
}

export function getStoredSession() {
  const session = readJson(SESSION_KEY, null);

  if (!session?.loggedIn || !session.userId) {
    return null;
  }

  if (session.expiresAt && Date.parse(session.expiresAt) <= Date.now()) {
    clearStoredSession();
    return null;
  }

  const user = findUserById(session.userId);

  if (!user) {
    return null;
  }

  if (!session.sessionToken) {
    const upgradedSession = {
      ...session,
      username: user.profile?.username || user.usernameOrEmail,
      usernameKey: user.usernameKey,
      sessionToken: createId("session"),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };

    writeJson(SESSION_KEY, upgradedSession);
    return upgradedSession;
  }

  return session;
}

export function clearStoredSession() {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function updateStoredSessionAuthMode(authMode) {
  const session = getStoredSession();

  if (!session) {
    return null;
  }

  const nextSession = {
    ...session,
    authMode,
  };

  writeJson(SESSION_KEY, nextSession);
  return nextSession;
}

function createSession(user, authMode = "existing") {
  const appState = getUserAppState(user);
  const session = {
    userId: user.id,
    username: user.profile?.username || user.usernameOrEmail,
    usernameKey: user.usernameKey,
    sessionToken: createId("session"),
    loggedInAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    loggedIn: true,
    preferredLanguage: user?.profile?.preferredLanguage || "en",
    authMode,
    navigation: appState.navigation,
  };

  writeJson(SESSION_KEY, session);
  return session;
}

function findUserByIdentity(identity) {
  const normalizedIdentity = getUsernameKey(identity);

  return getStoredUsers().find((entry) => {
    const username = getUsernameKey(entry?.profile?.username || entry?.usernameOrEmail || "");

    return normalizedIdentity === entry.usernameKey || normalizedIdentity === entry.identity || normalizedIdentity === username;
  });
}

async function upgradeLegacyPassword(user, password) {
  if (!user?.password || user.passwordCredential?.hash) {
    return user;
  }

  const users = getStoredUsers();
  const upgradedUser = {
    ...user,
    password: undefined,
    passwordCredential: await hashPassword(password),
  };

  persistUsers(users.map((entry) => (entry.id === user.id ? upgradedUser : entry)));

  return upgradedUser;
}

export async function loginMockUser(identity, password) {
  const user = findUserByIdentity(identity);

  if (!user) {
    return {
      ok: false,
      code: "no_account",
    };
  }

  const passwordMatches = await verifyPassword(user, password);

  if (!passwordMatches) {
    return {
      ok: false,
      code: "wrong_password",
    };
  }

  const authenticatedUser = await upgradeLegacyPassword(user, password);

  return {
    ok: true,
    user: authenticatedUser,
    session: createSession(authenticatedUser, "existing"),
  };
}

export async function createMockProfile(profileData) {
  const displayUsername = getDisplayUsername(profileData.username);
  const usernameKey = getUsernameKey(displayUsername);
  const normalizedEmail = getEmailKey(profileData.emailAddress);
  const users = getStoredUsers();
  const existingUser = users.find(
    (entry) =>
      entry.usernameKey === usernameKey ||
      entry.identity === usernameKey ||
      getUsernameKey(entry?.profile?.username || "") === usernameKey,
  );
  const existingEmail = normalizedEmail
    ? users.find((entry) => getEmailKey(entry?.profile?.emailAddress || "") === normalizedEmail)
    : null;

  if (existingUser) {
    return {
      ok: false,
      code: "username_exists",
    };
  }

  if (existingEmail) {
    return {
      ok: false,
      code: "email_exists",
    };
  }

  const user = {
    id: createId("user"),
    identity: usernameKey,
    usernameKey,
    usernameOrEmail: displayUsername,
    passwordCredential: await hashPassword(profileData.password),
    profile: {
      fullName: profileData.fullName.trim(),
      username: displayUsername,
      emailAddress: String(profileData.emailAddress || "").trim(),
      mobileNumber: profileData.mobileNumber.trim(),
      age: profileData.age.trim(),
      casteCategory: profileData.casteCategory,
      preferredLanguage: profileData.preferredLanguage,
      displayName: profileData.fullName.trim(),
      createdAt: new Date().toISOString(),
      simulationTier: "Explorer",
      focusTrack: "AI Product Strategy",
    },
    appState: getDefaultAppState(),
  };

  persistUsers([...users, normalizeStoredUser(user)]);

  return {
    ok: true,
    user,
    session: createSession(user, "new"),
  };
}

export function updateStoredUserProfile(userId, profileUpdates) {
  const users = getStoredUsers();
  let updatedUser = null;

  const nextUsers = users.map((entry) => {
    if (entry.id !== userId) {
      return entry;
    }

    updatedUser = {
      ...entry,
      profile: {
        ...entry.profile,
        ...profileUpdates,
        displayName: profileUpdates.fullName || entry.profile.displayName,
      },
    };

    return updatedUser;
  });

  persistUsers(nextUsers);

  return updatedUser;
}

export function updateStoredUserAppState(userId, appStateUpdates) {
  const users = getStoredUsers();
  let updatedUser = null;

  const nextUsers = users.map((entry) => {
    if (entry.id !== userId) {
      return entry;
    }

    const currentAppState = getUserAppState(entry);
    const nextNavigation =
      appStateUpdates.navigation === undefined
        ? currentAppState.navigation
        : {
            ...currentAppState.navigation,
            ...appStateUpdates.navigation,
          };

    const incomingStepStates = appStateUpdates.stepStates
      ? Object.entries(appStateUpdates.stepStates).reduce((accumulator, [taskId, stepState]) => {
          accumulator[taskId] = normalizeStepState(stepState);
          return accumulator;
        }, {})
      : currentAppState.stepStates;

    updatedUser = {
      ...entry,
      appState: {
        ...currentAppState,
        ...appStateUpdates,
        stepStates: incomingStepStates,
        navigation: nextNavigation,
      },
    };

    return updatedUser;
  });

  persistUsers(nextUsers);

  const session = getStoredSession();
  if (session?.userId === userId && updatedUser) {
    writeJson(SESSION_KEY, {
      ...session,
      navigation: updatedUser.appState.navigation,
    });
  }

  return updatedUser;
}

export function updateUserPreferredLanguage(userId, preferredLanguage) {
  const users = getStoredUsers();
  let updatedUser = null;

  const nextUsers = users.map((entry) => {
    if (entry.id !== userId) {
      return entry;
    }

    updatedUser = {
      ...entry,
      profile: {
        ...entry.profile,
        preferredLanguage,
      },
    };

    return updatedUser;
  });

  persistUsers(nextUsers);

  const session = getStoredSession();
  if (session?.userId === userId) {
    writeJson(SESSION_KEY, {
      ...session,
      preferredLanguage,
    });
  }

  return updatedUser;
}
