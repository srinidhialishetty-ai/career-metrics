import { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import PremiumSelect from "../components/PremiumSelect";
import SectionLabel from "../components/SectionLabel";

const casteOptions = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "telugu", label: "Telugu" },
  { value: "tamil", label: "Tamil" },
  { value: "kannada", label: "Kannada" },
];

function FieldGroup({ eyebrow, title, children }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">{eyebrow}</p>
      <p className="mt-3 text-xl font-semibold text-white">{title}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

export default function OnboardingPage({ user, onComplete, onLogout }) {
  const [form, setForm] = useState({
    fullName: user?.profile?.fullName || user?.profile?.displayName || "",
    emailAddress: user?.profile?.emailAddress || user?.usernameOrEmail || "",
    mobileNumber: user?.profile?.mobileNumber || "",
    age: user?.profile?.age || "",
    casteCategory: user?.profile?.casteCategory || "",
    preferredLanguage: user?.profile?.preferredLanguage || "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function updateField(field) {
    return (event) => {
      let nextValue = event.target.value;

      if (field === "mobileNumber") {
        nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
      }

      if (field === "age") {
        nextValue = nextValue.replace(/\D/g, "").slice(0, 2);
      }

      setForm((current) => ({ ...current, [field]: nextValue }));
      setErrors((current) => ({ ...current, [field]: "" }));
    };
  }

  function validate() {
    const nextErrors = {
      fullName: form.fullName.trim() ? "" : "Tell us your full name.",
      emailAddress: form.emailAddress.trim() ? "" : "Add an email address.",
      mobileNumber:
        form.mobileNumber.length === 10 ? "" : "Enter a 10-digit mobile number.",
      age: form.age.trim() ? "" : "Enter your age.",
      casteCategory: form.casteCategory ? "" : "Choose a caste category.",
      preferredLanguage: form.preferredLanguage ? "" : "Choose your preferred language.",
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      setStatus("review");
      return;
    }

    setStatus("saving");
    window.setTimeout(() => {
      onComplete(form);
    }, 700);
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan/70">Career Metrics</p>
          <p className="mt-1 text-sm text-mist">Map Your Way. Win Your Day.</p>
        </div>
        <GlowButton variant="ghost" onClick={onLogout}>
          Logout
        </GlowButton>
      </header>

      <section className="mx-auto mt-6 grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(69,208,255,0.12),transparent_30%)]" />
          <div className="relative">
            <SectionLabel>Profile Initialization</SectionLabel>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              Let&apos;s Personalize Your Simulation
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-mist">
              Tell us a few details so we can tailor your career insights, guidance layers, and simulation outcomes.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">Why this matters</p>
                <p className="mt-3 text-sm leading-7 text-mist">
                  Your personal context helps the engine shape more relevant career pathways, opportunity signals, and localized guidance.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan/65">Prototype note</p>
                <p className="mt-3 text-sm leading-7 text-mist">
                  This onboarding flow is stored locally for demo purposes only. You can move through it quickly and refine the data later.
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FieldGroup eyebrow="Basic Identity" title="Set up the essentials">
              <div className="md:col-span-2">
                <FloatingInput
                  id="fullName"
                  label="Full Name"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  autoComplete="name"
                  error={errors.fullName}
                />
              </div>
              <FloatingInput
                id="emailAddress"
                label="Email Address"
                type="email"
                value={form.emailAddress}
                onChange={updateField("emailAddress")}
                autoComplete="email"
                error={errors.emailAddress}
              />
              <FloatingInput
                id="mobileNumber"
                label="Mobile Number"
                type="tel"
                value={form.mobileNumber}
                onChange={updateField("mobileNumber")}
                autoComplete="tel"
                error={errors.mobileNumber}
              />
            </FieldGroup>

            <FieldGroup eyebrow="Personal Context" title="Refine your guidance layer">
              <FloatingInput
                id="age"
                label="Age"
                type="text"
                value={form.age}
                onChange={updateField("age")}
                error={errors.age}
              />
              <PremiumSelect
                id="casteCategory"
                label="Caste Category"
                value={form.casteCategory}
                onChange={updateField("casteCategory")}
                options={casteOptions}
                error={errors.casteCategory}
              />
              <div className="md:col-span-2">
                <span className="mb-3 block pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan/70">
                  Preferred Language
                </span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {languageOptions.map((option) => {
                    const active = form.preferredLanguage === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setForm((current) => ({ ...current, preferredLanguage: option.value }));
                          setErrors((current) => ({ ...current, preferredLanguage: "" }));
                        }}
                        className={`rounded-3xl border px-4 py-4 text-left text-sm transition duration-300 ${
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
                {errors.preferredLanguage ? (
                  <span className="mt-2 block pl-2 text-xs text-rose-300">
                    {errors.preferredLanguage}
                  </span>
                ) : null}
              </div>
            </FieldGroup>

            <div
              className={`rounded-[1.5rem] border px-4 py-3 text-sm transition duration-300 ${
                status === "saving"
                  ? "border-cyan/30 bg-cyan/10 text-cyan"
                  : "border-white/10 bg-white/[0.04] text-mist"
              }`}
            >
              {status === "saving"
                ? "Initializing your personalized simulation profile..."
                : "Complete these details once and we’ll shape the rest of the experience around you."}
            </div>

            <GlowButton type="submit" className="w-full">
              {status === "saving" ? "Entering Simulation..." : "Proceed to Simulation"}
            </GlowButton>
          </form>
        </GlassPanel>
      </section>
    </div>
  );
}
