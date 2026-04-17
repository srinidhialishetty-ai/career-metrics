const USERS_KEY = "career-metrics.mock-users";
const SESSION_KEY = "career-metrics.mock-session";

const DEFAULT_APP_STATE = {
  selectedDomains: [],
  difficultyLevel: "Moderate",
  skillInvestment: 1,
  riskPreference: "Medium",
  selectedRole: "Data Analyst",
  selectedRoadmapDomain: "tech",
  taskStatuses: {},
  proofUploads: {},
  navigation: {
    view: "dashboard",
    role: "Data Analyst",
    stepIndex: 0,
  },
};

// Default test user for development
const DEFAULT_TEST_USER = {
  id: "test_user_001",
  identity: "test@example.com",
  usernameOrEmail: "test@example.com",
  password: "test123",
  profile: {
    fullName: "Test User",
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
  return identity.trim().toLowerCase();
}

export function getDefaultAppState() {
  return structuredClone(DEFAULT_APP_STATE);
}

export function getUserAppState(user) {
  return {
    ...getDefaultAppState(),
    ...(user?.appState || {}),
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
      profile?.emailAddress &&
      profile?.mobileNumber &&
      profile?.age &&
      profile?.preferredLanguage,
  );
}

export function getStoredUsers() {
  const users = readJson(USERS_KEY, []);
  // Always include default test user for development
  const hasTestUser = users.some(u => u.identity === DEFAULT_TEST_USER.identity);
  if (!hasTestUser) {
    return [...users, DEFAULT_TEST_USER];
  }
  return users;
}

export function getStoredSession() {
  return readJson(SESSION_KEY, null);
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
    identity: user.identity,
    loggedInAt: new Date().toISOString(),
    loggedIn: true,
    preferredLanguage: user?.profile?.preferredLanguage || "en",
    authMode,
    navigation: appState.navigation,
  };

  writeJson(SESSION_KEY, session);
  return session;
}

function findUserByIdentity(identity) {
  const normalizedIdentity = sanitizeIdentity(identity);

  return getStoredUsers().find((entry) => {
    const fullName = sanitizeIdentity(entry?.profile?.fullName || "");
    const email = sanitizeIdentity(entry?.profile?.emailAddress || "");
    const username = sanitizeIdentity(entry?.usernameOrEmail || "");

    return (
      normalizedIdentity === entry.identity ||
      normalizedIdentity === email ||
      normalizedIdentity === username ||
      normalizedIdentity === fullName
    );
  });
}

export function loginMockUser(identity, password) {
  const user = findUserByIdentity(identity);

  if (!user) {
    return {
      ok: false,
      code: "no_account",
    };
  }

  if (user.password !== password) {
    return {
      ok: false,
      code: "wrong_password",
    };
  }

  return {
    ok: true,
    user,
    session: createSession(user, "existing"),
  };
}

export function createMockProfile(profileData) {
  const normalizedIdentity = sanitizeIdentity(profileData.emailAddress);
  const users = getStoredUsers();
  const existingUser = users.find((entry) => entry.identity === normalizedIdentity);

  if (existingUser) {
    return {
      ok: false,
      code: "email_exists",
    };
  }

  const user = {
    id: `user_${Date.now()}`,
    identity: normalizedIdentity,
    usernameOrEmail: profileData.emailAddress.trim(),
    password: profileData.password,
    profile: {
      fullName: profileData.fullName.trim(),
      emailAddress: profileData.emailAddress.trim(),
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

  writeJson(USERS_KEY, [...users, user]);

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

  writeJson(USERS_KEY, nextUsers);

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

    updatedUser = {
      ...entry,
      appState: {
        ...currentAppState,
        ...appStateUpdates,
        navigation: nextNavigation,
      },
    };

    return updatedUser;
  });

  writeJson(USERS_KEY, nextUsers);

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

  writeJson(USERS_KEY, nextUsers);

  const session = getStoredSession();
  if (session?.userId === userId) {
    writeJson(SESSION_KEY, {
      ...session,
      preferredLanguage,
    });
  }

  return updatedUser;
}
