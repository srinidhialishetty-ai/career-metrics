import { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import FeedbackPanel from "../components/FeedbackPanel";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import PremiumSelect from "../components/PremiumSelect";
import SectionLabel from "../components/SectionLabel";
import { languageOptions } from "../lib/i18n";
import { createMockProfile, loginMockUser } from "../lib/mockAuth";

const trustSignals = [
  "Role-specific simulation paths",
  "Adaptive AI guidance layer",
  "Market-aware growth forecasting",
];

const casteOptions = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function LoginPage({ onBack, onSuccess, copy }) {
  const [mode, setMode] = useState("existing");
  const [existingForm, setExistingForm] = useState({
    identity: "",
    password: "",
  });
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    age: "",
    casteCategory: "",
    preferredLanguage: "",
    password: "",
    confirmPassword: "",
  });
  const [existingErrors, setExistingErrors] = useState({});
  const [newUserErrors, setNewUserErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState(copy.loginPrompt);
  const [showSuccessPanel, setShowSuccessPanel] = useState(false);

  function switchMode(nextMode) {
    setMode(nextMode);
    setStatus("idle");
    setExistingErrors({});
    setNewUserErrors({});
    setStatusMessage(nextMode === "existing" ? copy.loginPrompt : copy.signupPrompt);
  }

  function updateExistingField(field) {
    return (event) => {
      const nextValue = event.target.value;
      setExistingForm((current) => ({ ...current, [field]: nextValue }));
      setExistingErrors((current) => ({ ...current, [field]: "" }));
    };
  }

  function updateNewUserField(field) {
    return (event) => {
      let nextValue = event.target.value;

      if (field === "mobileNumber") {
        nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
      }

      if (field === "age") {
        nextValue = nextValue.replace(/\D/g, "").slice(0, 2);
      }

      setNewUserForm((current) => ({ ...current, [field]: nextValue }));
      setNewUserErrors((current) => ({ ...current, [field]: "" }));
    };
  }

  function handleExistingSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      identity: existingForm.identity.trim() ? "" : copy.existingEmpty,
      password: existingForm.password.trim() ? "" : copy.existingEmpty,
    };

    if (nextErrors.identity || nextErrors.password) {
      setExistingErrors(nextErrors);
      setStatus("idle");
      setStatusMessage(copy.existingEmpty);
      return;
    }

    const result = loginMockUser(existingForm.identity, existingForm.password);

    if (!result.ok) {
      setStatus("idle");
      setStatusMessage(result.code === "no_account" ? copy.noAccount : copy.wrongPassword);
      setExistingErrors({
        identity: result.code === "no_account" ? copy.noAccount : "",
        password: result.code === "wrong_password" ? copy.wrongPassword : "",
      });
      return;
    }

    setStatus("success");
    setStatusMessage(copy.loginSuccess);
    setShowSuccessPanel(true);

    window.setTimeout(() => {
      setShowSuccessPanel(false);
      onSuccess(result.user, result.session?.authMode || "existing");
    }, 900);
  }

  function handleNewUserSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      fullName: newUserForm.fullName.trim() ? "" : copy.fullNameRequired,
      emailAddress: newUserForm.emailAddress.trim() ? "" : copy.emailRequired,
      mobileNumber: newUserForm.mobileNumber.length === 10 ? "" : copy.mobileRequired,
      age:
        newUserForm.age.trim() && Number(newUserForm.age) >= 12 && Number(newUserForm.age) <= 100
          ? ""
          : copy.ageRequired,
      casteCategory: "",
      preferredLanguage: newUserForm.preferredLanguage ? "" : copy.languageRequired,
      password: newUserForm.password.trim() ? "" : copy.passwordRequired,
      confirmPassword: newUserForm.confirmPassword.trim()
        ? ""
        : copy.confirmPasswordRequired,
    };

    if (
      !nextErrors.password &&
      !nextErrors.confirmPassword &&
      newUserForm.password !== newUserForm.confirmPassword
    ) {
      nextErrors.confirmPassword = copy.passwordMismatch;
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setNewUserErrors(nextErrors);
      setStatus("idle");
      setStatusMessage(copy.signupPrompt);
      return;
    }

    const result = createMockProfile(newUserForm);

    if (!result.ok) {
      setStatus("idle");
      setStatusMessage(copy.duplicateEmail);
      setNewUserErrors((current) => ({
        ...current,
        emailAddress: copy.duplicateEmail,
      }));
      return;
    }

    setStatus("success");
    setStatusMessage(copy.signupSuccess);
    setShowSuccessPanel(true);

    window.setTimeout(() => {
      setShowSuccessPanel(false);
      onSuccess(result.user, result.session?.authMode || "new");
    }, 900);
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">Map Your Way. Win Your Day.</p>
        </div>
        <GlowButton variant="ghost" onClick={onBack}>
          {copy.returnToLanding}
        </GlowButton>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-8 lg:min-h-[calc(100vh-120px)] lg:grid-cols-[1fr_0.95fr]">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.12),transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <SectionLabel>{copy.sectionLabel}</SectionLabel>
              <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-mist">
                {copy.body}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/35"
                >
                  <div className="h-9 w-9 rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.28),rgba(69,208,255,0.24))]" />
                  <p className="mt-4 text-sm leading-7 text-white">{signal}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-[#07101f]/80 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">{copy.previewLabel}</p>
              <p className="mt-4 text-2xl leading-10 text-white">
                {copy.previewBody}
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-mist">
                <span className="inline-flex h-3 w-3 rounded-full bg-cyan shadow-[0_0_18px_rgba(69,208,255,0.7)]" />
                {copy.previewStatus}
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="self-center p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan/70">{copy.systemAccess}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
            {copy.modeTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-mist">
            {copy.modeBody}
          </p>

          <div className="mt-8 rounded-full border border-white/10 bg-white/[0.04] p-1">
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: "existing", label: copy.existingUser },
                { id: "new", label: copy.newUser },
              ].map((option) => {
                const active = mode === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => switchMode(option.id)}
                    className={`motion-button rounded-full px-4 py-3 text-sm font-semibold transition duration-300 ${
                      active
                        ? "bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(69,208,255,0.95))] text-slate-950 shadow-[0_0_30px_rgba(69,208,255,0.18)]"
                        : "text-mist hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 min-h-[42rem]">
            <div
              key={mode}
              className="animate-rise rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6"
            >
              {mode === "existing" ? (
                <>
                  <div>
                    <p className="text-lg font-semibold text-white">{copy.existingUser}</p>
                    <p className="mt-2 text-sm leading-7 text-mist">
                      {copy.existingCopy}
                    </p>
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleExistingSubmit}>
                    <FloatingInput
                      id="identity"
                      label={copy.emailOrUsername}
                      type="text"
                      value={existingForm.identity}
                      onChange={updateExistingField("identity")}
                      autoComplete="username"
                      error={existingErrors.identity}
                    />
                    <FloatingInput
                      id="password"
                      label={copy.password}
                      type="password"
                      value={existingForm.password}
                      onChange={updateExistingField("password")}
                      autoComplete="current-password"
                      error={existingErrors.password}
                    />

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-3 text-mist">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan"
                        />
                        {copy.keepSession}
                      </label>
                      <button type="button" className="text-cyan transition hover:text-cyan/80">
                        {copy.forgotPassword}
                      </button>
                    </div>

                    <div
                      className={`rounded-[1.5rem] border px-4 py-3 text-sm transition duration-300 ${
                        status === "success"
                          ? "border-cyan/30 bg-cyan/10 text-cyan"
                          : "border-white/10 bg-white/[0.04] text-mist"
                      }`}
                    >
                      {statusMessage}
                    </div>

                    <GlowButton type="submit" className="w-full">
                      {copy.loginToContinue}
                    </GlowButton>
                  </form>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-semibold text-white">{copy.newUser}</p>
                    <p className="mt-2 text-sm leading-7 text-mist">
                      {copy.newCopy}
                    </p>
                  </div>

                  <form className="mt-6 space-y-6" onSubmit={handleNewUserSubmit}>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{copy.basicInfo}</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <FloatingInput
                            id="fullName"
                            label={copy.fullName}
                            value={newUserForm.fullName}
                            onChange={updateNewUserField("fullName")}
                            autoComplete="name"
                            error={newUserErrors.fullName}
                          />
                        </div>
                        <FloatingInput
                          id="emailAddress"
                          label={copy.emailAddress}
                          type="email"
                          value={newUserForm.emailAddress}
                          onChange={updateNewUserField("emailAddress")}
                          autoComplete="email"
                          error={newUserErrors.emailAddress}
                        />
                        <FloatingInput
                          id="mobileNumber"
                          label={copy.mobileNumber}
                          type="tel"
                          value={newUserForm.mobileNumber}
                          onChange={updateNewUserField("mobileNumber")}
                          autoComplete="tel"
                          helperText={copy.mobileHelper}
                          error={newUserErrors.mobileNumber}
                        />
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">
                        {copy.personalContext}
                      </p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <FloatingInput
                          id="age"
                          label={copy.age}
                          type="text"
                          value={newUserForm.age}
                          onChange={updateNewUserField("age")}
                          helperText={copy.ageHelper}
                          error={newUserErrors.age}
                        />
                        <PremiumSelect
                          id="casteCategory"
                          label={copy.casteCategory}
                          value={newUserForm.casteCategory}
                          onChange={updateNewUserField("casteCategory")}
                          options={casteOptions}
                          error={newUserErrors.casteCategory}
                        />
                        <div className="md:col-span-2">
                          <span className="mb-3 block pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan/70">
                            {copy.preferredLanguage}
                          </span>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {languageOptions.map((option) => {
                              const active = newUserForm.preferredLanguage === option.value;

                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setNewUserForm((current) => ({
                                      ...current,
                                      preferredLanguage: option.value,
                                    }));
                                    setNewUserErrors((current) => ({
                                      ...current,
                                      preferredLanguage: "",
                                    }));
                                  }}
                                  className={`motion-panel rounded-3xl border px-4 py-4 text-left text-sm transition duration-300 ${
                                    active
                                      ? "border-cyan/45 bg-cyan/12 text-white shadow-[0_0_30px_rgba(69,208,255,0.12)]"
                                      : "border-white/10 bg-white/[0.04] text-mist hover:border-white/20 hover:bg-white/[0.06]"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                          {newUserErrors.preferredLanguage ? (
                            <span className="mt-2 block pl-2 text-xs text-rose-300">
                              {newUserErrors.preferredLanguage}
                            </span>
                          ) : null}
                        </div>
                        <FloatingInput
                          id="newPassword"
                          label={copy.password}
                          type="password"
                          value={newUserForm.password}
                          onChange={updateNewUserField("password")}
                          error={newUserErrors.password}
                        />
                        <FloatingInput
                          id="confirmPassword"
                          label={copy.confirmPassword}
                          type="password"
                          value={newUserForm.confirmPassword}
                          onChange={updateNewUserField("confirmPassword")}
                          error={newUserErrors.confirmPassword}
                        />
                      </div>
                    </div>

                    <div
                      className={`rounded-[1.5rem] border px-4 py-3 text-sm transition duration-300 ${
                        status === "success"
                          ? "border-cyan/30 bg-cyan/10 text-cyan"
                          : "border-white/10 bg-white/[0.04] text-mist"
                      }`}
                    >
                      {statusMessage}
                    </div>

                    <GlowButton type="submit" className="w-full">
                      {copy.initializeProfile}
                    </GlowButton>
                  </form>
                </>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>

      <FeedbackPanel
        open={showSuccessPanel}
        variant="phase"
        position="center"
        title={mode === "existing" ? "Login successful. Welcome back." : "Profile initialized successfully."}
        body={mode === "existing" ? "You're in. Let's continue your journey." : "Your simulation environment is ready. Preparing your personalized control room."}
        actionLabel="Continue"
        onAction={() => {
          setShowSuccessPanel(false);
        }}
      />
    </div>
  );
}
