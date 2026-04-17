function getPanelClasses(variant, position) {
  const variantClasses = {
    success: "border-emerald-400/20 bg-[#07101f]/95 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.12)]",
    phase: "border-cyan/20 bg-[#07101f]/96 text-white shadow-[0_0_50px_rgba(69,208,255,0.14)]",
    final: "border-aurora/20 bg-[#07101f]/97 text-white shadow-[0_0_60px_rgba(124,92,255,0.18)]",
  };

  const positionClasses =
    position === "bottom"
      ? "feedback-panel-bottom fixed bottom-6 left-1/2 z-[75] w-[min(92vw,34rem)] -translate-x-1/2"
      : "feedback-panel-center fixed inset-0 z-[80] flex items-center justify-center px-6";

  return `${positionClasses} ${variantClasses[variant] || variantClasses.success}`;
}

export default function FeedbackPanel({
  open,
  variant = "success",
  position = "bottom",
  title,
  body,
  actionLabel,
  onAction,
}) {
  if (!open) {
    return null;
  }

  if (position === "center") {
    return (
      <div className={getPanelClasses(variant, position)}>
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-md" />
        <div className="feedback-panel-card relative w-full max-w-xl rounded-[2rem] border px-8 py-8">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <span className="feedback-check h-4 w-4 rounded-full bg-cyan" />
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">
            {variant === "final" ? "Milestone Unlocked" : "Progress Update"}
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-mist">{body}</p>
          {actionLabel ? (
            <button
              type="button"
              onClick={onAction}
              className="motion-button mt-8 inline-flex rounded-full bg-[linear-gradient(135deg,#8a6bff_0%,#45d0ff_55%,#9ef7ff_100%)] px-6 py-3 text-sm font-semibold tracking-[0.18em] text-slate-950"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={getPanelClasses(variant, position)}>
      <div className="feedback-panel-card rounded-full border px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/12">
            <span className="feedback-check h-3 w-3 rounded-full bg-emerald-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            {body ? <p className="mt-1 text-xs text-mist">{body}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
