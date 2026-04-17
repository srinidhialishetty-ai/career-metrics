export default function GlowButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}) {
  const variants = {
    primary:
      "bg-[linear-gradient(135deg,#8a6bff_0%,#45d0ff_55%,#9ef7ff_100%)] text-slate-950 shadow-glow hover:scale-[1.02]",
    ghost:
      "border border-white/15 bg-white/5 text-white hover:border-cyan/50 hover:bg-white/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      data-magnetic
      className={`motion-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[0.18em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
