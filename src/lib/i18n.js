export const LANGUAGE_STORAGE_KEY = "career-metrics.ui-language";

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "te", label: "Telugu" },
  { value: "hi", label: "Hindi" },
];

export function getLanguageLabel(language) {
  const locale = resolveLocale(language);
  return languageOptions.find((option) => option.value === locale)?.label || "English";
}

export function resolveLocale(language) {
  const normalized = String(language || "").trim().toLowerCase();

  if (["te", "telugu"].includes(normalized)) {
    return "te";
  }

  if (["hi", "hindi"].includes(normalized)) {
    return "hi";
  }

  return "en";
}

const translations = {
  en: {
    landing: {
      productSubtitle: "AI-powered career decision simulator",
      accessSystem: "Access System",
      heroEyebrow: "Simulation Engine",
      heroTitle: "What If You Could Simulate Your Future Before Living It?",
      heroBody:
        "AI-powered career intelligence that maps your journey using real-world data, scenario modeling, and future-facing insight streams.",
      heroTagline: "Map Your Way. Win Your Day.",
      startSimulation: "Start Simulation",
      viewIntelligence: "View Intelligence Layer",
      simulationsValue: "2.4M+",
      simulationsLabel: "Career path simulations modeled",
      confidenceValue: "97%",
      confidenceLabel: "Signal confidence on role trend detection",
      boardLabel: "Simulation Board",
      boardTitle: "Adaptive Career Twin",
      liveSync: "Live Sync",
      growthLabel: "Projected 3-year growth",
      confidenceText: "Confidence",
      high: "High",
      updatedFeed: "Updated from live scenario feed",
      compensation: "Compensation",
      demandIndex: "Demand Index",
      skillAdvantage: "Skill Advantage",
      trajectory: "Trajectory",
      trajectoryValue: "Product Strategy Lead",
      trajectoryBody:
        "Current signals show a strong transition lane into strategy-led AI product roles.",
      timeline: "Timeline",
      timelineFirst: "Upskill in AI systems design",
      timelineSecond: "Transition window opens in 6 months",
      howItWorks: "How The Engine Works",
      howTitle: "Every decision becomes a modeled system, not a guess.",
      step1Title: "Input Profile",
      step1Body:
        "Capture your interests, current role, strengths, and ambitions in one adaptive signal layer.",
      step2Title: "Run Simulation",
      step2Body:
        "Project branching futures across markets, industries, skill trajectories, and timing windows.",
      step3Title: "Analyze Future",
      step3Body:
        "Translate complexity into actionable paths with confidence ranges, inflection points, and risk markers.",
      whatYouCanSimulate: "What You Can Simulate",
      salaryGrowth: "Salary growth",
      careerDemand: "Career demand",
      riskAnalysis: "Risk analysis",
      skillGaps: "Skill gaps",
      lifestyleOutcomes: "Lifestyle outcomes",
      predictivePreview: "Predictive Insight Preview",
      aiOutput: "AI System Output",
      predictiveCopy:
        "You are trending towards high-growth tech careers with moderate volatility and a strong upside if you compound strategy, AI fluency, and leadership depth in the next 18 months.",
      systemAccess: "System Access",
      finalTitle: "Stop Guessing. Start Mapping.",
      finalBody:
        "Step into a future-facing control room built to decode your next move with clarity, velocity, and conviction.",
      enterCareerMetrics: "Enter Career Metrics",
    },
    auth: {
      sectionLabel: "Entry Layer",
      title: "Access Your Simulation Engine",
      body:
        "Select your mode of entry and continue into a cinematic control room for career forecasting, decision testing, and future-state analysis.",
      previewLabel: "System Preview",
      previewBody:
        "High-alignment pathways detected across product strategy, AI systems thinking, and leadership growth scenarios.",
      previewStatus: "Simulation engine is ready for guided entry",
      systemAccess: "System Access",
      modeTitle: "Choose how you want to enter",
      modeBody:
        "Switch instantly between returning access and first-time profile setup without leaving the system.",
      existingUser: "Existing User",
      newUser: "New User",
      existingCopy: "Welcome back. Continue your simulation journey.",
      newCopy: "Create your profile and personalize your experience.",
      emailOrUsername: "Email or Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      keepSession: "Keep session active",
      forgotPassword: "Forgot password",
      loginToContinue: "Login to Continue",
      initializeProfile: "Initialize Profile",
      basicInfo: "Basic Info",
      personalContext: "Personal Context",
      fullName: "Your Full Name",
      emailAddress: "Email Address",
      mobileNumber: "Mobile Number",
      age: "Your Age",
      casteCategory: "Caste Category (Optional)",
      preferredLanguage: "Preferred Language",
      mobileHelper: "Enter a valid 10-digit number",
      ageHelper: "Must be between 12 and 100",
      returnToLanding: "Return to Landing",
      noAccount: "No account found. Please sign up as a new user.",
      wrongPassword: "Incorrect password. Please try again.",
      existingEmpty: "Enter both fields to continue.",
      duplicateEmail: "An account with this email already exists. Please log in.",
      passwordRequired: "Create a password to continue.",
      confirmPasswordRequired: "Confirm your password to continue.",
      passwordMismatch: "Passwords do not match.",
      fullNameRequired: "Tell us your full name.",
      emailRequired: "Add your email address.",
      mobileRequired: "Enter a 10-digit mobile number.",
      ageRequired: "Enter your age.",
      languageRequired: "Choose your preferred language.",
      loginSuccess: "Welcome back. Synchronizing your simulation cockpit...",
      signupSuccess: "Profile initialized. Preparing your personalized simulation...",
      loginPrompt: "Welcome back. Continue your simulation journey.",
      signupPrompt: "Create your profile and personalize your experience.",
    },
    dashboard: {
      subtitle: "Simulation Dashboard",
      activeProfile: "Active profile",
      logout: "Logout",
      welcome: "Welcome",
      simulationActive: "Simulation Active",
      profileInitialized: "Profile Initialized",
      welcomeBack: "Welcome back",
      body:
        "Your session is active. The engine is ready to compare paths, surface inflection points, and map the next high-upside move.",
      newUserBody:
        "Your profile is ready. Let's begin your personalized simulation.",
      identity: "Identity",
      track: "Track",
      tier: "Tier",
      age: "Age",
      category: "Category",
      language: "Preferred Language",
      liveOutput: "Live Output",
      liveOutputBody:
        "You are trending toward high-growth leadership roles with strong leverage if you keep building AI-native decision skills and strategic communication.",
      careerArc: "Career Arc",
      careerArcValue: "Upward Momentum",
      careerArcBody:
        "Your current profile maps best to product, AI systems, and strategy-led leadership roles.",
      volatility: "Volatility",
      volatilityValue: "Moderate",
      volatilityBody:
        "Strong upside remains intact if you keep compounding execution depth with AI fluency.",
      nextMove: "Next Move",
      nextMoveValue: "Skill Stack",
      nextMoveBody:
        "Lean into communication, systems design, and decision frameworks to unlock higher-leverage paths.",
      prototypeAuth: "Prototype Auth",
      demoMode: "Demo mode enabled",
      prototypeBody:
        "This session is stored locally for prototype use only. Replace the mock auth layer with a real backend provider when you are ready for production auth.",
      languageSwitcher: "Website Language",
    },
  },
};
export function persistLanguage() {
  return "en";
}

export function getPersistedLanguage() {
  return "en";
}

export function getTranslations() {
  return translations.en;
}
